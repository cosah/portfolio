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
  index,
  total,
  items,
}) {
  const cardRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const stageRef = useRef(null)
  const touchStartRef = useRef(null)
  const swipedRef = useRef(false)
  const [isTall, setIsTall] = useState(false)
  // Per-slide aspect ratios — used to flip individual track slides into "tall" mode
  const [aspects, setAspects] = useState({})

  const useTrack = Array.isArray(items) && items.length > 0
  const safeIndex = useTrack
    ? Math.max(0, Math.min(items.length - 1, index ?? 0))
    : 0

  const showCounter =
    typeof index === 'number' && typeof total === 'number' && total > 1

  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
    swipedRef.current = false
  }

  const onTouchEnd = (e) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    // Horizontal swipe must clearly dominate vertical (so scroll still works)
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0 && onNext && canNext) onNext()
    else if (dx > 0 && onPrev && canPrev) onPrev()
    swipedRef.current = true
  }

  // Guard click handlers so a swipe's synthetic click doesn't also fire onClose / onNext
  const guard = (fn) => () => {
    if (swipedRef.current) {
      swipedRef.current = false
      return
    }
    fn?.()
  }

  // Reset is-tall + scroll position when the displayed content changes
  useEffect(() => {
    if (!useTrack) {
      setIsTall(false)
    }
    if (stageRef.current) stageRef.current.scrollTop = 0
  }, [src, svg, html, useTrack])

  // In track mode, sync is-tall to the current slide's known aspect
  useEffect(() => {
    if (!useTrack) return
    const aspect = aspects[safeIndex]
    setIsTall(typeof aspect === 'number' ? aspect > 1.6 : false)
  }, [safeIndex, aspects, useTrack])

  const onSingleImageLoad = (e) => {
    const img = e.currentTarget
    if (!img.naturalWidth || !img.naturalHeight) return
    setIsTall(img.naturalHeight / img.naturalWidth > 1.6)
  }

  const onSlideImageLoad = (i, e) => {
    const img = e.currentTarget
    if (!img.naturalWidth || !img.naturalHeight) return
    const aspect = img.naturalHeight / img.naturalWidth
    setAspects((a) => (a[i] === aspect ? a : { ...a, [i]: aspect }))
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && onNext && canNext) onNext()
      else if (e.key === 'ArrowLeft' && onPrev && canPrev) onPrev()
      else if (e.key === 'Tab') {
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

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement
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
      onClick={guard(onClose)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={overlayStyle}
    >
      {showCounter && (
        <div className="img-modal-counter" aria-hidden="true">
          {index + 1} / {total}
        </div>
      )}
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
        {useTrack ? (
          <div
            ref={stageRef}
            className={`img-modal-stage img-modal-stage--track${isTall ? ' is-tall' : ''}`}
          >
            <div
              className="img-modal-track"
              style={{ transform: `translate3d(${-safeIndex * 100}%, 0, 0)` }}
            >
              {items.map((item, i) => {
                const aspect = aspects[i]
                const slideIsTall = typeof aspect === 'number' && aspect > 1.6
                return (
                  <div
                    key={i}
                    className={`img-modal-slide${slideIsTall ? ' is-tall-slide' : ''}`}
                    aria-hidden={i !== safeIndex}
                  >
                    <img
                      src={item.src}
                      alt={i === safeIndex ? (item.alt || alt || label || '') : ''}
                      className="img-modal-image"
                      onClick={i === safeIndex ? guard(imgClick) : undefined}
                      onLoad={(e) => onSlideImageLoad(i, e)}
                      draggable={false}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
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
                onClick={guard(imgClick)}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : (
              <img
                src={src}
                alt={alt || label || ''}
                className="img-modal-image"
                onClick={guard(imgClick)}
                onLoad={onSingleImageLoad}
              />
            )}
          </div>
        )}
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
