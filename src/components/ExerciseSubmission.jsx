import { Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Navbar'

export default function ExerciseSubmission({ exercises, role, user, onLogout }) {
  const [courseFilter, setCourseFilter] = useState('all')

  const courses = [...new Set(exercises.map((exercise) => exercise.course))]
  const filteredExercises = exercises
    .filter((exercise) => courseFilter === 'all' || exercise.course === courseFilter)

  return (
    <section className="exercise-section" dir="rtl">
      <Navbar role={role} user={user} onLogout={onLogout} />
      <div className="page-container">
        <div className="exercise-card">
          <div className="exercise-heading">תרגילים לתלמיד</div>
          <div className="exercise-filters">
            <select className="exercise-select" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} aria-label="סינון לפי קורס">
              <option value="all">כל הקורסים</option>
              {courses.map((course) => <option key={course} value={course}>{course}</option>)}
            </select>
          </div>
          <div className="exercise-catalog">
            {filteredExercises.map((exercise) => (
              <Link className="exercise-catalog-item" key={exercise.id} to={`/exercise/${exercise.id}`}>
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
