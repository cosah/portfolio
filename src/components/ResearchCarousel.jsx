// ResearchCarousel renders a row of research artifacts (e.g. interview
// boards, hypothesis cards) as clickable thumbnails. Unlike Phone or
// Board, it shows every slide at once in a horizontal row rather than
// rotating through them. Clicking a slot opens that slide in the lightbox.

import { useState } from 'react'
import Lightbox from './Lightbox'

export default function ResearchCarousel({ slides, lightbox = true }) {
  // -1 means closed; otherwise the index of the open slide. Single piece
  // of state encodes both "are we open?" and "which one?" without a
  // separate boolean.
  const [openIndex, setOpenIndex] = useState(-1)
  const total = slides.length
  const current = openIndex >= 0 ? slides[openIndex] : null

  return (
    <>
      {/* role="list" and role="listitem" make this a semantic list for
          screen readers even though we use divs/buttons instead of <ul>.
          Useful when CSS layout (flex/grid) makes <ol> impractical. */}
      <div className="research-row" role="list">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            className="research-slot"
            // The `lightbox` prop is an escape hatch for cases where
            // we want the thumbnail layout without click-to-zoom.
            onClick={() => lightbox && setOpenIndex(i)}
            aria-label={s.label}
            role="listitem"
          >
            <div className="research-frame">
              <img src={s.src} alt={s.label} />
            </div>
            <p className="research-label">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Only mount Lightbox when an index is open. Saves the work of
          measuring the items / wiring up focus traps when not needed. */}
      {current && (
        <Lightbox
          items={slides
            .filter((s) => s.src)
            .map((s) => ({ src: s.src, alt: s.label || '' }))}
          alt={current.label}
          label={current.label}
          isOpen={openIndex >= 0}
          onClose={() => setOpenIndex(-1)}
          // Wraparound navigation for the lightbox arrows. Only enable
          // arrows at all if there's more than one slide.
          onPrev={total > 1 ? () => setOpenIndex((i) => (i - 1 + total) % total) : undefined}
          onNext={total > 1 ? () => setOpenIndex((i) => (i + 1) % total) : undefined}
          index={openIndex}
          total={total}
        />
      )}
    </>
  )
}
