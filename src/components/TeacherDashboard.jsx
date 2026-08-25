import { useState } from 'react'
import Navbar from './Navbar'

const emptyExercise = { name: '', course: '', description: '', dueDate: '', difficulty: 'מתחילים', points: 10, code: '' }

export default function TeacherDashboard({ exercises, grades, onAddExercise, onDeleteExercise, role, user, onLogout }) {
  const [formData, setFormData] = useState(emptyExercise)
  const [message, setMessage] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  const addExercise = (event) => {
    event.preventDefault()
    onAddExercise({ ...formData, points: Number(formData.points) })
    setFormData(emptyExercise)
    setMessage('התרגיל נוסף בהצלחה')
  }

  return (
    <section className="students-section" dir="rtl">
      <Navbar role={role} user={user} onLogout={onLogout} />
      <div className="teacher-dashboard page-container students-container teacher-dashboard-layout">
        <div className="students-card">
          <div className="exercise-heading">לוח המורה</div>
          <div className="teacher-stats">
            <div><strong>{exercises.length}</strong><span>תרגילים במאגר</span></div>
            <div><strong>{grades.length}</strong><span>הגשות לבדיקה</span></div>
          </div>
        </div>

        <div className="students-card">
          <div className="exercise-heading">רשימת התרגילים</div>
          <div className="teacher-exercise-list">
            {exercises.map((exercise) => (
              <div className="teacher-exercise-item" key={exercise.id}>
                <div><strong>{exercise.name}</strong><span>{exercise.course} | {exercise.difficulty}</span></div>
                <div className="item-actions"><span>{exercise.dueDate}</span><button type="button" className="delete-button" onClick={() => { if (window.confirm(`למחוק את ${exercise.name}?`)) onDeleteExercise(exercise.id) }}>מחק</button></div>
              </div>
            ))}
            {!exercises.length && <p className="empty-state">אין עדיין תרגילים במאגר</p>}
          </div>
        </div>

        <div className="students-card">
          <div className="exercise-heading">הוספת תרגיל חדש</div>
          <form className="teacher-form" onSubmit={addExercise}>
            <label htmlFor="exercise-name">שם התרגיל</label>
            <input id="exercise-name" name="name" value={formData.name} onChange={updateField} placeholder="למשל: תרגיל 6 - תנאים" required />
            <label htmlFor="exercise-course">מקצוע / קורס</label>
            <input id="exercise-course" name="course" value={formData.course} onChange={updateField} placeholder="JavaScript" required />
            <label htmlFor="exercise-description">תיאור התרגיל</label>
            <textarea id="exercise-description" name="description" value={formData.description} onChange={updateField} placeholder="מה התלמיד צריך לבצע?" rows="3" required />
            <div className="teacher-form-grid">
              <div><label htmlFor="exercise-date">תאריך הגשה</label><input id="exercise-date" name="dueDate" type="date" value={formData.dueDate} onChange={updateField} required /></div>
              <div><label htmlFor="exercise-points">ניקוד</label><input id="exercise-points" name="points" type="number" min="1" max="100" value={formData.points} onChange={updateField} required /></div>
            </div>
            <label htmlFor="exercise-difficulty">רמת קושי</label>
            <select id="exercise-difficulty" name="difficulty" className="exercise-select" value={formData.difficulty} onChange={updateField}><option>מתחילים</option><option>בינוני</option><option>מתקדם</option></select>
            <label htmlFor="exercise-code">קוד לדוגמה / הנחיה</label>
            <textarea id="exercise-code" name="code" className="solution-input" value={formData.code} onChange={updateField} placeholder="הוסיפו קוד התחלתי או הנחיה" rows="4" />
            {message && <p className="form-success">{message}</p>}
            <button type="submit" className="submit-button">הוסף תרגיל</button>
          </form>
        </div>
      </div>
    </section>
  )
}