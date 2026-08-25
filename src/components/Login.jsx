//קומפוננטת התחברות
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function EyeIcon({ isVisible }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {isVisible ? (
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      ) : (
        <path d="m3 3 18 18M10.6 6.2A10.9 10.9 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.7M6.2 6.3C3.9 8 2.5 12 2.5 12s3.5 6 9.5 6c1.2 0 2.3-.2 3.3-.6" />
      )}
      {isVisible && <circle cx="12" cy="12" r="2.5" />}
    </svg>
  )
}

//קומפוננטה שמציגה את טופס ההתחברות למערכת
export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  })
  const [error, setError] = useState('')
  const [visibleFields, setVisibleFields] = useState({ password: false })

  //פונקציה שמעדכנת את השדות בטופס ההתחברות ומאפס את הודעת השגיאה
  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setError('')
  }

  //פונקציה שמטפלת בהתחברות המשתמש
  const handleSubmit = (event) => {
    event.preventDefault()

    if (!onLogin?.(formData)) {
      setError('פרטי ההתחברות או התפקיד אינם נכונים')
      return
    }
  }

  //פונקציה שמאפשרת להציג או להסתיר את הסיסמה בשדה הסיסמה
  const togglePasswordVisibility = (fieldName) => {
    setVisibleFields((currentFields) => ({
      ...currentFields,
      [fieldName]: !currentFields[fieldName],
    }))
  }

  return (
    <section className="login-section" dir="rtl">
      <Navbar hideMenu />
      <div className="page-container">
        <div className="login-card">
          <div className="login-heading">התחברות</div>
          <p className="login-description">הזן את הפרטים שלך כדי להמשיך</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">מייל</label>
            <input id="email" name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={updateField} required />

            <label htmlFor="password">סיסמה</label>
            <div className="password-field">
              <input id="password" name="password" type={visibleFields.password ? 'text' : 'password'} placeholder="סיסמה" value={formData.password} onChange={updateField} required />
              <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('password')} aria-label={visibleFields.password ? 'הסתר סיסמה' : 'הצג סיסמה'} title={visibleFields.password ? 'הסתר סיסמה' : 'הצג סיסמה'}>
                <EyeIcon isVisible={visibleFields.password} />
              </button>
            </div>

            <label htmlFor="role">תפקיד</label>
            <select id="role" name="role" className="exercise-select" value={formData.role} onChange={updateField} required>
              <option value="" disabled>בחר תפקיד</option>
              <option value="teacher">מורה</option>
              <option value="student">תלמיד</option>
            </select>

          //אם יש שגיאה, מציגים את הודעת השגיאה
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="submit-button">התחבר</button>
            <p className="form-link">אין לך חשבון? <Link to="/register">הרשמה למערכת</Link></p>
          </form>
        </div>
      </div>
    </section>
  )
}
