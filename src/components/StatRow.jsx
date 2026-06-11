// StatRow displays a row of large, prominent statistics. Each cell has a
// label, a big number (rendered in serif), an optional delta line ("vs.
// pre-redesign"), and an optional tone (warn / good / info) that tints
// the number color. Common pattern in case studies for headline metrics.

export default function StatRow({ stats }) {
  // Two-stat and three-stat layouts get explicit class modifiers so the
  // CSS can give each cell more room. Beyond three, cells wrap by default.
  const cols = stats.length === 3 ? 'cols-3' : stats.length === 2 ? 'cols-2' : ''
  return (
    <div className={`stat-row ${cols}`.trim()}>
      {stats.map(({ number, value, label, delta, tone }, i) => {
        // Backward compat: older code used `number`, newer code uses `value`.
        // Nullish coalescing (??) picks `value` if it's defined (even if 0),
        // otherwise falls back to `number`.
        const v = value ?? number
        const toneClass = tone ? ` ${tone}` : ''
        return (
          // Key combines label + index so two stats can share the same
          // label without React warning about duplicate keys.
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
