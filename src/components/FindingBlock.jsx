export default function FindingBlock({ label, children }) {
  return (
    <div className="finding-block">
      <div className="label">{label}</div>
      <p>{children}</p>
    </div>
  )
}
