export default function Callout({ label, stat, title, tone = 'warn', children }) {
  return (
    <div className={`key-moment tone-${tone}`}>
      <div className="figure-num">{stat}</div>
      <div className="context">
        {label && <p className="label">{label}</p>}
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  )
}
