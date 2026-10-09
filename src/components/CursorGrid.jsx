// CursorGrid reveals a gridline like the case-study hero's (at half its
// 80px cell size) in a small radius around the mouse on the home page,
// drawn in a cool silver with a gold glint (the site's --good accent) that
// sweeps across the lines as the cursor moves.
//
// The canvas is only as big as the reveal circle and follows the cursor
// with a CSS transform. A full-viewport canvas would mean repainting
// millions of pixels per frame, which Firefox (often a CPU canvas) can't
// keep up with, so the grid trailed the cursor there. It's layered at
// z-index -1 inside .home-page (which isolates a stacking context), so it
// paints over the page background but under every piece of content, and
// pointer-events: none keeps clicks and text selection intact.
//
// Behavior:
//   - Fades in when the mouse enters, stays around a resting cursor, and
//     fades out when the mouse leaves the window.
//   - The glint advances with cursor travel, not time, so it shimmers while
//     you move and holds still when you stop. Once the fade settles, the
//     rAF loop stops and the last frame stays on the canvas, so an idle
//     page costs nothing.
//   - The grid is anchored to the page, so it scrolls with the content.
//   - Touch-only devices: not rendered. prefers-reduced-motion: the grid
//     follows the cursor but the glint doesn't travel.
//
// getRegion (optional) returns the viewport rect { left, top, right,
// bottom } the effect is confined to. Nothing draws outside it (the right
// and bottom edges fade down to EDGE_MIN at the line), and the grid
// fades out once the reveal circle no longer reaches into it. It's called
// every frame, so it can measure live DOM and stays right through scroll
// and resize. Without it, the whole viewport is the region.

import { useEffect, useRef } from 'react'

const CELL = 40            // half of .hero-frame::before's 80px grid
const RADIUS = 112         // reveal radius in CSS px
const SIZE = RADIUS * 2 + 8 // canvas edge in CSS px: the circle plus a little room for the glow
const PEAK_ALPHA = 0.7     // overall opacity at the cursor
const SILVER = 'rgba(200, 204, 212, 0.38)'
const SILVER_BRIGHT = 'rgba(232, 234, 238, 0.7)'
const GOLD = 'rgba(232, 197, 71, 1)'  // --good
const BAND_GAP = 176       // distance between glints along the diagonal (px)
const TRAVEL = 0.9         // glint travel per px of cursor movement
const EDGE_FADE = 100      // fade-out band inside the region's right and bottom edges (px)
const EDGE_MIN = 0.01      // opacity multiplier left at the edge line itself (1%)

export default function CursorGrid({ getRegion }) {
  const canvasRef = useRef(null)
  // Latest getRegion without re-running the effect when the parent
  // re-renders with a new function identity.
  const regionRef = useRef(getRegion)
  useEffect(() => {
    regionRef.current = getRegion
  })

  useEffect(() => {
    // Only for real pointers. Phones and tablets have no hover state, so
    // there's no cursor to follow.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let dpr = 1
    const resize = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(SIZE * dpr)
      canvas.height = Math.round(SIZE * dpr)
    }
    resize()

    // Mutable animation state lives in plain variables, not React state,
    // because it changes every frame and never needs a re-render.
    let mx = -9999
    let my = -9999
    let inWindow = false // cursor is over the window
    let visible = 0    // eased 0..1 opacity of the whole effect
    let phase = 0      // glint position along the diagonal, in px
    let raf = 0
    let prev = null

    const region = () =>
      regionRef.current?.() || { left: 0, top: 0, right: document.documentElement.clientWidth, bottom: window.innerHeight }
    // True while any part of the reveal circle overlaps the region, so the
    // grid stays visible (confined and faded) with the cursor just past an
    // edge. Distance from the cursor to the nearest point of the rect.
    const nearRegion = (r) => {
      const dx = Math.max(r.left - mx, 0, mx - r.right)
      const dy = Math.max(r.top - my, 0, my - r.bottom)
      return Math.hypot(dx, dy) < RADIUS
    }

    // A diagonal gradient twice the band gap long, with a glint at 1/4 and
    // 3/4. Sliding it by `phase` (mod one gap) repeats seamlessly, so there
    // is always a glint crossing the reveal area.
    // `glowOnly` returns the same bands with everything but the gold
    // transparent, for the soft glow strokes under the lines.
    const shimmer = (glowOnly = false) => {
      const dir = Math.SQRT1_2 // 45° down-right
      const shift = (phase % BAND_GAP) - BAND_GAP
      const ax = mx + dir * shift
      const ay = my + dir * shift
      const len = BAND_GAP * 2
      const g = ctx.createLinearGradient(ax, ay, ax + dir * len, ay + dir * len)
      const base = glowOnly ? 'rgba(232, 197, 71, 0)' : SILVER
      const bright = glowOnly ? 'rgba(232, 197, 71, 0.35)' : SILVER_BRIGHT
      g.addColorStop(0, base)
      for (const c of [0.25, 0.75]) {
        g.addColorStop(c - 0.14, base)
        g.addColorStop(c - 0.06, bright)
        g.addColorStop(c, GOLD)
        g.addColorStop(c + 0.06, bright)
        g.addColorStop(c + 0.14, base)
      }
      g.addColorStop(1, base)
      return g
    }

    const draw = () => {
      // Move the small canvas so it's centered on the cursor (whole pixels,
      // so 1px lines stay crisp), then fold that offset into the context
      // transform. Everything below draws in viewport coordinates.
      const ox = Math.round(mx - SIZE / 2)
      const oy = Math.round(my - SIZE / 2)
      canvas.style.transform = `translate3d(${ox}px, ${oy}px, 0)`
      ctx.setTransform(dpr, 0, 0, dpr, -ox * dpr, -oy * dpr)
      ctx.clearRect(ox, oy, SIZE, SIZE)
      if (visible < 0.01) return

      // No clip path here on purpose: compositing masks inside an
      // antialiased clip leaves half-covered edge pixels partly drawn. The
      // edge fades below already zero everything right of and below the
      // region, and the top and left are cleared at the end.
      const r = region()

      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()

      // Grid lines in page coordinates, converted to viewport coordinates
      // so they scroll with the page. +0.5 keeps 1px lines crisp.
      const x0 = Math.floor((mx - RADIUS + window.scrollX) / CELL) * CELL - window.scrollX
      const y0 = Math.floor((my - RADIUS + window.scrollY) / CELL) * CELL - window.scrollY
      for (let x = x0; x <= mx + RADIUS; x += CELL) {
        ctx.moveTo(x + 0.5, my - RADIUS)
        ctx.lineTo(x + 0.5, my + RADIUS)
      }
      for (let y = y0; y <= my + RADIUS; y += CELL) {
        ctx.moveTo(mx - RADIUS, y + 0.5)
        ctx.lineTo(mx + RADIUS, y + 0.5)
      }
      // Glow: the same path stroked wide and faint in gold only, so the
      // glint catches light. Two cheap strokes stand in for shadowBlur,
      // which is slow on CPU-backed canvases.
      ctx.strokeStyle = shimmer(true)
      ctx.lineWidth = 6
      ctx.globalAlpha = 0.16
      ctx.stroke()
      ctx.lineWidth = 3
      ctx.globalAlpha = 0.32
      ctx.stroke()
      ctx.globalAlpha = 1
      // The silver lines with their gold glints, crisp on top.
      ctx.lineWidth = 1
      ctx.strokeStyle = shimmer()
      ctx.stroke()

      // Soft circular reveal: keep the lines only where the radial mask is
      // opaque, strongest at the cursor and gone at the radius.
      const mask = ctx.createRadialGradient(mx, my, 0, mx, my, RADIUS)
      mask.addColorStop(0, `rgba(0,0,0,${PEAK_ALPHA * visible})`)
      mask.addColorStop(0.5, `rgba(0,0,0,${PEAK_ALPHA * 0.5 * visible})`)
      mask.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = mask
      ctx.fillRect(ox, oy, SIZE, SIZE)

      // Edge fades: two more destination-in passes, one per edge, that
      // multiply with the radial mask above. Each ramps linearly from the
      // grid's normal opacity EDGE_FADE px inside the right / bottom edge
      // down to EDGE_MIN at the line, then to zero 1px past it so nothing
      // draws beyond the divider or the rule.
      const edgeFade = (g) => {
        const atLine = EDGE_FADE / (EDGE_FADE + 1)
        g.addColorStop(0, 'rgba(0,0,0,1)')
        g.addColorStop(atLine, `rgba(0,0,0,${EDGE_MIN})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(ox, oy, SIZE, SIZE)
      }
      edgeFade(ctx.createLinearGradient(r.right - EDGE_FADE, 0, r.right + 1, 0))
      edgeFade(ctx.createLinearGradient(0, r.bottom - EDGE_FADE, 0, r.bottom + 1))

      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(ox, oy, SIZE, Math.max(0, Math.floor(r.top) - oy))
      ctx.clearRect(ox, oy, Math.max(0, Math.floor(r.left) - ox), SIZE)
    }

    // The loop only runs to ease the fade in and out. Each move also
    // schedules a single frame through it.
    const tick = () => {
      // Checked every frame (not just on mousemove) because scrolling can
      // carry the region out from under a still cursor.
      const target = inWindow && nearRegion(region()) ? 1 : 0
      visible += (target - visible) * 0.12
      if (Math.abs(target - visible) < 0.01) visible = target
      draw()
      raf = visible === target ? 0 : requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      if (prev && !reduceMotion) {
        phase += Math.hypot(e.clientX - prev.x, e.clientY - prev.y) * TRAVEL
      }
      prev = { x: e.clientX, y: e.clientY }
      mx = e.clientX
      my = e.clientY
      inWindow = true
      wake()
    }
    // Keep the last position on leave so the grid fades out where it was.
    const onLeave = () => {
      inWindow = false
      prev = null
      wake()
    }
    // Scrolling moves the grid and the region under a still cursor.
    const onScroll = () => {
      if (inWindow || visible > 0) wake()
    }
    // Resize also fires on browser zoom, which changes devicePixelRatio.
    const onResize = () => {
      resize()
      wake()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="cursor-grid"
      aria-hidden="true"
      style={{ width: SIZE, height: SIZE }}
    />
  )
}
