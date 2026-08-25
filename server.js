import http from 'node:http'

const port = Number(process.env.AI_PORT || 3001)
const apiKey = process.env.OPENAI_API_KEY
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const sendJson = (response, status, body) => {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

const readBody = (request) => new Promise((resolve, reject) => {
  let body = ''
  request.on('data', (chunk) => {
    body += chunk
    if (body.length > 100000) {
      reject(new Error('הפתרון גדול מדי'))
      request.destroy()
    }
  })
  request.on('end', () => resolve(JSON.parse(body)))
  request.on('error', reject)
})

const server = http.createServer(async (request, response) => {
  if (request.method !== 'POST' || request.url !== '/api/check-solution') {
    sendJson(response, 404, { error: 'הנתיב לא נמצא' })
    return
  }

  if (!apiKey) {
    sendJson(response, 503, { error: 'חסר OPENAI_API_KEY בקובץ הסביבה' })
    return
  }

  try {
    const { exercise, solution } = await readBody(request)
    if (!exercise || !solution?.trim()) {
      sendJson(response, 400, { error: 'יש לשלוח תרגיל ופתרון' })
      return
    }

    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        store: false,
        text: { format: { type: 'json_object' } },
        input: [
          {
            role: 'system',
            content: 'אתה מורה מתכנת מנוסה. בדוק את הפתרון לפי דרישות התרגיל. החזר JSON בלבד בפורמט: {"mark": number, "feedback": string}. הציון בין 0 ל-100. המשוב בעברית, קצר, ענייני, ומכיל לפחות הצעה אחת לשיפור אם יש צורך.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              exercise: {
                name: exercise.name,
                course: exercise.course,
                difficulty: exercise.difficulty,
                description: exercise.description,
                example: exercise.code,
              },
              studentSolution: solution,
            }),
          },
        ],
      }),
    })

    const result = await aiResponse.json()
    if (!aiResponse.ok) {
      sendJson(response, aiResponse.status, { error: result.error?.message || 'בדיקת ה-AI נכשלה' })
      return
    }

    const outputText = result.output_text || result.output?.flatMap((item) => item.content || []).find((item) => item.type === 'output_text')?.text
    const feedback = JSON.parse(outputText)
    sendJson(response, 200, {
      mark: Math.max(0, Math.min(100, Number(feedback.mark))),
      message: feedback.feedback,
    })
  } catch (error) {
    sendJson(response, 500, { error: error.message || 'אירעה שגיאה בבדיקת הפתרון' })
  }
})

server.listen(port, () => {
  console.log(`AI server listening on http://localhost:${port}`)
})
