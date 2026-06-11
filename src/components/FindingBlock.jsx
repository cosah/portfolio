// FindingBlock is a small bordered block for an inline observation. Lighter
// weight than Callout, used when a finding needs visual emphasis but doesn't
// warrant the big stat / title treatment.

export default function FindingBlock({ label, children }) {
  return (
    <div className="finding-block">
      <div className="label">{label}</div>
      {/* children is wrapped in a <p> here for typography consistency.
          This means callers should pass plain text or inline elements,
          not block elements (a <p> can't legally contain another <p>). */}
      <p>{children}</p>
    </div>
  )
}
