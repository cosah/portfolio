// BoardCarousel is the inline carousel used for board-shaped images like
// affinity diagrams or research artifacts. It renders a flex track of all
// boards side-by-side, translates the track on prev/next, and opens to a
// matching Lightbox carousel on click.

import { useState } from 'react'
import Lightbox from './Lightbox'

export default function BoardCarousel({
  id,          // optional figure id used in "FIG. 4.1" label
  caption,
  boards,      // array of { src, label }
  aspect = '16x9', // frame aspect ratio as a CSS class suffix
  contain = true,  // when true uses object-fit:contain; otherwise cover
}) {
  // Two pieces of state: which board is currently visible, and whether
  // the lightbox is open. Lifting them up to a single source of truth
  // means the inline view and the lightbox stay in sync.
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const total = boards.length

  // Functional setState (i) => is the safe pattern when the new value
  // depends on the previous one. Math.max / Math.min clamp the index so
  // we don't navigate past the bounds.
  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1))
  const atStart = index === 0
  const atEnd = index === total - 1

  const current = boards[index]
  // Zero-pad the counter for the typewriter style: "01 / 15".
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
  // Composite label used in the lightbox footer if a figure id is present.
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
        {/* The whole frame is one big zoom button so any click anywhere on
            the visible board opens the lightbox. The inner track is purely
            visual and doesn't intercept events. */}
        <button
          type="button"
          className="zoom-trigger board-zoom"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge: ${current.label || `Board ${index + 1}`}`}
        >
          {/* The track holds every board side-by-side. Translating it by
              -index * 100% brings the current board into view. translate3d
              (instead of translateX) is a hint to the browser to enable
              GPU acceleration, which keeps the slide buttery. */}
          <div
            className="board-track"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
            {boards.map((b, i) => (
              // Off-screen slides get aria-hidden so screen readers don't
              // read every board as if they were all present.
              <div key={i} className="board-slide" aria-hidden={i !== index}>
                <img src={b.src} alt={b.label || `Board ${i + 1}`} />
              </div>
            ))}
          </div>
        </button>
      </div>
      <div className="board-carousel-nav">
        {/* Disabled state uses '·' instead of an arrow to convey blocked
            navigation through shape, not just opacity. Pairs with the
            disabled attribute for visual + semantic signal. */}
        <button
          className="carousel-arrow prev"
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous board"
        >
          <span className="arrow-chip" aria-hidden="true">{atStart ? '·' : '←'}</span>
        </button>
        {/* Dot pagination. Each dot is a button so users can jump to any
            board, not just step through one at a time. */}
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
          <span className="arrow-chip" aria-hidden="true">{atEnd ? '·' : '→'}</span>
        </button>
      </div>
      {/* aria-live="polite" makes screen readers announce the new label
          when the user navigates, without interrupting their current reading. */}
      <p className="board-carousel-label" aria-live="polite" aria-atomic="true">
        <span className="counter">{counter}</span>
        {current.label && <span className="label">{current.label}</span>}
      </p>

      {/* The lightbox in track mode. Passing items[] makes it render the
          same flex-track UI internally, so opening the lightbox feels like
          a continuation of the inline carousel rather than a jump cut. */}
      <Lightbox
        items={boards.map((b, i) => ({
          src: b.src,
          alt: b.label || `Board ${i + 1}`,
        }))}
        alt={current.label || `Board ${index + 1}`}
        label={figLabel ? `${figLabel} · ${counter}` : counter}
        isOpen={open}
        onClose={() => setOpen(false)}
        onPrev={goPrev}
        onNext={goNext}
        canPrev={!atStart}
        canNext={!atEnd}
        index={index}
        total={total}
        accent="info"
      />
    </figure>
  )
}
