import './App.css'
import { useState } from 'react'
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import StudentManagement from './components/StudentManagement'
import ExerciseSubmission from './components/ExerciseSubmission'
import ExerciseList from './components/ExerciseList'
import TeacherDashboard from './components/TeacherDashboard'
import ExerciseDetails from './components/ExerciseDetails'
import UserProvider from './context/UserProvider'
import { useEffect } from 'react'

const exercisesData = [
  { id: 1, name: "חיבור וחיסור עד 20", course: "מתמטיקה", difficulty: "מתחילים", points: 10, description: "פתרו את התרגילים וכתבו את דרך הפתרון בקצרה.", code: "8 + 7 = ?\n15 - 6 = ?\n12 + 5 = ?", dueDate: "2026-09-10" },
  { id: 2, name: "שברים פשוטים", course: "מתמטיקה", difficulty: "מתחילים", points: 15, description: "השוו בין השברים והסבירו איזה שבר גדול יותר.", code: "1/2 ___ 2/4\n3/4 ___ 1/4", dueDate: "2026-09-17" },
  { id: 3, name: "מילים באנגלית", course: "אנגלית", difficulty: "מתחילים", points: 10, description: "כתבו את התרגום לעברית של כל מילה, ולאחר מכן משפט קצר באנגלית.", code: "school\nfriend\nbook\nhappy", dueDate: "2026-09-24" },
  { id: 4, name: "הבנת הנקרא", course: "עברית", difficulty: "בינוני", points: 20, description: "קראו קטע קצר, כתבו את הרעיון המרכזי וענו על שתי שאלות הבנה.", code: "האביב הגיע והגינה התמלאה בפרחים צבעוניים.\nכתבו: מהו הרעיון המרכזי בקטע?", dueDate: "2026-10-01" },
  { id: 5, name: "מערכת השמש", course: "מדעים", difficulty: "בינוני", points: 20, description: "כתבו שלושה פרטים שלמדתם והסבירו מדוע השמש חשובה לכדור הארץ.", code: "נושא: השמש, כדור הארץ וכוכבי הלכת", dueDate: "2026-10-08" },
]

function RoleRoute({ user, allowedRole, children }) {
  if (!user) return <Navigate to="/login" replace />
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole]
  if (!allowedRoles.includes(user.role)) return <Navigate to={user.role === 'student' ? '/exercises' : '/teacher'} replace />
  return children
}

function App() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('mentor-users') || '[]'))
  const [grades, setGrades] = useState(() => JSON.parse(localStorage.getItem('mentor-grades') || '[]'))
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('mentor-current-user') || 'null'))
  const [exercises, setExercises] = useState(() => JSON.parse(localStorage.getItem('mentor-exercises-v2') || JSON.stringify(exercisesData)))

  useEffect(() => localStorage.setItem('mentor-users', JSON.stringify(users)), [users])
  useEffect(() => localStorage.setItem('mentor-grades', JSON.stringify(grades)), [grades])
  useEffect(() => localStorage.setItem('mentor-exercises-v2', JSON.stringify(exercises)), [exercises])
  useEffect(() => {
    if (currentUser) localStorage.setItem('mentor-current-user', JSON.stringify(currentUser))
    else localStorage.removeItem('mentor-current-user')
  }, [currentUser])

  const onRegister = (user) => {
    const newUser = { ...user, id: Date.now() }
    setUsers((currentUsers) => [...currentUsers, newUser])
    setCurrentUser(newUser)
    navigate(newUser.role === 'student' ? '/exercises' : '/teacher')
  }

  const onSubmit = (grade) => {
    setGrades((currentGrades) => [...currentGrades, { ...grade, studentId: currentUser?.id, studentName: currentUser?.name, id: Date.now() }])
  }

  const onLogin = (user) => {
    const existingUser = users.find((candidate) => candidate.email.toLowerCase() === user.email.toLowerCase() && candidate.password === user.password && candidate.role === user.role)
    if (!existingUser) return false
    setCurrentUser(existingUser)
    navigate(existingUser.role === 'student' ? '/exercises' : '/teacher')
    return true
  }

  const onAddExercise = (exercise) => {
    setExercises((currentExercises) => [...currentExercises, { ...exercise, id: Date.now() }])
  }

  const onDeleteExercise = (exerciseId) => {
    setExercises((currentExercises) => currentExercises.filter((exercise) => exercise.id !== exerciseId))
  }

  const onAddStudent = (student) => {
    const newStudent = {
      ...student,
      name: `${student.firstname} ${student.lastname}`.trim(),
      phone: student.fonenumber,
      password: student.password || 'student123',
      id: Date.now(),
      role: 'student',
    }
    setUsers((currentUsers) => [...currentUsers, newStudent])
  }

  const onDeleteStudent = (studentId) => {
    setUsers((currentUsers) => currentUsers.filter((student) => student.id !== studentId))
    setGrades((currentGrades) => currentGrades.filter((grade) => grade.studentId !== studentId))
  }

  const onLogout = () => {
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <div className="app-container">
      <UserProvider value={{ user: currentUser, onLogout }}>
        <Routes>
        <Route path="/" element={<Login onLogin={onLogin} />} />
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/register" element={<Register onRegister={onRegister} users={users} />} />
        <Route path="/teacher" element={<RoleRoute user={currentUser} allowedRole="teacher"><TeacherDashboard exercises={exercises} grades={grades} onAddExercise={onAddExercise} onDeleteExercise={onDeleteExercise} role={currentUser?.role} user={currentUser} onLogout={onLogout} /></RoleRoute>} />
        <Route path="/students" element={<RoleRoute user={currentUser} allowedRole="teacher"><StudentManagement users={users} onAddStudent={onAddStudent} onDeleteStudent={onDeleteStudent} role={currentUser?.role} user={currentUser} onLogout={onLogout} /></RoleRoute>} />
        <Route path="/exercises" element={<RoleRoute user={currentUser} allowedRole="student"><ExerciseSubmission exercises={exercises} onSubmit={onSubmit} role={currentUser?.role} user={currentUser} onLogout={onLogout} /></RoleRoute>} />
        <Route path="/exercise-list" element={<RoleRoute user={currentUser} allowedRole={["student", "teacher"]}><ExerciseList grades={grades} currentUser={currentUser} role={currentUser?.role} user={currentUser} onLogout={onLogout} /></RoleRoute>} />
        <Route path="/exercise/:exerciseId" element={<RoleRoute user={currentUser} allowedRole={["student", "teacher"]}><ExerciseDetails exercises={exercises} onSubmit={onSubmit} role={currentUser?.role} user={currentUser} onLogout={onLogout} /></RoleRoute>} />
        </Routes>
      </UserProvider>
    </div>
  )
}

export default App
