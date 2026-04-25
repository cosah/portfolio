export default function StatRow({ stats }) {
  return (
    <div className="stat-row">
      {stats.map(({ number, label }) => (
        <div key={label} className="stat-cell">
          <span className="stat-number">{number}</span>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </div>
  )
}
