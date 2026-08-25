//קומפוננטה שמציגה את רשימת התרגילים שהוגשו על ידי התלמידים
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Navbar'

export default function ExerciseSubmission({ exercises, role, user, onLogout }) {
  const [courseFilter, setCourseFilter] = useState('all')

  // יצירת מערך ייחודי של הקורסים מתוך רשימת התרגילים
  const courses = [...new Set(exercises.map((exercise) => exercise.course))]
  const filteredExercises = exercises
    .filter((exercise) => courseFilter === 'all' || exercise.course === courseFilter)

  return (
    <section className="exercise-section" dir="rtl">
      //תפריט ניווט שמותאם למשתמש הנוכחי ואפשרות התנתקות
      <Navbar role={role} user={user} onLogout={onLogout} />
      <div className="page-container">
        <div className="exercise-card">
          <div className="exercise-heading">תרגילים לתלמיד</div>
          <div className="exercise-filters">
            <select className="exercise-select" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} aria-label="סינון לפי קורס">
              <option value="all">כל הקורסים</option>
              //יצירת אפשרויות סינון לפי הקורסים הייחודיים
              {courses.map((course) => <option key={course} value={course}>{course}</option>)}
            </select>
          </div>
          <div className="exercise-catalog">
            {filteredExercises.map((exercise) => (
              //יצירת קישורים לכל תרגיל שמוביל לדף פרטי התרגיל
              //כל תרגיל מקבל קישור משלו לפי הID שלו
              <Link className="exercise-catalog-item" key={exercise.id} to={`/exercise/${exercise.id}`}>
                //הצגת פרטי התרגיל
                <span className="catalog-course">{exercise.course}</span>
                <strong>{exercise.name}</strong>
                <span>{exercise.difficulty} · {exercise.points} נקודות</span>
                <span className="catalog-action">פתיחת התרגיל ←</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
