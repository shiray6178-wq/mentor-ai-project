import Navbar from './Navbar'
import { useState } from 'react'

export default function StudentManagement({ users, onAddStudent, onDeleteStudent, role, user, onLogout }) {
  const [student, setStudent] = useState({ firstname: '', lastname: '', fonenumber: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const updateStudent = (event) => {
    const { name, value } = event.target
    setStudent((currentStudent) => ({ ...currentStudent, [name]: value }))
  }

  const addStudent = (event) => {
    event.preventDefault()
    onAddStudent(student)
    setStudent({ firstname: '', lastname: '', fonenumber: '', email: '', password: '' })
    setMessage('התלמיד נוסף לרשימה בהצלחה')
  }

  return (
    <section className="students-section" dir="rtl">
      <Navbar role={role} user={user} onLogout={onLogout} />
      <div className="page-container students-container student-management-layout">
        <div className="students-card student-form-card">
          <div className="exercise-heading">הוספת תלמיד</div>
          <form className="teacher-form" onSubmit={addStudent}>
            <div className="teacher-form-grid">
              <div>
                <label htmlFor="student-firstname">שם פרטי</label>
                <input id="student-firstname" name="firstname" value={student.firstname} onChange={updateStudent} required />
              </div>
              <div>
                <label htmlFor="student-lastname">שם משפחה</label>
                <input id="student-lastname" name="lastname" value={student.lastname} onChange={updateStudent} required />
              </div>
            </div>
            <label htmlFor="student-phone">טלפון</label>
            <input id="student-phone" name="fonenumber" type="tel" value={student.fonenumber} onChange={updateStudent} required />
            <label htmlFor="student-email">מייל</label>
            <input id="student-email" name="email" type="email" value={student.email} onChange={updateStudent} required />
            <label htmlFor="student-password">סיסמה זמנית</label>
            <input id="student-password" name="password" type="password" value={student.password} onChange={updateStudent} placeholder="ברירת מחדל: student123" />
            {message && <p className="form-success">{message}</p>}
            <button type="submit" className="submit-button">הוסף תלמיד</button>
          </form>
        </div>
        <div className="students-card">
          <div className="exercise-heading">רשימת תלמידים</div>
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>שם פרטי</th>
                <th>שם משפחה</th>
                <th>טלפון</th>
                <th>אימייל</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.filter((studentUser) => studentUser.role === 'student' || !studentUser.role).map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.firstname}</td>
                  <td>{s.lastname}</td>
                  <td>{s.fonenumber}</td>
                  <td>{s.email}</td>
                  <td><button type="button" className="delete-button" onClick={() => { if (window.confirm(`למחוק את ${s.firstname} ${s.lastname}?`)) onDeleteStudent(s.id) }}>מחק</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
