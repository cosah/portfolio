import { useState } from 'react'
import Lightbox from './Lightbox'

export default function ScrollFigure({
  id,
  caption,
  src,
  alt,
  naturalAspect,
  pages = 2,
}) {
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const atStart = page === 0
  const atEnd = page === pages - 1

  const goPrev = () => setPage((p) => Math.max(0, p - 1))
  const goNext = () => setPage((p) => Math.min(pages - 1, p + 1))

  const figLabel = id ? `FIG. ${id} — ${caption || ''}`.trim() : caption
  const counter = `${String(page + 1).padStart(2, '0')} / ${String(pages).padStart(2, '0')}`
  const frameAspect = naturalAspect ? naturalAspect / pages : null

  return (
    <figure className="figure">
      {(id || caption) && (
        <figcaption className="figure-meta">
          {id && <span className="id">FIG. {id}</span>}
          <span>{caption}</span>
        </figcaption>
      )}
      <div
        className="figure-frame flow-frame"
        style={frameAspect ? { aspectRatio: `${frameAspect}` } : undefined}
      >
        <button
          type="button"
          className="zoom-trigger flow-zoom"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge: ${alt || caption || 'figure'}`}
        >
          <div
            className="flow-track"
            style={{
              width: `${pages * 100}%`,
              transform: `translate3d(${-page * (100 / pages)}%, 0, 0)`,
            }}
          >
            <img src={src} alt={alt || caption || ''} />
          </div>
        </button>
      </div>
      <div className="board-carousel-nav">
        <button
          className="carousel-arrow prev"
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous page"
        >
          <span className="arrow-chip">←</span>
        </button>
        <div className="carousel-dots">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === page ? ' active' : ''}`}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="carousel-arrow next"
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next page"
        >
          <span className="arrow-chip">→</span>
        </button>
      </div>
      <p className="board-carousel-label">
        <span className="counter">{counter}</span>
      </p>

      <Lightbox
        src={src}
        alt={alt || caption}
        label={figLabel}
        isOpen={open}
        onClose={() => setOpen(false)}
        accent="info"
      />
    </figure>
  )
}
