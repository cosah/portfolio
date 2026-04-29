export default function DecisionCard({ number, title, rationale, children }) {
  return (
    <div className="decision-card">
      <div className="num">{String(number).padStart(2, '0')}</div>
      <div className="body">
        <h3>{title}</h3>
        {rationale && <p className="rationale">{rationale}</p>}
        {children}
      </div>
    </div>
  )
}
