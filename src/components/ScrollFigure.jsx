// ScrollFigure displays a long, tall image as if it were a multi-page
// carousel. The whole image is loaded once, then the visible portion is
// shifted via CSS transform. Useful for very tall research artifacts
// (user flows, journey maps) where forcing the image to fit a single
// frame would make the contents unreadable.

import { useState } from 'react'
import Lightbox from './Lightbox'

export default function ScrollFigure({
  id,             // optional figure id for the "FIG. X.Y" label
  caption,
  src,
  alt,
  naturalAspect,  // width / height ratio of the source image, used to compute frame size
  pages = 2,      // how many vertical pages to divide the image into
}) {
  // page tracks which vertical slice is in view. Different from index in
  // BoardCarousel because there's only one image; we're moving inside it.
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const atStart = page === 0
  const atEnd = page === pages - 1

  const goPrev = () => setPage((p) => Math.max(0, p - 1))
  const goNext = () => setPage((p) => Math.min(pages - 1, p + 1))

  const figLabel = id ? `FIG. ${id}: ${caption || ''}`.trim() : caption
  const counter = `${String(page + 1).padStart(2, '0')} / ${String(pages).padStart(2, '0')}`
  // Compute the frame's aspect ratio so it's tall enough to fit one page's
  // worth of the image without distorting. If the image is 9:32 (very tall)
  // split into 4 pages, the frame should be 9:8 per page.
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
        // Inline aspect-ratio style so each ScrollFigure instance can have
        // a different page shape without needing a CSS class per image.
        style={frameAspect ? { aspectRatio: `${frameAspect}` } : undefined}
      >
        <button
          type="button"
          className="zoom-trigger flow-zoom"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge: ${alt || caption || 'figure'}`}
        >
          {/* The track is wider than its container (pages * 100%) so the
              image inside it can be larger than one frame. Translating by
              -page * (100/pages)% moves the right slice into view.
              For example: 4 pages, page=2 means translate -50%, which
              puts the 3rd quarter of the image at the left edge. */}
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
      {/* Same nav UI as BoardCarousel for consistency. */}
      <div className="board-carousel-nav">
        <button
          className="carousel-arrow prev"
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous page"
        >
          <span className="arrow-chip" aria-hidden="true">{atStart ? '·' : '←'}</span>
        </button>
        <div className="carousel-dots">
          {/* Array.from({length: N}) is a clean way to generate N empty
              slots when you don't have actual data to iterate over. The
              underscore is convention for "the value is ignored". */}
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
          <span className="arrow-chip" aria-hidden="true">{atEnd ? '·' : '→'}</span>
        </button>
      </div>
      <p className="board-carousel-label" aria-live="polite" aria-atomic="true">
        <span className="counter">{counter}</span>
      </p>

      {/* The lightbox shows the full image (not the paged version). Tall
          images automatically engage the lightbox's scrollable tall-mode
          so the user can see the whole thing without the paging UI. */}
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
