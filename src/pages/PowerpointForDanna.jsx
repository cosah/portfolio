// PowerpointForDanna.jsx — a private, standalone "pitch deck" page living at
// /powerpoint_for_danna. It is intentionally disconnected from the rest of the
// portfolio: no shared Navbar, its own stylesheet (danna.css, all .dpz-*
// classes), and it is registered in App.jsx's INTERNAL_ROUTES so it renders a
// noindex/nofollow robots meta tag. It is deliberately NOT in sitemap.xml and
// NOT in robots.txt (listing it there would publish the secret URL). It's a
// share-by-link-only page.
//
// The conceit: a deadpan corporate proposal deck making "a strategic case for
// one (1) first date with Danna." Six slides, projector-style, with keyboard
// + click navigation, a cursor-dodging "No" button, and a confetti + phone
// number payoff on "Yes."
//
// The two curtain photos are placeholders until the real files are dropped at
// public/danna/curtains-before.jpg and public/danna/curtains-after.jpg — see
// the Photo component, which shows a labeled placeholder until the file loads.

import { useEffect, useRef, useState } from 'react'
import '../css/danna.css'
// The curtain proof-of-work photos. A genuine before/after: bare window with
// blinds and a curtain-rod kit on the floor, then the finished hang.
import curtainsBefore from '../assets/danna/IMG_7693.JPEG'
import curtainsAfter from '../assets/danna/IMG_7753.JPEG'
// Synergy-slide food photos (the cooking and the eating) and the precedent
// slide's on-the-water photo.
import pastaPhoto from '../assets/danna/IMG_2632.JPEG'
import eatingPhoto from '../assets/danna/IMG_8586.JPEG'
import waterPhoto from '../assets/danna/IMG_7030.JPEG'

// The number revealed on "Yes." Rendered as a tap-to-text (sms:) link with a
// tel: fallback feel; kept in one constant so it's trivial to change.
const PHONE_DISPLAY = '269-532-6830'
const PHONE_SMS = 'sms:+12695326830'

// Slide metadata drives the counter and progress dots. The actual slide
// content is rendered by renderSlide() below so the interactive ask slide can
// close over component state (dodging No button, accept handler).
const SLIDE_META = [
  { id: 'cover', label: 'Cover' },
  { id: 'summary', label: 'Executive summary' },
  { id: 'curtains', label: 'Qualifications' },
  { id: 'synergy', label: 'Synergy analysis' },
  { id: 'precedent', label: 'Precedent' },
  { id: 'ask', label: 'The ask' },
]
const LAST = SLIDE_META.length - 1

// Confetti is generated once at module load (not during render) so the randomness
// lives outside React's render path. It only ever mounts once per visit, so a
// fixed-but-random set is indistinguishable from re-rolling it each time.
const CONFETTI_COLORS = ['#d8822c', '#f4d9b3', '#b5641a', '#2f8f5b', '#faf5ec', '#e8a23d']
const CONFETTI = Array.from({ length: 130 }, () => ({
  left: Math.random() * 100,
  delay: Math.random() * 2.2,
  dur: 3 + Math.random() * 2.5,
  bg: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  w: 6 + Math.random() * 7,
}))

// How far the "No" button hops each time it's approached, and how far it's
// allowed to wander from its home spot. Small numbers on purpose: it should
// wiggle just out of click range, not rocket across the slide.
const DODGE_STEP = 46
const DODGE_MAX_X = 96
const DODGE_MAX_Y = 30

// Given the current translate offset and the pointer event, returns the next
// offset: a short step directly away from the cursor, clamped to a gentle box
// around the button's home position.
function nudgeAway(prev, e, btn) {
  if (!btn) return prev
  const r = btn.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  // Fall back to the button center if the event has no coordinates (keyboard).
  const px = e && e.clientX ? e.clientX : cx
  const py = e && e.clientY ? e.clientY : cy
  let dx = cx - px
  let dy = cy - py
  const len = Math.hypot(dx, dy) || 1
  const nx = prev.x + (dx / len) * DODGE_STEP
  const ny = prev.y + (dy / len) * DODGE_STEP
  return {
    x: Math.max(-DODGE_MAX_X, Math.min(DODGE_MAX_X, nx)),
    y: Math.max(-DODGE_MAX_Y, Math.min(DODGE_MAX_Y, ny)),
  }
}

// A photo slot with a small corner tag. The image is a build-time import so
// it's always present; the placeholder only appears if a decode somehow fails.
function Photo({ src, alt, tag }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="dpz-photo">
      <img src={src} alt={alt} onError={() => setFailed(true)} />
      {failed && (
        <div className="dpz-photo-ph">
          <b>Photo</b>
          <span>{alt}</span>
        </div>
      )}
      <span className="dpz-photo-tag">{tag}</span>
    </div>
  )
}

// How far a finger has to travel (px) before a swipe commits to changing
// slides, and how much the slide rubber-bands when dragged past the first/last
// slide. Tuned for a phone: a flick of an inch or so turns the page.
const SWIPE_THRESHOLD = 52
const SWIPE_EDGE_RESISTANCE = 0.32

export default function PowerpointForDanna() {
  const [i, setI] = useState(0)
  const [accepted, setAccepted] = useState(false)
  // The "No" button starts inline; once she tries to interact it goes absolute
  // and roams. noPos holds its translate offset while dodging.
  const [noDodging, setNoDodging] = useState(false)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const actionsRef = useRef(null)

  // Touch-swipe state. `drag` is the live horizontal offset the slide follows
  // the finger by; `dragging` removes the snap transition so the follow is 1:1;
  // `dir` (1 next / -1 prev) drives the directional entrance animation so a
  // swiped slide slides in from the side the finger pulled it. The ref holds
  // per-gesture scratch (origin + locked axis) that must not trigger renders.
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [dir, setDir] = useState(0)
  const touch = useRef(null)

  const go = (next) => {
    const target = Math.max(0, Math.min(LAST, next ?? i))
    setDir(target > i ? 1 : target < i ? -1 : 0)
    setI(target)
  }

  // --- Touch swipe ------------------------------------------------------
  // We lock to a single axis on first move: a mostly-vertical drag is left to
  // the browser (dense slides scroll inside the frame), a mostly-horizontal
  // one becomes a page turn. touch-action: pan-y on the frame means we never
  // have to preventDefault, so vertical scrolling stays native and smooth.
  const onTouchStart = (e) => {
    if (accepted) return
    const t = e.touches[0]
    touch.current = { x0: t.clientX, y0: t.clientY, dx: 0, axis: null }
  }
  const onTouchMove = (e) => {
    const s = touch.current
    if (!s) return
    const t = e.touches[0]
    const dx = t.clientX - s.x0
    const dy = t.clientY - s.y0
    if (!s.axis) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
      s.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (s.axis === 'x') setDragging(true)
    }
    if (s.axis !== 'x') return
    // Rubber-band when there's no slide to reveal in that direction.
    let d = dx
    if ((i === 0 && d > 0) || (i === LAST && d < 0)) d *= SWIPE_EDGE_RESISTANCE
    s.dx = d
    setDrag(d)
  }
  const onTouchEnd = () => {
    const s = touch.current
    touch.current = null
    setDragging(false)
    setDrag(0)
    if (!s || s.axis !== 'x') return
    if (s.dx <= -SWIPE_THRESHOLD) go(i + 1)
    else if (s.dx >= SWIPE_THRESHOLD) go(i - 1)
  }

  // Arrow-key navigation, like a real presentation. Disabled once accepted so
  // the payoff screen owns the view.
  useEffect(() => {
    if (accepted) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(i + 1)
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(i - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [i, accepted])

  // Scoot the No button a short step away from the cursor, so it wiggles just
  // out of click range instead of teleporting. Triggered on hover and on
  // pointer-down so it can't be clicked, on touch the pointer-down hop happens
  // before any click registers. e.currentTarget is the button being dodged.
  const dodge = (e) => {
    const btn = e && e.currentTarget
    setNoDodging(true)
    setNoPos((prev) => nudgeAway(prev, e, btn))
  }

  const accept = () => {
    setAccepted(true)
  }

  return (
    <div className="dpz-root">
      <div className="dpz-stage">
        <div
          className="dpz-slide"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* dpz-drag follows the finger horizontally and snaps back/over on
              release; the keyed inner replays the entrance on each change. */}
          <div
            className={`dpz-drag${dragging ? '' : ' is-snapping'}`}
            style={{ transform: `translateX(${drag}px)` }}
          >
            <div
              className="dpz-slide-inner"
              key={i}
              style={dir ? { '--dpz-enter-x': dir > 0 ? '40px' : '-40px', '--dpz-enter-y': '0px' } : undefined}
            >
              {renderSlide(i, { go, accept, dodge, noDodging, noPos, actionsRef })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer controls: prev / progress dots / next, plus a counter. */}
      <div className="dpz-controls">
        <button
          type="button"
          className="dpz-nav"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div className="dpz-dots" role="tablist" aria-label="Slides">
          {SLIDE_META.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`dpz-dot${idx === i ? ' is-active' : ''}`}
              onClick={() => go(idx)}
              aria-label={`${s.label} (slide ${idx + 1})`}
              aria-selected={idx === i}
              role="tab"
            />
          ))}
        </div>

        <button
          type="button"
          className="dpz-nav"
          onClick={() => go(i + 1)}
          disabled={i === LAST}
          aria-label="Next slide"
        >
          ›
        </button>

        <span className="dpz-counter">
          {String(i + 1).padStart(2, '0')} / {String(SLIDE_META.length).padStart(2, '0')}
        </span>
      </div>

      <p className="dpz-hint" aria-live="polite">
        use ← → or the dots to advance
      </p>

      {accepted && <AcceptedOverlay />}
    </div>
  )
}

// Renders the active slide. Kept as a free function taking a handlers bag so
// each slide can be authored with its own bespoke layout while the ask slide
// still gets the interactive bits it needs.
function renderSlide(i, h) {
  switch (i) {
    case 0:
      return (
        <div className="dpz-cover">
          <span className="dpz-confidential">Confidential · prepared for Danna</span>
          <h1 className="dpz-cover-title">
            A Strategic Case for<br />One First Date
            <small>Prepared exclusively for Danna · Q3 2026</small>
          </h1>
          <p className="dpz-presented">
            Presented by <strong>Anthony</strong>, Founder of Shephard Curtain Co. (self-appointed)
          </p>
        </div>
      )

    case 1:
      return (
        <>
          <p className="dpz-eyebrow">Slide 02 · Executive summary</p>
          <h2 className="dpz-h">The short version, up front.</h2>
          <p className="dpz-body">
            I prepared this slide show for one reason. I
            think you're great, and I'd like to take you on a date.
          </p>
          <p className="dpz-body dpz-muted">
            I want to cook for you, I want to hang those curtains, and I want to get you back on the
            water. The next four slides make the case, and the dots are clickable if you'd rather skip
            to the ask.
          </p>
          <dl className="dpz-metrics">
            <div className="dpz-metric"><dt>Sincerity</dt><dd>100%</dd></div>
            <div className="dpz-metric"><dt>Curtains hung</dt><dd>100%</dd></div>
            <div className="dpz-metric"><dt>Slides to the point</dt><dd>4</dd></div>
          </dl>
        </>
      )

    case 2:
      return (
        <>
          <p className="dpz-eyebrow">Slide 03 · Qualifications</p>
          <div className="dpz-split">
            <div>
              <span className="dpz-stamp">✓ Certified install service*</span>
              <h2 className="dpz-h" style={{ margin: '0 0 0.3em' }}>
                I will, in fact, hang your curtains.
              </h2>
              <p className="dpz-body">
                You mentioned the curtains. Consider this a formal bid. Shephard Curtain Co. brings the
                drill, the level, and an unreasonable respect for a straight rod.
              </p>
              <ul className="dpz-spec">
                <li><span className="k">Tools</span><span className="v">Cordless drill, laser level, stud finder, anchors rated well past spec</span></li>
                <li><span className="k">Lead time</span><span className="v">Same day. Sooner if you bake.</span></li>
                <li><span className="k">Warranty</span><span className="v">Indefinite. References available (me).</span></li>
              </ul>
              <p className="dpz-footnote">*self-certified. before / after attached, right →. cat sold separately.</p>
            </div>
            <div className="dpz-proof">
              <Photo
                src={curtainsBefore}
                alt="Before: a bare bedroom window with old vertical blinds and a curtain-rod kit lying on the floor mid-install"
                tag="Exhibit A · before"
              />
              <Photo
                src={curtainsAfter}
                alt="After: the same window with white curtains neatly hung, daylight coming through, a cat perched on the sill"
                tag="Exhibit B · after"
              />
            </div>
          </div>
        </>
      )

    case 3:
      return (
        <>
          <p className="dpz-eyebrow">Slide 04 · Synergy analysis</p>
          <div className="dpz-split">
            <div>
              <h2 className="dpz-h" style={{ margin: '0 0 0.3em' }}>You bake. I like things <em>hot</em>. I'd call that compatible.</h2>
              <p className="dpz-body">
                You bake, sometimes a little too long. I prefer crispy confections. Where most people would reach for a fire extinguisher, I'd reach for a fork.
              </p>
              <p className="dpz-body dpz-muted">
                I'd like to eat the extra toasty ones.
              </p>
              <div className="dpz-meter">
                <div className="dpz-meter-label"><span>Oven / palate compatibility</span><span>96%</span></div>
                <div className="dpz-meter-track">
                  <div className="dpz-meter-fill" style={{ '--dpz-pct': '96%' }} />
                </div>
              </div>
            </div>
            <div className="dpz-proof">
              <Photo
                src={pastaPhoto}
                alt="A plate of pappardelle in a cream sauce next to a lemon-topped salmon filet, cooked by Anthony"
                tag="Exhibit C · the cooking"
              />
              <Photo
                src={eatingPhoto}
                alt="Anthony eating at a restaurant, chopsticks in hand"
                tag="Exhibit D · the eating"
              />
            </div>
          </div>
        </>
      )

    case 4:
      return (
        <>
          <p className="dpz-eyebrow">Slide 05 · Precedent</p>
          <div className="dpz-split">
            <div>
              <h2 className="dpz-h" style={{ margin: '0 0 0.3em' }}>You kayaked Pictured Rocks. <em>So did I.</em></h2>
              <p className="dpz-body">
                We did it separately, on the same cold and impossibly clear water, under the same cliffs,
                probably a summer or two apart. A statistician would call that a coincidence.
              </p>
              <p className="dpz-body">
                I wouldn't. I'd call it a <em>head start</em>. We already know we like the same water, so
                going back makes sense to me, and I'd rather we went in the same boat this time. Why not?
              </p>
              <p className="dpz-footnote">same lake, same instinct, two different summers</p>
            </div>
            <div className="dpz-proof dpz-proof--one">
              <Photo
                src={waterPhoto}
                alt="Anthony on the water with friends, floating the river on a sunny day"
                tag="Exhibit E · skippering on different water"
              />
            </div>
          </div>
        </>
      )

    case 5:
      return (
        <div className="dpz-ask">
          <p className="dpz-eyebrow">Slide 06 · The ask</p>
          <h2 className="dpz-h">Danna, will you go on a date with me?</h2>
          <p className="dpz-body">
            That's the whole ask, and the power of choice is entirely yours, the where and the when
            included. You asked for specifics, so here's what I'm proposing.
          </p>
          <ul className="dpz-options">
            <li><span><span className="opt-k">Dinner, cooked by me.</span> I take pasta and a sauce from scratch more seriously than I probably should.</span></li>
            <li><span><span className="opt-k">Your curtains, finally hung.</span> The offer is real, and so is the drill.</span></li>
            <li><span><span className="opt-k">Pictured Rocks, round two,</span> in the same boat this time.</span></li>
            <li><span><span className="opt-k">Coffee, if a smaller yes is the easier one.</span> Whatever works best for you.</span></li>
          </ul>

          <div className="dpz-ask-actions" ref={h.actionsRef}>
            <button type="button" className="dpz-yes" onClick={h.accept}>
              Yes →
            </button>
            <button
              type="button"
              className={`dpz-no${h.noDodging ? ' is-dodging' : ''}`}
              style={h.noDodging ? { transform: `translate(${h.noPos.x}px, ${h.noPos.y}px)` } : undefined}
              onMouseEnter={(e) => h.dodge(e)}
              onPointerDown={(e) => { e.preventDefault(); h.dodge(e) }}
              onClick={(e) => { e.preventDefault(); h.dodge(e) }}
              aria-label="No (but good luck clicking it)"
            >
              No
            </button>
          </div>
        </div>
      )

    default:
      return null
  }
}

// The "Yes" payoff: confetti rains and the number is revealed as a tap-to-text
// link. Confetti pieces are generated once after mount (in an effect, so the
// randomness stays out of render and the pieces are stable thereafter).
function AcceptedOverlay() {
  return (
    <>
      <div className="dpz-confetti" aria-hidden="true">
        {CONFETTI.map((p, idx) => (
          <i
            key={idx}
            style={{
              left: `${p.left}%`,
              background: p.bg,
              width: `${p.w}px`,
              height: `${p.w * 1.5}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      <div className="dpz-accepted" role="dialog" aria-label="She said yes">
        <span className="dpz-accepted-eyebrow">Date accepted</span>
        <h2>She said yes.</h2>
        <p>
          Best decision you'll make all week. Text me, and we'll figure
          out the rest, whether that's the pasta, the curtains, the water, or just coffee.
        </p>
        <a className="dpz-number" href={PHONE_SMS}>
          {PHONE_DISPLAY}
          <small>tap to text</small>
        </a>
        <p style={{ marginTop: '6px', fontSize: '14px' }}>Yours, Anthony</p>
      </div>
    </>
  )
}
