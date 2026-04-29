import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function ResearchCarousel({ slides, lightbox = false }) {
  const [openIndex, setOpenIndex] = useState(-1)

  useEffect(() => {
    if (openIndex < 0) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenIndex(-1)
      if (e.key === 'ArrowRight') setOpenIndex(i => (i + 1) % slides.length)
      if (e.key === 'ArrowLeft') setOpenIndex(i => (i - 1 + slides.length) % slides.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [openIndex, slides.length])

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

      {openIndex >= 0 && createPortal(
        <div className="img-modal-overlay" onClick={() => setOpenIndex(-1)}>
          <div className="img-modal-card" onClick={e => e.stopPropagation()}>
            <img
              src={slides[openIndex].src}
              alt={slides[openIndex].label}
              className="img-modal-image"
              onClick={() => setOpenIndex(i => (i + 1) % slides.length)}
            />
            <div className="img-modal-footer">
              <span className="img-modal-label">{slides[openIndex].label}</span>
              <button className="img-modal-close" onClick={() => setOpenIndex(-1)} aria-label="Close">×</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
