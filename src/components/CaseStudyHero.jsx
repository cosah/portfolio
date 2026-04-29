export default function CaseStudyHero({
  kicker,
  title,
  titleEmphasis,
  subtitle,
  meta,
  corners = {},
  heroImage,
  heroImageAlt,
  heroLabel,
}) {
  const tl = corners.tl || '+ 00.00'
  const tr = corners.tr || '21:9 · HERO'
  const bl = corners.bl
  const br = corners.br

  return (
    <section className="hero" aria-labelledby="case-study-title">
      <div
        className={`hero-frame${heroImage ? ' has-image' : ''}`}
        role={heroImage ? 'img' : undefined}
        aria-label={heroImage ? heroImageAlt : undefined}
      >
        <span className="hero-corner tl" aria-hidden="true">{tl}</span>
        <span className="hero-corner tr" aria-hidden="true">{tr}</span>
        {bl && <span className="hero-corner bl" aria-hidden="true">{bl}</span>}
        {br && <span className="hero-corner br" aria-hidden="true">{br}</span>}
        {heroImage ? (
          <img src={heroImage} alt={heroImageAlt || ''} />
        ) : (
          heroLabel && <span aria-hidden="true">[ {heroLabel} ]</span>
        )}
      </div>
      <div className="hero-meta">
        <div>
          {kicker && <p className="kicker">{kicker}</p>}
          <h1 id="case-study-title">
            {title}
            {titleEmphasis && (
              <>
                {' '}
                <em>{titleEmphasis}</em>
              </>
            )}
          </h1>
          {subtitle && <p className="lead">{subtitle}</p>}
        </div>
        {meta && meta.length > 0 && (
          <div className="specs">
            {meta.map(({ label, value }) => (
              <div key={label} className="row">
                <span>{label.toLowerCase()}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
