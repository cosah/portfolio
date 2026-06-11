// Callout is the boxed "key moment" component used to surface a notable
// finding alongside running prose. A big stat (number or percentage) sits
// on the left, with a small label, optional title, and supporting copy
// on the right. Tone drives accent color: 'warn' for problems, 'good'
// for positive outcomes, 'info' for neutral observations.

export default function Callout({ label, stat, title, tone = 'warn', children }) {
  return (
    <div className={`key-moment tone-${tone}`}>
      <div className="figure-num">{stat}</div>
      <div className="context">
        {label && <p className="label">{label}</p>}
        {title && <h3>{title}</h3>}
        {/* children renders whatever JSX the caller passed inside the
            <Callout>...</Callout> tags. Usually one or more <p> tags. */}
        {children}
      </div>
    </div>
  )
}
