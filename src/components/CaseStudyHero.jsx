export default function CaseStudyHero({ eyebrow = 'Case Study', title, subtitle, meta }) {
  return (
    <header className="case-study-hero">
      <p className="hero-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
      <dl className="hero-meta">
        {meta.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
