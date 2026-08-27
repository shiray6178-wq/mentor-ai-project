//קומפוננטה שמציגה את רשימת התרגילים שהוגשו על ידי התלמידים
import Navbar from './Navbar'
import { useState } from 'react'

export default function ExerciseList({ grades, currentUser, role, user, onLogout }) {
  const [openGradeId, setOpenGradeId] = useState(null)
  //סינון הציונים לפי המשתמש הנוכחי 
  const visibleGrades = role === 'student'
    ? grades.filter((grade) => grade.studentId === currentUser?.id || grade.studentName === currentUser?.name)
    : grades

  return (
    <section className="students-section" dir="rtl">
      <Navbar role={role} user={user} onLogout={onLogout} />
      <div className="page-container students-container">
        <div className="students-card student-grades-card">
          <div className="exercise-heading">תרגילים שהוגשו</div>
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                {role === 'teacher' && <th>תלמיד</th>}
                <th>שם תרגיל</th>
                <th>ציון</th>
                <th>הודעה</th>
                {role === 'teacher' && <th>פתרון</th>}
              </tr>
            </thead>
            <tbody>
              
              {visibleGrades.map((g, i) => (
                <>
                  <tr>
                    <td>{i + 1}</td>
                    {role === 'teacher' && <td>{g.studentName || 'תלמיד'}</td>}
                    <td>{g.exerciseName}</td>
                    <td>{g.mark}%</td>
                    <td>{g.message}</td>
                    {role === 'teacher' && <td><button type="button" className="view-solution-button" onClick={() => setOpenGradeId(openGradeId === (g.id || i) ? null : (g.id || i))}>{openGradeId === (g.id || i) ? 'הסתר' : 'צפה בפתרון'}</button></td>}
                  </tr>
                  {role === 'teacher' && openGradeId === (g.id || i) && <tr className="solution-row"><td colSpan="6"><div className="submitted-solution"><strong>הפתרון של {g.studentName || 'התלמיד'}:</strong><pre>{g.solution || 'לא צורף פתרון'}</pre>{g.attachment && <p><a href={g.attachment.data} download={g.attachment.name}>הורדת הקובץ: {g.attachment.name}</a></p>}</div></td></tr>}
                </>
              ))}
              {!visibleGrades.length && <tr><td colSpan={role === 'teacher' ? 6 : 4} className="empty-state">עדיין לא קיימות הגשות</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
