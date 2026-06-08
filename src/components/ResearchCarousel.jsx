import { useState } from 'react'
import Lightbox from './Lightbox'

export default function ResearchCarousel({ slides, lightbox = true }) {
  const [openIndex, setOpenIndex] = useState(-1)
  const total = slides.length
  const current = openIndex >= 0 ? slides[openIndex] : null

  return (
    <>
      <div className="research-row" role="list">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            className="research-slot"
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

      {current && (
        <Lightbox
          items={slides
            .filter((s) => s.src)
            .map((s) => ({ src: s.src, alt: s.label || '' }))}
          alt={current.label}
          label={current.label}
          isOpen={openIndex >= 0}
          onClose={() => setOpenIndex(-1)}
          onPrev={total > 1 ? () => setOpenIndex((i) => (i - 1 + total) % total) : undefined}
          onNext={total > 1 ? () => setOpenIndex((i) => (i + 1) % total) : undefined}
          index={openIndex}
          total={total}
        />
      )}
    </>
  )
}
