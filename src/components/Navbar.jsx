//קומפוננטת הניווט הראשית של המערכת
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import brainImg from '../assets/image.png'
import { useUser } from '../context/useUser'

export default function Navbar({ hideMenu = false, role, user, onLogout }) {
  const contextUser = useUser()
  //אם יש משתמש בהקשר, נעדכן את המשתמש והפונקציה להתנתקות בהתאם
  user = contextUser?.user || user
  //אם יש פונקציה להתנתקות בהקשר, נעדכן את הפונקציה בהתאם
  onLogout = contextUser?.onLogout || onLogout
  //מצב שמנהל את הצגת פרטי המשתמש בתפריט
  const [showDetails, setShowDetails] = useState(false)
  const roleLabel = role === 'teacher' ? 'מורה' : 'תלמיד'
  const mainMenuPath = role === 'teacher' ? '/teacher' : '/exercises'

  return (
    <div className="section-header-block">
      <header className="app-header">
        <div className="logo-container">
          <h1 className="logo">MentorAi</h1>
          <img src={brainImg} alt="brain" className="brain-img" />
        </div>
        <p className="subtitle">השותף שלך ללמידה</p>
      </header>
      {/* מציגים את פרטי המשתמש רק אם יש משתמש מחובר והתפריט לא הוסתר */}
      {user && !hideMenu && (
        <div className="user-menu">
          <div className="user-summary">
            <span className="user-avatar">{user.name?.charAt(0) || '?'}</span>
            <span><strong>שלום, {user.name}</strong><small>{roleLabel}</small></span>
          </div>
          <div className="user-actions">
            {role === 'teacher' && <NavLink to={mainMenuPath} className="user-action">תפריט ראשי</NavLink>}
            {/* כפתור לפתיחה ולסגירה של פרטי החשבון */}
            <button type="button" className="user-action" onClick={() => setShowDetails((isOpen) => !isOpen)}>פרטים</button>
            {/* כפתור שמפעיל את פונקציית ההתנתקות */}
            <button type="button" className="user-action logout-button" onClick={onLogout}>התנתקות</button>
          </div>
          {showDetails && (
            <div className="user-details">
              <strong>פרטי החשבון</strong>
              <span>שם: {user.name}</span>
              <span>מייל: {user.email}</span>
              <span>טלפון: {user.phone}</span>
              <span>תפקיד: {roleLabel}</span>
            </div>
          )}
        </div>
      )}
      {!hideMenu && (
        <nav className="navbar">
          {role === 'student' && <NavLink to="/exercises" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>תרגילים</NavLink>}
          {role === 'student' && <NavLink to="/exercise-list" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>הציונים שלי</NavLink>}
          {role === 'teacher' && <NavLink to="/teacher" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>לוח מורה</NavLink>}
          {role === 'teacher' && <NavLink to="/exercise-list" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>ציוני תלמידים</NavLink>}
          {role === 'teacher' && <NavLink to="/students" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>ניהול תלמידים</NavLink>}
        </nav>
      )}
    </div>
  )
}
