import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function ResearchCarousel({ slides, lightbox = false }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  const prev = (e) => { e?.stopPropagation(); setIndex(i => (i - 1 + slides.length) % slides.length) }
  const next = (e) => { e?.stopPropagation(); setIndex(i => (i + 1) % slides.length) }

  useEffect(() => {
    slides.forEach(s => { const img = new Image(); img.src = s.src })
  }, [slides])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % slides.length)
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + slides.length) % slides.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, slides.length])

  return (
    <>
      <div className="research-carousel">
        <div
          className="research-frame"
          style={{ cursor: lightbox ? 'zoom-in' : 'pointer' }}
          onClick={() => lightbox ? setOpen(true) : next()}
        >
          <img src={slides[index].src} alt={slides[index].label} className="research-img" />
        </div>
        <div className="phone-carousel-nav">
          <button className="carousel-arrow" onClick={prev} aria-label="Previous">←</button>
          <div className="carousel-dots">
            {slides.map((s, i) => (
              <button
                key={i}
                className={`carousel-dot${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={s.label}
              />
            ))}
          </div>
          <button className="carousel-arrow" onClick={next} aria-label="Next">→</button>
        </div>
        <p className="phone-carousel-label">{slides[index].label}</p>
      </div>

      {open && createPortal(
        <div className="img-modal-overlay" onClick={() => setOpen(false)}>
          <div className="img-modal-card" onClick={e => e.stopPropagation()}>
            <img
              src={slides[index].src}
              alt={slides[index].label}
              className="img-modal-image"
              onClick={next}
              style={{ cursor: 'pointer' }}
            />
            <div className="img-modal-footer">
              <button className="carousel-arrow img-modal-arrow" onClick={prev} aria-label="Previous">←</button>
              <div className="img-modal-center">
                <div className="carousel-dots">
                  {slides.map((s, i) => (
                    <button
                      key={i}
                      className={`carousel-dot${i === index ? ' active' : ''}`}
                      onClick={() => setIndex(i)}
                      aria-label={s.label}
                    />
                  ))}
                </div>
                <span className="img-modal-label">{slides[index].label}</span>
              </div>
              <div className="img-modal-right">
                <button className="carousel-arrow img-modal-arrow" onClick={next} aria-label="Next">→</button>
                <button className="img-modal-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
