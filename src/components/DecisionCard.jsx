// DecisionCard surfaces a numbered "design decision" with rationale.
// Used in the design-decisions section of case studies to make the WHY
// behind a choice as visible as the WHAT.

export default function DecisionCard({ number, title, rationale, children }) {
  return (
    <div className="decision-card">
      {/* Zero-pad single-digit numbers: 1 → "01", 9 → "09", 10 → "10".
          padStart is the modern, no-fuss way to do fixed-width number
          formatting. */}
      <div className="num">{String(number).padStart(2, '0')}</div>
      <div className="body">
        <h3>{title}</h3>
        {/* Rationale is the one-sentence reasoning underneath the title.
            children below is the body content (specifics, evidence). */}
        {rationale && <p className="rationale">{rationale}</p>}
        {children}
      </div>
    </div>
  )
}
