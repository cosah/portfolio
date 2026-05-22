import { useState } from 'react'
import Lightbox from './Lightbox'

function Panel({ kind, label, tag, src, srcs, alt, placeholder, annotations, aspect, onZoom }) {
  const images = srcs && srcs.length > 0
    ? srcs.map((img) => ({ src: img.src, alt: img.alt || label }))
    : (src ? [{ src, alt: alt || label }] : [])
  const isMulti = images.length > 1

  return (
    <div className={`panel ${kind}`}>
      <div className="label-bar">
        <span>{label}</span>
        {tag && <span className="tag">{tag}</span>}
      </div>
      <div className={`frame aspect-${aspect}${isMulti ? ' multi' : ''}`}>
        {images.length > 0 ? (
          images.map((img, i) => (
            <button
              key={i}
              type="button"
              className="zoom-trigger"
              onClick={() => onZoom(i)}
              aria-label={`Enlarge: ${img.alt}`}
            >
              <img src={img.src} alt={img.alt} />
            </button>
          ))
        ) : (
          <span aria-hidden="true">[ {placeholder} ]</span>
        )}
      </div>
      {annotations && annotations.length > 0 && (
        <div className="annotations">
          {annotations.map((text, i) => (
            <div key={i} className="ann">
              <span className="ann-num">{String.fromCharCode(97 + i)}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function flattenPanel(panel, kind) {
  if (panel.srcs && panel.srcs.length > 0) {
    return panel.srcs.map((img) => ({
      src: img.src,
      alt: img.alt || panel.label,
      label: panel.label,
      kind,
    }))
  }
  if (panel.src) {
    return [{ src: panel.src, alt: panel.alt || panel.label, label: panel.label, kind }]
  }
  return []
}

export default function BeforeAfterPair({ before, after, aspect = '9x16' }) {
  const [openIdx, setOpenIdx] = useState(-1)

  const beforeImages = flattenPanel(before, 'before')
  const afterImages = flattenPanel(after, 'after')
  const allImages = [...beforeImages, ...afterImages]
  const afterOffset = beforeImages.length

  const current = openIdx >= 0 ? allImages[openIdx] : null
  const total = allImages.length
  const hasNav = total > 1

  return (
    <div className="ba-section">
      <div className="ba-pair">
        <Panel
          kind="before"
          aspect={aspect}
          {...before}
          onZoom={(localIdx = 0) => setOpenIdx(localIdx)}
        />
        <Panel
          kind="after"
          aspect={aspect}
          {...after}
          onZoom={(localIdx = 0) => setOpenIdx(afterOffset + localIdx)}
        />
      </div>

      {current?.src && (
        <Lightbox
          src={current.src}
          alt={current.alt || current.label}
          label={current.label}
          isOpen={openIdx >= 0}
          onClose={() => setOpenIdx(-1)}
          onPrev={hasNav ? () => setOpenIdx((i) => (i - 1 + total) % total) : undefined}
          onNext={hasNav ? () => setOpenIdx((i) => (i + 1) % total) : undefined}
          accent={current.kind === 'before' ? 'warn' : 'good'}
        />
      )}
    </div>
  )
}
