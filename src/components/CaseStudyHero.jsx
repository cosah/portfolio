import { useLayoutEffect, useRef, useState } from 'react'
import Lightbox from './Lightbox'

export default function CaseStudyHero({
  kicker,
  title,
  titleEmphasis,
  subtitle,
  meta,
  corners = {},
  heroImage,
  heroImageAlt,
  heroImageContain,
  heroLabel,
}) {
  const [open, setOpen] = useState(false)
  const frameRef = useRef(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const bottom = frame.getBoundingClientRect().bottom + window.scrollY
    const target = bottom - window.innerHeight / 2
    if (target > 0) window.scrollTo({ top: target, behavior: 'instant' })
  }, [])

  const tl = corners.tl || '+ 00.00'
  const tr = corners.tr || '21:9 · HERO'
  const bl = corners.bl
  const br = corners.br

  return (
    <section className="hero" aria-labelledby="case-study-title">
      <div ref={frameRef} className={`hero-frame${heroImage ? ' has-image' : ''}${heroImage && heroImageContain ? ' contain' : ''}`}>
        <span className="hero-corner tl" aria-hidden="true">{tl}</span>
        <span className="hero-corner tr" aria-hidden="true">{tr}</span>
        {bl && <span className="hero-corner bl" aria-hidden="true">{bl}</span>}
        {br && <span className="hero-corner br" aria-hidden="true">{br}</span>}
        {heroImage ? (
          <button
            type="button"
            className="zoom-trigger"
            onClick={() => setOpen(true)}
            aria-label={`Enlarge: ${heroImageAlt || heroLabel || 'hero image'}`}
          >
            <img src={heroImage} alt={heroImageAlt || ''} />
          </button>
        ) : (
          heroLabel && <span aria-hidden="true">[ {heroLabel} ]</span>
        )}
      </div>
      {heroImage && (
        <Lightbox
          src={heroImage}
          alt={heroImageAlt}
          label={heroImageAlt || heroLabel}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
      <div className="hero-meta">
        <div className="hero-title-block">
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
