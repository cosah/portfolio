// PhoneCarousel renders mobile screen mockups inside a phone-shaped frame.
// Unlike BoardCarousel it shows one screen at a time (no track), navigates
// with wraparound (last → first → last), and preloads every image up front
// to make swap transitions feel instant.

import { useState, useEffect } from 'react'
import Lightbox from './Lightbox'

export default function PhoneCarousel({ screens }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  // Preload all screen images. Creating an Image() (the global one,
  // not the React import) and assigning .src starts the browser fetching
  // the image into cache, even though the element is never inserted into
  // the DOM. By the time the user navigates to it, the image is ready.
  // This is the classic "warm the cache" technique for media-heavy carousels.
  useEffect(() => {
    screens.forEach((s) => {
      if (s.src) {
        const img = new Image()
        img.src = s.src
      }
    })
  }, [screens])

  // Wraparound navigation using modulo. (i - 1 + length) % length is the
  // standard trick to handle negative numbers, since the % operator
  // returns negative values in JavaScript for negative operands.
  const prev = () => setIndex((i) => (i - 1 + screens.length) % screens.length)
  const next = () => setIndex((i) => (i + 1) % screens.length)

  const current = screens[index]
  const total = screens.length

  return (
    <div className="phone-carousel">
      <div className="phone-frame">
        {/* Conditional rendering: real screens get the zoom-to-lightbox
            button, screens without a src render a styled placeholder so
            in-progress case studies can list screens before designing them. */}
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
        {/* PhoneCarousel doesn't disable arrows at boundaries because it
            wraps. The arrows are always interactive. */}
        <button className="carousel-arrow prev" onClick={prev} aria-label="Previous screen">
          <span className="arrow-chip" aria-hidden="true">←</span>
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
          <span className="arrow-chip" aria-hidden="true">→</span>
        </button>
      </div>
      {/* aria-live makes the label announce on each nav for screen reader users. */}
      <p className="phone-carousel-label" aria-live="polite" aria-atomic="true">{current.label}</p>

      {/* Lightbox renders only when the current screen has a real src
          (i.e., not a placeholder). The filter on the items array ensures
          we don't send placeholder slides to the lightbox track. */}
      {current.src && (
        <Lightbox
          items={screens
            .filter((s) => s.src)
            .map((s) => ({ src: s.src, alt: s.label || '' }))}
          alt={current.label}
          label={current.label}
          isOpen={open}
          onClose={() => setOpen(false)}
          // Arrow callbacks are only passed when there's more than one
          // screen. Without this, single-screen lightboxes would render
          // dead-end navigation buttons.
          onPrev={total > 1 ? prev : undefined}
          onNext={total > 1 ? next : undefined}
          index={index}
          total={total}
        />
      )}
    </div>
  )
}
