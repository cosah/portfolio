import { useState } from 'react'
import Lightbox from './Lightbox'

export default function BoardCarousel({
  id,
  caption,
  boards,
  aspect = '16x9',
  contain = true,
}) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const total = boards.length

  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1))
  const atStart = index === 0
  const atEnd = index === total - 1

  const current = boards[index]
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
  const figLabel = id ? `FIG. ${id}: ${caption || ''}`.trim() : caption

  return (
    <figure className="figure">
      {(id || caption) && (
        <figcaption className="figure-meta">
          {id && <span className="id">FIG. {id}</span>}
          <span>{caption}</span>
        </figcaption>
      )}
      <div className={`figure-frame board-frame aspect-${aspect}${contain ? ' contain' : ''}`}>
        <button
          type="button"
          className="zoom-trigger board-zoom"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge: ${current.label || `Board ${index + 1}`}`}
        >
          <div
            className="board-track"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
            {boards.map((b, i) => (
              <div key={i} className="board-slide" aria-hidden={i !== index}>
                <img src={b.src} alt={b.label || `Board ${i + 1}`} />
              </div>
            ))}
          </div>
        </button>
      </div>
      <div className="board-carousel-nav">
        <button
          className="carousel-arrow prev"
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous board"
        >
          <span className="arrow-chip">←</span>
        </button>
        <div className="carousel-dots">
          {boards.map((b, i) => (
            <button
              key={i}
              className={`carousel-dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={b.label || `Board ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="carousel-arrow next"
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next board"
        >
          <span className="arrow-chip">→</span>
        </button>
      </div>
      <p className="board-carousel-label">
        <span className="counter">{counter}</span>
        {current.label && <span className="label">{current.label}</span>}
      </p>

      <Lightbox
        src={current.src}
        alt={current.label || `Board ${index + 1}`}
        label={figLabel ? `${figLabel} · ${counter}` : counter}
        isOpen={open}
        onClose={() => setOpen(false)}
        onPrev={goPrev}
        onNext={goNext}
        canPrev={!atStart}
        canNext={!atEnd}
        accent="info"
      />
    </figure>
  )
}
