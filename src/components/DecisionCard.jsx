export default function DecisionCard({ number, title, children, rationale }) {
  return (
    <div className="decision-card">
      <span className="card-number">{number}</span>
      <h4>{title}</h4>
      {children}
      {rationale && <p className="rationale">{rationale}</p>}
    </div>
  )
}
