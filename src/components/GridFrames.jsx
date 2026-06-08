import { useState } from 'react'
import Lightbox from './Lightbox'

export default function GridFrames({ items, cols = 4, aspect = '9x16' }) {
  const [openIdx, setOpenIdx] = useState(-1)
  const colsClass = cols === 3 ? 'cols-3' : cols === 2 ? 'cols-2' : ''

  const current = openIdx >= 0 ? items[openIdx] : null
  const total = items.length
  const labelOf = (it) =>
    [it?.ix, it?.name || it?.label].filter(Boolean).join(' · ')

  return (
    <>
      <div className={`grid-frames ${colsClass}`.trim()}>
        {items.map(({ ix, name, src, alt, label, desc, contain }, i) => (
          <div key={i} className="item">
            <div className={`frame aspect-${aspect}${contain ? ' contain' : ''}`}>
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

      {current && (
        <Lightbox
          src={current.src}
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
