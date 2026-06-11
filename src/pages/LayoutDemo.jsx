// LayoutDemo is an internal tool that renders a measurement overlay and a
// wireframe of the symmetric content column the case studies use. It's
// here to make changes to the layout tokens visible at a glance: edit a
// number below and reload to see the wireframe shift to match.

import Navbar from '../components/Navbar'

// Layout constants. These mirror the values in src/css/variables.css and
// are duplicated here so the wireframe is a static reference, not a moving
// target. If you change the CSS tokens, update these too.
const CONTENT_W = 840
const RAIL_W = 220
const SPECS_W = 240
// Both side rails use the same width so the content column sits visually
// centered between them. Math.max picks the larger of TOC and Specs.
const SIDE_W = Math.max(RAIL_W, SPECS_W) // 240 (symmetric)
const GAP = 40
const WINGSPAN = SIDE_W + GAP + CONTENT_W + GAP + SIDE_W // 1400
const PAGE_PAD = 32 // matches case-study-layout padding
const OUTER_MAX = WINGSPAN + PAGE_PAD * 2 // 1464

// Box is a small wireframe primitive used to draw labelled rectangles
// inside the schematic. All styling is inline (not via CSS classes)
// because this is a development-only schematic that benefits from being
// self-contained: read the file, see exactly what each box does.
function Box({ w, h, dashed, color = '#3B3F46', bg = 'transparent', label, align = 'flex-start' }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        border: `1px ${dashed ? 'dashed' : 'solid'} ${color}`,
        background: bg,
        color: '#A4A29A',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: align,
        padding: '8px 12px',
        boxSizing: 'border-box',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </div>
  )
}

// MeasurementOverlay draws fixed-position percentage rulers across the
// viewport, similar to design-tool overlays. Useful when comparing the
// wireframe widths to actual viewport percentages on resize.
function MeasurementOverlay() {
  // 18 lines at 5%, 10%, ..., 90% of the viewport width.
  // Array.from({length: N}, (_, i) => ...) is the array-literal-style
  // way to generate a numeric range without a manual loop.
  const lines = Array.from({ length: 18 }, (_, i) => (i + 1) * 5)
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {lines.map((pct) => {
        const isMid = pct === 50
        return (
          <div
            key={pct}
            style={{
              position: 'absolute',
              left: `${pct}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: isMid
                ? 'rgba(255, 124, 58, 0.5)'
                : 'rgba(232, 197, 71, 0.18)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 6,
                left: 4,
                fontSize: 9,
                color: isMid
                  ? 'rgba(255, 124, 58, 0.9)'
                  : 'rgba(232, 197, 71, 0.7)',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.04em',
                background: 'rgba(14, 15, 17, 0.7)',
                padding: '1px 3px',
                borderRadius: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {pct}%
            </span>
            <span
              style={{
                position: 'absolute',
                bottom: 6,
                left: 4,
                fontSize: 9,
                color: isMid
                  ? 'rgba(255, 124, 58, 0.9)'
                  : 'rgba(232, 197, 71, 0.7)',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.04em',
                background: 'rgba(14, 15, 17, 0.7)',
                padding: '1px 3px',
                borderRadius: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {pct}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Wireframe() {
  const gridBase = {
    display: 'grid',
    gridTemplateColumns: `${SIDE_W}px minmax(0, ${CONTENT_W}px) ${SIDE_W}px`,
    columnGap: GAP,
    padding: `24px ${PAGE_PAD}px`,
    alignItems: 'start',
    border: '1px solid #2A2D32',
    borderRadius: 4,
    boxSizing: 'border-box',
  }
  const heroGrid = {
    ...gridBase,
    background: '#16181B',
  }
  const bodyGrid = {
    ...gridBase,
    background: '#0E0F11',
    marginTop: 12,
  }

  return (
    <div style={{ maxWidth: OUTER_MAX, margin: '0 auto', padding: `0 ${PAGE_PAD}px` }}>
      {/* HERO ROW */}
      <div style={heroGrid}>
        {/* col 1: empty (mirror of specs side) */}
        <div />
        {/* col 2: title block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Box w="100%" h={26} color="#E8C547" label={`KICKER · CONTENT COL = ${CONTENT_W}px`} />
          <Box w="100%" h={80} color="#F2EFE8" bg="rgba(232,197,71,0.04)" label="HERO TITLE: fills centered column" />
          <Box w="100%" h={48} dashed color="#A4A29A" label="Lead / subtitle paragraph" />
        </div>
        {/* col 3: specs (right rail) */}
        <div style={{ justifySelf: 'start' }}>
          <Box w={SPECS_W} h={170} color="#3B3F46" label={`SPECS · ${SPECS_W}px`} />
        </div>
      </div>

      {/* BODY ROW */}
      <div style={bodyGrid}>
        {/* col 1: TOC (left rail) */}
        <div style={{ justifySelf: 'end' }}>
          <Box w={RAIL_W} h={280} color="#3B3F46" label={`TOC · ${RAIL_W}px (sticky)`} />
        </div>
        {/* col 2: main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Box w="100%" h={20} color="#E8C547" label="01 · SECTION LABEL" />
          <Box w="100%" h={56} color="#F2EFE8" label="Section h2 headline" />
          <Box w="100%" h={120} dashed color="#A4A29A" label={`Body text · fills ${CONTENT_W}px column`} />
          <Box w="100%" h={90} color="#FF7C3A" bg="rgba(255,124,58,0.05)" label={`StatRow · ${CONTENT_W}px`} />
          <Box w="100%" h={70} dashed color="#A4A29A" label="More body text" />
          <Box w="100%" h={180} color="#6BB3FF" bg="rgba(107,179,255,0.04)" label={`GridFrames / BeforeAfter · ${CONTENT_W}px`} />
        </div>
        {/* col 3: empty (mirror of TOC side, keeps content centered) */}
        <div />
      </div>
    </div>
  )
}

export default function LayoutDemo({ onHome }) {
  return (
    <div style={{ background: '#0E0F11', color: '#F2EFE8', minHeight: '100vh', position: 'relative' }}>
      <MeasurementOverlay />
      <Navbar onHome={onHome} slug="layout-demo" />

      <div style={{ maxWidth: OUTER_MAX, margin: '0 auto', padding: '40px 32px 16px' }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#E8C547',
            fontSize: 11,
            letterSpacing: '0.06em',
          }}
        >
          OPTION C · SYMMETRIC
        </div>
        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            margin: '6px 0 8px',
          }}
        >
          Content {CONTENT_W}px · side rails {SIDE_W}px · wingspan {WINGSPAN}px
        </h1>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#A4A29A',
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 720,
            margin: 0,
          }}
        >
          Both side columns sized to {SIDE_W}px (= max of TOC {RAIL_W} and Specs {SPECS_W}),
          so the {CONTENT_W}px content column sits perfectly centered.
          Vertical measurement lines mark every 5% of the viewport width
          (18 lines total, 5% → 90%). The 50% midline is highlighted in orange.
        </p>
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#8A8A87',
            fontSize: 11,
            marginTop: 12,
            letterSpacing: '0.04em',
          }}
        >
          OUTER_MAX = {OUTER_MAX}px (wingspan + 2 × {PAGE_PAD}px page padding)
        </p>
      </div>

      <section style={{ padding: '20px 0 80px' }}>
        <Wireframe />
      </section>
    </div>
  )
}
