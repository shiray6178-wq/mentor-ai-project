import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

export default function Register({ onRegister, users }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '' })
  const [error, setError] = useState('')
  const updateField = (event) => setFormData((currentData) => ({ ...currentData, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    if (formData.password !== formData.confirmPassword) return setError('הסיסמאות אינן תואמות')
    if (users.some((user) => user.email.toLowerCase() === formData.email.toLowerCase())) return setError('כבר קיים חשבון עם כתובת המייל הזו')
    const newUser = { ...formData }
    delete newUser.confirmPassword
    onRegister(newUser)
  }

  return (
    <section className="login-section" dir="rtl">
      <Navbar hideMenu />
      <div className="page-container">
        <div className="login-card">
          <div className="login-heading">הצטרף עכשיו</div>
          <form className="login-form" onSubmit={submit}>
            <label htmlFor="register-name">שם מלא</label><input id="register-name" name="name" type="text" value={formData.name} onChange={updateField} required />
            <label htmlFor="register-email">מייל</label><input id="register-email" name="email" type="email" value={formData.email} onChange={updateField} required />
            <label htmlFor="register-phone">טלפון</label><input id="register-phone" name="phone" type="tel" value={formData.phone} onChange={updateField} required />
            <label htmlFor="register-password">סיסמה</label><input id="register-password" name="password" type="password" value={formData.password} onChange={updateField} required minLength="6" />
            <label htmlFor="register-confirm">אישור סיסמה</label><input id="register-confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={updateField} required />
            <label htmlFor="register-role">תפקיד</label><select id="register-role" name="role" className="exercise-select" value={formData.role} onChange={updateField} required><option value="" disabled>בחר תפקיד</option><option value="teacher">מורה</option><option value="student">תלמיד</option></select>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="submit-button">הצטרף עכשיו</button>
            <p className="form-link">כבר רשום? <Link to="/login">חזרה להתחברות</Link></p>
          </form>
        </div>
      </div>
    </section>
  )
}
