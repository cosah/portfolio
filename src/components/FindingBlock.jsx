export default function FindingBlock({ label, children }) {
  return (
    <div className="finding-block">
      <div className="finding-label">{label}</div>
      <p>{children}</p>
    </div>
  )
}
