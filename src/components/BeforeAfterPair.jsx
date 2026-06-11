// BeforeAfterPair shows two panels side by side: a "before" state on the
// left and an "after" state on the right. Each panel can have one or more
// images, an optional tag (like "4.32% completion"), and a list of
// lettered annotations. Opening any image puts the user in a unified
// lightbox carousel that walks across both panels, with the lightbox's
// accent color tinted to indicate which side they're currently viewing.

import { useState } from 'react'
import Lightbox from './Lightbox'

// Internal Panel component, used twice from the main BeforeAfterPair below.
// kind is either 'before' or 'after' and drives styling (color tints).
function Panel({ kind, label, tag, src, srcs, alt, placeholder, annotations, aspect, onZoom }) {
  // Same single-vs-multi normalization pattern used in ImageSlot.
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
              {/* String.fromCharCode(97 + i) generates lowercase letters:
                  97 is 'a', so the first annotation is 'a', the second
                  is 'b', and so on. Used for the "a / b / c" bullets. */}
              <span className="ann-num">{String.fromCharCode(97 + i)}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Turns one panel's data (which may have a src or srcs) into a uniform
// list of image objects tagged with kind. The combined output of both
// panels is what feeds the lightbox carousel.
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

  // Combine both panels into a single flat list for the lightbox. The
  // afterOffset lets the "after" panel's click handlers translate their
  // local index into the global combined index. Example: before has 2
  // images, after has 3. Clicking the second "after" image is local
  // index 1, global index 2 + 1 = 3.
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
          // Local index for the "before" panel maps directly to global index.
          onZoom={(localIdx = 0) => setOpenIdx(localIdx)}
        />
        <Panel
          kind="after"
          aspect={aspect}
          {...after}
          // Local index for the "after" panel gets shifted by afterOffset.
          onZoom={(localIdx = 0) => setOpenIdx(afterOffset + localIdx)}
        />
      </div>

      {/* The lightbox accent color reflects which kind the user is on:
          'warn' (orange) for before, 'good' (yellow) for after. As they
          navigate across the carousel, the accent changes. */}
      {current?.src && (
        <Lightbox
          items={hasNav ? allImages.map((it) => ({ src: it.src, alt: it.alt || it.label || '' })) : undefined}
          src={!hasNav ? current.src : undefined}
          alt={current.alt || current.label}
          label={current.label}
          isOpen={openIdx >= 0}
          onClose={() => setOpenIdx(-1)}
          onPrev={hasNav ? () => setOpenIdx((i) => (i - 1 + total) % total) : undefined}
          onNext={hasNav ? () => setOpenIdx((i) => (i + 1) % total) : undefined}
          index={hasNav ? openIdx : undefined}
          total={hasNav ? total : undefined}
          accent={current.kind === 'before' ? 'warn' : 'good'}
        />
      )}
    </div>
  )
}
