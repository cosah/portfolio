import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Lightbox({
  src,
  svg,
  html,
  alt,
  label,
  isOpen,
  onClose,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  accent,
}) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && onNext && canNext) onNext()
      else if (e.key === 'ArrowLeft' && onPrev && canPrev) onPrev()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose, onPrev, onNext, canPrev, canNext])

  if (!isOpen) return null

  const imgClick = onNext && canNext ? onNext : onClose
  const hasArrows = !!(onPrev || onNext)
  const overlayStyle = accent ? { '--lightbox-accent': `var(--${accent})` } : undefined
  const stop = (fn) => (e) => {
    e.stopPropagation()
    fn?.()
  }

  return createPortal(
    <div
      className={`img-modal-overlay${hasArrows ? ' has-arrows' : ''}`}
      onClick={onClose}
      style={overlayStyle}
    >
      {onPrev && (
        <button
          type="button"
          className="img-modal-arrow prev"
          onClick={stop(canPrev ? onPrev : null)}
          disabled={!canPrev}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      <div className="img-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="img-modal-stage">
          {html ? (
            <div
              className="img-modal-image html-wrap"
              role="img"
              aria-label={alt || label || ''}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : svg ? (
            <div
              className="img-modal-image svg-wrap"
              role="img"
              aria-label={alt || label || ''}
              onClick={imgClick}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <img
              src={src}
              alt={alt || label || ''}
              className="img-modal-image"
              onClick={imgClick}
            />
          )}
        </div>
        <div className="img-modal-footer">
          <span className="img-modal-label">{label || alt || ''}</span>
          <button
            className="img-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
      {onNext && (
        <button
          type="button"
          className="img-modal-arrow next"
          onClick={stop(canNext ? onNext : null)}
          disabled={!canNext}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  )
}
