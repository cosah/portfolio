// Lightbox is the full-screen image modal used by every image component for
// click-to-zoom. It supports two rendering modes:
//
//   - Single-image mode: pass src (or svg / html for non-image content).
//     Used by single-figure consumers like CaseStudyHero and ScrollFigure.
//
//   - Track mode: pass items[]. Every slide renders side-by-side in a flex
//     row, and the whole track translates between positions. This matches
//     the visual rhythm of the in-page carousels (BoardCarousel etc.) so
//     that opening a carousel into the lightbox preserves the transition.
//
// On top of rendering, the component handles a lot of accessibility and
// touch concerns: keyboard navigation, focus trapping, focus restoration
// on close, body scroll lock, swipe detection, and portrait-image scroll.

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
  // useRef holds a mutable value that survives re-renders without triggering
  // them. We use refs (not state) here when the value is read inside event
  // handlers and effects but doesn't need to be reflected in the rendered
  // output. Updating a ref via .current is also synchronous, unlike state.
  const cardRef = useRef(null)
  // Stores the element that had focus right before the lightbox opened, so
  // we can restore focus to that element on close. This is a WCAG 2.4.3
  // requirement: closing a modal should not strand the user's focus.
  const previouslyFocusedRef = useRef(null)
  const stageRef = useRef(null)
  // Holds the (x, y) coordinates where the user first touched. Compared
  // against the touch end position to detect a swipe gesture.
  const touchStartRef = useRef(null)
  // Set briefly after a confirmed swipe so the synthetic "click" event that
  // mobile browsers fire after a touch sequence doesn't double-trigger
  // navigation. The guard helper below checks and resets this flag.
  const swipedRef = useRef(false)
  const [isTall, setIsTall] = useState(false)
  // Per-slide aspect ratios, used to flip individual track slides into
  // "tall" mode independently. Keyed by slide index.
  const [aspects, setAspects] = useState({})

  // useTrack is the mode switch. If the consumer passed an items array, we
  // render the carousel-style track. Otherwise we fall back to single-image.
  const useTrack = Array.isArray(items) && items.length > 0
  // Clamp the index into the items array bounds defensively, so a stale
  // parent-supplied index can't crash the render with an undefined slide.
  const safeIndex = useTrack
    ? Math.max(0, Math.min(items.length - 1, index ?? 0))
    : 0

  // The "2 / 5" counter only makes sense for multi-item carousels. It's
  // rendered as a small pill on mobile (hidden on desktop via CSS).
  const showCounter =
    typeof index === 'number' && typeof total === 'number' && total > 1

  // Record the touch start position. Only single-finger touches are
  // considered swipes; multi-touch (pinch-to-zoom) gets ignored.
  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
    swipedRef.current = false
  }

  // Decide whether the touch was a swipe and, if so, navigate. The rule is:
  //   - Horizontal delta must be at least 50px (else it's a tap)
  //   - Horizontal delta must dominate vertical by 1.5x (else it's a scroll)
  // Both conditions together let users scroll tall portrait images
  // vertically without accidentally triggering prev/next.
  const onTouchEnd = (e) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0 && onNext && canNext) onNext()
    else if (dx > 0 && onPrev && canPrev) onPrev()
    swipedRef.current = true
  }

  // Higher-order wrapper that swallows the first onClick after a swipe.
  // Mobile browsers fire a synthetic click event after touchend, and without
  // this guard a left-swipe (which calls onNext) would also fire onClick
  // on the image (which also calls onNext), advancing two slides.
  const guard = (fn) => () => {
    if (swipedRef.current) {
      swipedRef.current = false
      return
    }
    fn?.()
  }

  // Resets the is-tall state and scroll position whenever the underlying
  // content reference changes. The dep array fires on any one of src, svg,
  // html, or useTrack changing. Without this reset, navigating from a tall
  // portrait image to a landscape one would briefly keep the scrollable
  // tall-mode UI applied to the wrong slide.
  useEffect(() => {
    if (!useTrack) {
      setIsTall(false)
    }
    if (stageRef.current) stageRef.current.scrollTop = 0
  }, [src, svg, html, useTrack])

  // In track mode the per-slide aspects are stored separately, so we keep
  // the isTall flag in sync with the current slide whenever the user
  // navigates (safeIndex changes) or a new slide's aspect is learned.
  useEffect(() => {
    if (!useTrack) return
    const aspect = aspects[safeIndex]
    setIsTall(typeof aspect === 'number' ? aspect > 1.6 : false)
  }, [safeIndex, aspects, useTrack])

  // Used in single-image mode. Naturalwidth/Height are the image's intrinsic
  // dimensions in pixels, available once the image has loaded. An aspect
  // ratio above 1.6 (taller than ~3:5) flips the lightbox into "tall mode"
  // on mobile, which lets the user scroll vertically inside the image.
  const onSingleImageLoad = (e) => {
    const img = e.currentTarget
    if (!img.naturalWidth || !img.naturalHeight) return
    setIsTall(img.naturalHeight / img.naturalWidth > 1.6)
  }

  // Used in track mode. Stores each slide's aspect by index so the second
  // useEffect above can sync isTall when the user navigates. The functional
  // setState form (a) => ... is used here because we're updating based on
  // previous state, which is safer than reading the closed-over value.
  // The `a[i] === aspect ? a : ...` shortcut avoids creating a new object
  // on repeat onLoad fires from the same image, which would cause
  // unnecessary re-renders.
  const onSlideImageLoad = (i, e) => {
    const img = e.currentTarget
    if (!img.naturalWidth || !img.naturalHeight) return
    const aspect = img.naturalHeight / img.naturalWidth
    setAspects((a) => (a[i] === aspect ? a : { ...a, [i]: aspect }))
  }

  // Keyboard handler effect. Runs only when the lightbox is open to avoid
  // leaking listeners. Handles three responsibilities:
  //   1. Esc closes the modal (WCAG 2.1.2: no keyboard trap)
  //   2. Left/Right arrows navigate between slides
  //   3. Tab/Shift+Tab implements the focus trap (WCAG 2.4.3)
  // It also sets body overflow to hidden so the page underneath doesn't
  // scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && onNext && canNext) onNext()
      else if (e.key === 'ArrowLeft' && onPrev && canPrev) onPrev()
      else if (e.key === 'Tab') {
        // Focus trap: query every focusable descendant, then wrap focus
        // around the boundaries. Without this, Tab would eventually move
        // focus out of the modal and into the page underneath, breaking
        // the modal contract.
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

  // Focus management on open/close.
  //
  // On open: record what had focus before the modal appeared, then defer
  // the focus move into the modal by one animation frame. The deferral
  // matters because in StrictMode (dev only) and React's batched rendering,
  // focusing immediately can race with the DOM being ready. cancelAnimationFrame
  // in the cleanup prevents the focus from happening if the modal closes
  // before the rAF callback runs.
  //
  // On close: restore focus to whatever the user was on before. This is the
  // pattern WCAG calls "Focus Order" and it's what makes modal dismissal
  // feel natural with a keyboard.
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

  // Early return AFTER all hooks. React's rules of hooks require hook calls
  // to happen unconditionally in the same order on every render, so any
  // conditional bail-out must come after every useState / useEffect / useRef.
  if (!isOpen) return null

  // Clicking the image either advances to next or closes the modal if there
  // is no next available. This makes the image itself a tap target for
  // mobile users who haven't discovered the arrows or swipe yet.
  const imgClick = onNext && canNext ? onNext : onClose
  const hasArrows = !!(onPrev || onNext)
  // accent prop sets a CSS variable that the arrow/close button styles read,
  // letting consumers theme the modal per content type (info / warn / good).
  const overlayStyle = accent ? { '--lightbox-accent': `var(--${accent})` } : undefined
  const dialogLabel = label || alt || 'Image preview'
  // stop() wraps a click handler to prevent the click from bubbling up to
  // the overlay's onClick (which would close the modal). Used on the prev
  // and next buttons.
  const stop = (fn) => (e) => {
    e.stopPropagation()
    fn?.()
  }

  // createPortal renders the modal markup into document.body instead of
  // wherever Lightbox happens to be in the React tree. This sidesteps
  // CSS overflow:hidden ancestors that would otherwise clip the modal,
  // and stacks above any ancestor z-index without fighting the cascade.
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
        // Clicks on the card itself shouldn't close the modal. Without
        // stopPropagation here, every click on the image or footer would
        // bubble up to the overlay's guarded onClose.
        onClick={(e) => e.stopPropagation()}
        // role="dialog" + aria-modal tells screen readers this is a modal
        // and content outside is inert while it's open.
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel}
      >
        {useTrack ? (
          // Track mode: every slide rendered side-by-side. The track element
          // is translated horizontally by -safeIndex * 100% to bring the
          // active slide into view. Off-screen slides are accessibility-
          // hidden via aria-hidden so screen readers don't read them.
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
                      // Only the current slide gets a real alt; the rest
                      // pass empty alt so they're announced as decorative.
                      alt={i === safeIndex ? (item.alt || alt || label || '') : ''}
                      className="img-modal-image"
                      // Only the visible slide is clickable. Clicking an
                      // off-screen slide shouldn't navigate.
                      onClick={i === safeIndex ? guard(imgClick) : undefined}
                      onLoad={(e) => onSlideImageLoad(i, e)}
                      // Drag would let the user accidentally select the
                      // image while swiping. Disabling it preserves the
                      // touch gesture cleanly.
                      draggable={false}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          // Single-image mode. Three sub-modes:
          //   html: dangerously-set HTML (legacy figure embeds)
          //   svg:  raw inline SVG (e.g. method matrices)
          //   img:  a normal image src
          // dangerouslySetInnerHTML is the React escape hatch for raw HTML.
          // It bypasses React's XSS protections, so the source content must
          // be trusted (here it's static figures from data files).
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
    // Second argument to createPortal: the DOM node to render into.
    // document.body is the safest target because nothing about the page's
    // own DOM structure can interfere with the modal's layout.
    document.body
  )
}
