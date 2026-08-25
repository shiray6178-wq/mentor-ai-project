//קומפוננטה שמציגה את פרטי התרגיל
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Navbar'

export default function ExerciseDetails({ exercises, onSubmit, role, user, onLogout }) {
  const { exerciseId } = useParams()
  const exercise = exercises.find((item) => String(item.id) === exerciseId)
  const [solution, setSolution] = useState('')
  const [mark, setMark] = useState(null)

  const submitSolution = () => {
    if (!solution.trim()) return
    const score = Math.floor(Math.random() * 41) + 60
    setMark(score)
    onSubmit({ exerciseName: exercise.name, mark: score, message: 'הפתרון נקלט וקיבל ציון אוטומטי', solution })
  }

  return (
    <section className="exercise-section" dir="rtl">
      <Navbar role={role} user={user} onLogout={onLogout} />
      <div className="page-container">
        <div className="exercise-card exercise-details-page">
          {exercise ? (
            <>
              <Link className="back-to-exercises" to={role === 'teacher' ? '/teacher' : '/exercises'} aria-label="חזרה לרשימת התרגילים">→ חזרה לרשימת התרגילים</Link>
              <p className="details-eyebrow">פרטי התרגיל</p>
              <div className="exercise-heading">{exercise.name}</div>
              <div className="details-meta">
                <span>{exercise.course}</span>
                <span>{exercise.difficulty}</span>
                <span>{exercise.points} נקודות</span>
              </div>
              <div className="details-instructions">
                <h3>מה צריך לעשות?</h3>
                <p>{exercise.description}</p>
              </div>
              <div className="exercise-prompt"><strong>השאלה לתרגיל</strong><br />{exercise.code}</div>
              <p className="details-note">קראו את השאלה, חשבו על הפתרון וכתבו תשובה מלאה במסך ההגשה.</p>
              {role === 'student' && <div className="detail-answer-area"><label className="solution-label" htmlFor="detail-solution">התשובה שלך</label><textarea id="detail-solution" className="solution-input" value={solution} onChange={(event) => setSolution(event.target.value)} placeholder="כתבו כאן את הפתרון שלכם" rows="6" /><button type="button" className="submit-button" onClick={submitSolution}>שליחה וקבלת ציון</button>{mark !== null && <p className="detail-score">הציון שלך: {mark}%</p>}</div>}
              {role === 'teacher' && <Link className="submit-button details-link" to="/teacher">חזרה ללוח המורה</Link>}
            </>
          ) : (
            <>
              <div className="exercise-heading">התרגיל לא נמצא</div>
              <Link className="details-back-link" to={role === 'teacher' ? '/teacher' : '/exercises'}>חזרה לתרגילים</Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
