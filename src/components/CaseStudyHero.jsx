// CaseStudyHero is the top section of every case study page. It renders
// the hero image inside a tilted/cornered frame, the kicker + title +
// subtitle, and the meta panel ("role: ...", "year: ..."). On mount it
// scrolls the page so the bottom half of the hero is at the vertical
// center of the viewport, which creates a "let it land" reading rhythm.

import { useLayoutEffect, useRef, useState } from 'react'
import Lightbox from './Lightbox'

export default function CaseStudyHero({
  kicker,           // tiny eyebrow above the title
  title,
  titleEmphasis,    // last span of the title rendered as <em> (different color)
  subtitle,
  meta,             // array of {label, value} for the right side meta panel
  corners = {},     // optional {tl, tr, bl, br} text labels for hero corners
  heroImage,
  heroImageAlt,
  heroImageContain, // toggle object-fit: contain (vs default cover)
  heroLabel,
}) {
  const [open, setOpen] = useState(false)
  const frameRef = useRef(null)

  // useLayoutEffect fires synchronously AFTER all DOM mutations but BEFORE
  // the browser paints, so we can measure and scroll without the user
  // seeing an unintended flash at the wrong position. useEffect, by
  // contrast, runs after paint, which would cause a visible jump.
  //
  // The math: compute where the bottom of the hero is in absolute page
  // coordinates, then subtract half a viewport so that point sits at the
  // middle of the screen. Behavior: 'instant' prevents an animated scroll
  // since this is happening as the page first mounts.
  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const bottom = frame.getBoundingClientRect().bottom + window.scrollY
    const target = bottom - window.innerHeight / 2
    if (target > 0) window.scrollTo({ top: target, behavior: 'instant' })
  }, [])

  // Sensible defaults for the corner labels so the visual frame still has
  // its characteristic typewriter ticks even when callers don't provide them.
  const tl = corners.tl || '+ 00.00'
  const tr = corners.tr || '21:9 · HERO'
  const bl = corners.bl
  const br = corners.br

  return (
    // aria-labelledby points the section's accessible name at the H1 below.
    <section className="hero" aria-labelledby="case-study-title">
      <div ref={frameRef} className={`hero-frame${heroImage ? ' has-image' : ''}${heroImage && heroImageContain ? ' contain' : ''}`}>
        {/* The corner ticks are decorative typography, hence aria-hidden. */}
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
          // Draft state: text inside the frame as a label.
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
            {/* Fragment ({}) wraps multiple children without adding a wrapper
                element. Used here to attach a space and the emphasis span
                after the main title. */}
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
                {/* Lowercase the label visually but keep the actual data
                    uppercase-tolerant. Avoids forcing call sites to think
                    about presentation. */}
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
