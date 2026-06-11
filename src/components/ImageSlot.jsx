// ImageSlot is the workhorse single-figure component used inline in case
// study prose. It handles four different content types under one API:
//   - a single image (src)
//   - multiple side-by-side images (srcs[])
//   - inline SVG (svg, rendered with dangerouslySetInnerHTML)
//   - inline HTML (html, also dangerouslySetInnerHTML)
// All four open to the Lightbox on click for closer inspection.

import { useState } from 'react'
import Lightbox from './Lightbox'

export default function ImageSlot({
  id,            // optional figure id, e.g. "3.1" for "FIG. 3.1"
  caption,       // primary caption text
  label,         // fallback when caption isn't present
  children,      // last-resort text for placeholder cells
  src,           // single image
  srcs,          // array of images (or array of {src, alt} objects)
  svg,           // raw inline SVG string
  html,          // raw inline HTML string
  alt,
  aspect = '16x9',
  contain,       // toggle object-fit: contain (vs the default cover)
  phone,         // shorthand to force a 9:16 phone-screen aspect
}) {
  // -1 means closed. The same state holds both "is open?" and "which one?"
  const [openIdx, setOpenIdx] = useState(-1)
  // Phone shorthand overrides aspect. Either gives a CSS class like "aspect-9x16".
  const aspectClass = phone ? 'aspect-9x16' : `aspect-${aspect}`
  const captionText = caption || label
  const figLabel = id ? `FIG. ${id}: ${captionText || ''}`.trim() : captionText

  // Normalize srcs into a uniform shape: an array of {src, alt} objects.
  // The input can be either an array of strings (legacy) or an array of
  // objects. This makes the rest of the component agnostic to call site
  // shape.
  const images = Array.isArray(srcs) && srcs.length > 0
    ? srcs.map((img) => (typeof img === 'string' ? { src: img, alt: alt || captionText } : { ...img, alt: img.alt || alt || captionText }))
    : src
    ? [{ src, alt: alt || captionText }]
    : []
  const isMulti = images.length > 1
  const total = images.length
  const current = openIdx >= 0 ? images[openIdx] : null
  // hasMedia gates whether we render a Lightbox at all. Pure placeholder
  // slots skip the lightbox entirely.
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
        {/* Four-way render branch. Each branch produces a zoom-trigger
            button so the user can open the lightbox for closer inspection. */}
        {html ? (
          <div className="html-scroll">
            <button
              type="button"
              className="zoom-trigger html-zoom"
              onClick={() => setOpenIdx(0)}
              aria-label={`Enlarge: ${alt || captionText || 'figure'}`}
            >
              {/* dangerouslySetInnerHTML bypasses React's escaping. The
                  source content must be trusted; here it comes from
                  data files we control. */}
              <div
                className="html-inline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </button>
          </div>
        ) : images.length > 0 ? (
          // Multi-image: each image is its own zoom trigger so the user
          // can click any of them to open the lightbox at that position.
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
            {/* role="img" plus aria-label gives screen readers a single
                meaningful label for the SVG, instead of trying to parse
                every <path> inside. */}
            <span
              className="svg-inline"
              role="img"
              aria-label={alt || captionText || ''}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </button>
        ) : (
          // Placeholder fallback: shows the caption/label/children as text.
          // aria-hidden because it's a draft state, not real content.
          <span aria-hidden="true">[ {children || captionText || 'figure'} ]</span>
        )}
      </div>
      {/* The lightbox switches between track and single-image modes based
          on whether we have multiple images. The exclusive prop set means
          we never accidentally render a track for a single image. */}
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
