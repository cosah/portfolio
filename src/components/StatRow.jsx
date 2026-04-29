export default function StatRow({ stats }) {
  const cols = stats.length === 3 ? 'cols-3' : stats.length === 2 ? 'cols-2' : ''
  return (
    <div className={`stat-row ${cols}`.trim()}>
      {stats.map(({ number, value, label, delta, tone }, i) => {
        const v = value ?? number
        const toneClass = tone ? ` ${tone}` : ''
        return (
          <div key={`${label}-${i}`} className="cell">
            <div className="label">{label}</div>
            <div className={`value${toneClass}`}>{v}</div>
            {delta && <div className="delta">{delta}</div>}
          </div>
        )
      })}
    </div>
  )
}
