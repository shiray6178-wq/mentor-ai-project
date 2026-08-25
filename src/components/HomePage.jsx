import Navbar from './Navbar'

export default function HomePage({ numOfChecks, numOfStudents }) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="info-grid">
          <div className="info-box">
            <p className="info-label">מספר הבדיקות</p>
            <p className="info-value">{numOfChecks}</p>
          </div>
          <div className="info-box">
            <p className="info-label">מאגר ענק של</p>
            <p className="info-label">תרגילים</p>
          </div>
          <div className="info-box">
            <p className="info-label">מספר התלמידים</p>
            <p className="info-label">שהרשומים:</p>
            <p className="info-value">{numOfStudents}</p>
          </div>
        </div>
      </main>
    </>
  )
}
