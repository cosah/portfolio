import { useEffect, useRef, useState } from 'react'
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
  const cardRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const stageRef = useRef(null)
  const [isTall, setIsTall] = useState(false)

  // Reset tall detection + scroll position whenever the displayed source changes
  useEffect(() => {
    setIsTall(false)
    if (stageRef.current) stageRef.current.scrollTop = 0
  }, [src, svg, html])

  const onImageLoad = (e) => {
    const img = e.currentTarget
    if (!img.naturalWidth || !img.naturalHeight) return
    setIsTall(img.naturalHeight / img.naturalWidth > 1.6)
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && onNext && canNext) onNext()
      else if (e.key === 'ArrowLeft' && onPrev && canPrev) onPrev()
      else if (e.key === 'Tab') {
        // Focus trap
        const card = cardRef.current
        if (!card) return
        const focusable = Array.from(
          card.querySelectorAll(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          )
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          last.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus()
          e.preventDefault()
        }
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose, onPrev, onNext, canPrev, canNext])

  // Focus management: capture previous focus on open, move focus into dialog,
  // restore previous focus on close.
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement
      // Defer to next frame so the dialog has rendered before we focus into it.
      const id = requestAnimationFrame(() => {
        const card = cardRef.current
        if (!card) return
        const closeBtn = card.querySelector('.img-modal-close')
        const fallback = card.querySelector('button, a[href], [tabindex]:not([tabindex="-1"])')
        ;(closeBtn || fallback)?.focus()
      })
      return () => cancelAnimationFrame(id)
    } else if (previouslyFocusedRef.current) {
      const el = previouslyFocusedRef.current
      previouslyFocusedRef.current = null
      if (el && typeof el.focus === 'function') {
        el.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const imgClick = onNext && canNext ? onNext : onClose
  const hasArrows = !!(onPrev || onNext)
  const overlayStyle = accent ? { '--lightbox-accent': `var(--${accent})` } : undefined
  const dialogLabel = label || alt || 'Image preview'
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
      <div
        ref={cardRef}
        className="img-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel}
      >
        <div
          ref={stageRef}
          className={`img-modal-stage${isTall ? ' is-tall' : ''}`}
        >
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
              onLoad={onImageLoad}
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
