// TableOfContents is the sticky left rail on case studies. It receives a
// list of sections (each with num, id, label), watches scroll position,
// and highlights whichever section the user is currently reading. Clicking
// a TOC item smooth-scrolls to that section and updates the URL hash so
// the location is shareable.

import { useState, useEffect, useRef } from 'react'

// Height of each TOC item in pixels. Matches the CSS so the highlight
// indicator can be positioned by index without a measurement pass.
const ITEM_H = 28
// Pixel slop for "is the section heading at or above this TOC item?" comparisons.
// Avoids flicker when the scroll position lands exactly at a boundary.
const TOLERANCE = 2

export default function TableOfContents({ sections }) {
  const [activeIndex, setActiveIndex] = useState(0)
  // navRef points at the <nav> root so we can scope DOM queries below.
  const navRef = useRef(null)

  // Scroll-spy effect. Re-runs whenever the sections prop changes (e.g. a
  // new case study renders), but keeps the same listener throughout.
  useEffect(() => {
    if (!sections || sections.length === 0) return

    // Set a CSS custom property on the rail so the rail's background
    // gradient or track can sized in lockstep with the number of items.
    // .closest walks up from navRef to find the wrapping rail element.
    const rail = navRef.current?.closest('.toc-rail')
    if (rail) {
      rail.style.setProperty('--toc-h', `${sections.length * ITEM_H}px`)
    }

    function update() {
      const items = navRef.current?.querySelectorAll('.toc-item')
      if (!items || items.length === 0) return

      // For each section, compare the section heading's vertical position
      // against the TOC item's vertical position. The active item is the
      // last section whose heading has scrolled at or above its TOC item.
      // getBoundingClientRect().top is viewport-relative (negative once
      // an element scrolls above the top of the viewport).
      let active = 0
      for (let i = 0; i < sections.length; i++) {
        const sectionEl = document.getElementById(sections[i].id)
        if (!sectionEl) continue
        // Prefer the .section-id eyebrow as the alignment anchor if
        // present; fall back to the section root.
        const labelEl = sectionEl.querySelector('.section-id')
        const labelY = (labelEl ?? sectionEl).getBoundingClientRect().top
        const itemY = items[i].getBoundingClientRect().top
        if (labelY <= itemY + TOLERANCE) active = i
      }

      // Edge case: at the very bottom of the page, the last section is
      // active even if the heading isn't above its TOC item. Without this,
      // the last item would never light up because there's not enough
      // scroll room below it.
      const scrollBottom = window.scrollY + window.innerHeight
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      )
      if (scrollBottom >= docHeight - TOLERANCE) {
        active = sections.length - 1
      }

      setActiveIndex(active)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sections])

  // Click handler for TOC anchors. We preventDefault so the browser doesn't
  // do an instant jump, then handle the scroll ourselves with smooth
  // behavior unless the user has prefers-reduced-motion set. history.replaceState
  // (not pushState) updates the URL without adding a back-button entry,
  // so a quick jump around the TOC doesn't bury the user in history.
  function handleClick(e, id) {
    e.preventDefault()
    const sectionEl = document.getElementById(id)
    if (!sectionEl) return

    const top = sectionEl.getBoundingClientRect().top + window.scrollY
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduceMotion ? 'instant' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav ref={navRef} className="toc" aria-label="Table of contents">
      {/* The track is the vertical line behind the items, drawn purely
          for visuals. aria-hidden because it's decorative. */}
      <div className="toc-track" aria-hidden="true" />
      {/* The highlight indicator slides to the active item's position.
          It reads the --toc-index CSS variable and computes its translate
          in CSS, so all the visual movement is handled by the stylesheet. */}
      <div
        className="toc-indicator"
        aria-hidden="true"
        style={{ '--toc-index': activeIndex }}
      />
      <ol className="toc-list">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className={`toc-item${i === activeIndex ? ' active' : ''}`}
          >
            <a href={`#${s.id}`} onClick={(e) => handleClick(e, s.id)}>
              {/* Zero-pad single-digit section numbers for a typewriter
                  visual style: "01", "02", etc. */}
              <span className="toc-num">{String(s.num).padStart(2, '0')}</span>
              <span className="toc-label">{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
