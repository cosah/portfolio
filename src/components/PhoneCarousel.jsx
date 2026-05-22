import { useState, useEffect } from 'react'
import Lightbox from './Lightbox'

export default function PhoneCarousel({ screens }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    screens.forEach((s) => {
      if (s.src) {
        const img = new Image()
        img.src = s.src
      }
    })
  }, [screens])

  const prev = () => setIndex((i) => (i - 1 + screens.length) % screens.length)
  const next = () => setIndex((i) => (i + 1) % screens.length)

  const current = screens[index]
  const total = screens.length

  return (
    <div className="phone-carousel">
      <div className="phone-frame">
        {current.src ? (
          <button
            type="button"
            className="zoom-trigger"
            onClick={() => setOpen(true)}
            aria-label={`Enlarge: ${current.label}`}
          >
            <img src={current.src} alt={current.label} className="phone-screen" />
          </button>
        ) : (
          <div className="phone-placeholder">{current.label}</div>
        )}
      </div>
      <div className="phone-carousel-nav">
        <button className="carousel-arrow prev" onClick={prev} aria-label="Previous screen">
          <span className="arrow-chip">←</span>
        </button>
        <div className="carousel-dots">
          {screens.map((s, i) => (
            <button
              key={i}
              className={`carousel-dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={s.label}
            />
          ))}
        </div>
        <button className="carousel-arrow next" onClick={next} aria-label="Next screen">
          <span className="arrow-chip">→</span>
        </button>
      </div>
      <p className="phone-carousel-label">{current.label}</p>

      {current.src && (
        <Lightbox
          src={current.src}
          alt={current.label}
          label={current.label}
          isOpen={open}
          onClose={() => setOpen(false)}
          onPrev={total > 1 ? prev : undefined}
          onNext={total > 1 ? next : undefined}
        />
      )}
    </div>
  )
}
