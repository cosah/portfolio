export default function Callout({ label, stat, children }) {
  return (
    <div className="callout">
      {label && <h3>{label}</h3>}
      {stat && <span className="stat">{stat}</span>}
      {children}
    </div>
  )
}
