import { useState } from 'react'
import Lightbox from './Lightbox'

export default function ImageSlot({
  id,
  caption,
  label,
  children,
  src,
  srcs,
  svg,
  html,
  alt,
  aspect = '16x9',
  contain,
  phone,
}) {
  const [openIdx, setOpenIdx] = useState(-1)
  const aspectClass = phone ? 'aspect-9x16' : `aspect-${aspect}`
  const captionText = caption || label
  const figLabel = id ? `FIG. ${id}: ${captionText || ''}`.trim() : captionText

  const images = Array.isArray(srcs) && srcs.length > 0
    ? srcs.map((img) => (typeof img === 'string' ? { src: img, alt: alt || captionText } : { ...img, alt: img.alt || alt || captionText }))
    : src
    ? [{ src, alt: alt || captionText }]
    : []
  const isMulti = images.length > 1
  const total = images.length
  const current = openIdx >= 0 ? images[openIdx] : null
  const hasMedia = !!(images.length || svg || html)

  return (
    <figure className="figure">
      {(id || captionText) && (
        <figcaption className="figure-meta">
          {id && <span className="id">FIG. {id}</span>}
          <span>{captionText}</span>
        </figcaption>
      )}
      <div
        className={`figure-frame ${html ? 'html-frame' : aspectClass}${contain ? ' contain' : ''}${isMulti ? ' multi' : ''}${hasMedia ? '' : ' placeholder'}`}
      >
        {html ? (
          <div className="html-scroll">
            <button
              type="button"
              className="zoom-trigger html-zoom"
              onClick={() => setOpenIdx(0)}
              aria-label={`Enlarge: ${alt || captionText || 'figure'}`}
            >
              <div
                className="html-inline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </button>
          </div>
        ) : images.length > 0 ? (
          images.map((img, i) => (
            <button
              key={i}
              type="button"
              className="zoom-trigger"
              onClick={() => setOpenIdx(i)}
              aria-label={`Enlarge: ${img.alt || captionText || 'figure'}`}
            >
              <img src={img.src} alt={img.alt || captionText || ''} />
            </button>
          ))
        ) : svg ? (
          <button
            type="button"
            className="zoom-trigger"
            onClick={() => setOpenIdx(0)}
            aria-label={`Enlarge: ${alt || captionText || 'figure'}`}
          >
            <span
              className="svg-inline"
              role="img"
              aria-label={alt || captionText || ''}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </button>
        ) : (
          <span aria-hidden="true">[ {children || captionText || 'figure'} ]</span>
        )}
      </div>
      {hasMedia && (
        <Lightbox
          items={isMulti ? images : undefined}
          src={!isMulti ? (current?.src || images[0]?.src) : undefined}
          svg={svg}
          html={html}
          alt={current?.alt || alt || captionText}
          label={figLabel}
          isOpen={openIdx >= 0}
          onClose={() => setOpenIdx(-1)}
          onPrev={isMulti ? () => setOpenIdx((i) => (i - 1 + total) % total) : undefined}
          onNext={isMulti ? () => setOpenIdx((i) => (i + 1) % total) : undefined}
          index={isMulti ? openIdx : undefined}
          total={isMulti ? total : undefined}
          accent="info"
        />
      )}
    </figure>
  )
}
