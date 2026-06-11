// GridFrames is the most common case-study figure: an N-column grid of
// labelled, zoomable image cells. Each cell can have an index ("3.1"),
// a name, a short description, and an image (or a placeholder string).
// Clicking any cell opens the lightbox at that index, with the rest of
// the grid available via prev/next.

import { useState } from 'react'
import Lightbox from './Lightbox'

export default function GridFrames({ items, cols = 4, aspect = '9x16' }) {
  // openIdx is -1 when closed; otherwise it's the index of the clicked
  // cell. The Lightbox is mounted lazily based on this value.
  const [openIdx, setOpenIdx] = useState(-1)
  // Translate the cols prop into a class modifier. 4 is the default
  // (no modifier needed); 2 and 3 get explicit classes.
  const colsClass = cols === 3 ? 'cols-3' : cols === 2 ? 'cols-2' : ''

  const current = openIdx >= 0 ? items[openIdx] : null
  const total = items.length
  // Build a composite label like "3.1 · Plant Listing" from whichever
  // fields are present. .filter(Boolean) drops empty / undefined parts
  // before joining, so we never get "·" with nothing on either side.
  const labelOf = (it) =>
    [it?.ix, it?.name || it?.label].filter(Boolean).join(' · ')

  return (
    <>
      <div className={`grid-frames ${colsClass}`.trim()}>
        {items.map(({ ix, name, src, alt, label, desc, contain }, i) => (
          <div key={i} className="item">
            <div className={`frame aspect-${aspect}${contain ? ' contain' : ''}`}>
              {/* Real images become zoom triggers. Items without a src
                  show their label/name as text inside the frame. This lets
                  a placeholder figure appear in early drafts of a case
                  study without breaking the layout. */}
              {src ? (
                <button
                  type="button"
                  className="zoom-trigger"
                  onClick={() => setOpenIdx(i)}
                  aria-label={`Enlarge: ${alt || name || label || 'image'}`}
                >
                  <img src={src} alt={alt || name || label || ''} />
                </button>
              ) : (
                <span aria-hidden="true">{label || name}</span>
              )}
            </div>
            {(ix || name) && (
              <p className="label">
                {ix && <span className="ix">{ix}</span>}
                {name && <span className="name">{name}</span>}
              </p>
            )}
            {desc && <p className="desc">{desc}</p>}
          </div>
        ))}
      </div>

      {/* Lightbox is in track mode (items[] supplied) so the whole grid
          becomes a smooth carousel inside the modal. The filter on src
          excludes placeholder cells so the lightbox doesn't show empty
          slides. The wraparound modulo navigation matches what users
          expect from a gallery. */}
      {current && (
        <Lightbox
          items={items
            .filter((it) => it.src)
            .map((it) => ({ src: it.src, alt: it.alt || it.name || it.label || '' }))}
          alt={current.alt || current.name || current.label}
          label={labelOf(current)}
          isOpen={openIdx >= 0}
          onClose={() => setOpenIdx(-1)}
          onPrev={total > 1 ? () => setOpenIdx((i) => (i - 1 + total) % total) : undefined}
          onNext={total > 1 ? () => setOpenIdx((i) => (i + 1) % total) : undefined}
          index={openIdx}
          total={total}
          accent="info"
        />
      )}
    </>
  )
}
