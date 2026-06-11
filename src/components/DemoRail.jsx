// DemoRail wraps a PhoneCarousel and makes the outer rail's CSS variable
// match the inner content's actual rendered height. This is used in
// case studies where a sticky phone demo sits beside scrolling prose;
// the surrounding layout needs to know the demo's height so it can leave
// the right amount of room.

import { useEffect, useRef } from 'react'
import PhoneCarousel from './PhoneCarousel'

export default function DemoRail({ screens }) {
  const railRef = useRef(null)
  const innerRef = useRef(null)

  // ResizeObserver fires whenever the observed element's size changes for
  // any reason: window resize, font load, image load, content swap, etc.
  // It's the modern, reliable replacement for window resize listeners
  // when you care about a specific element rather than the viewport.
  useEffect(() => {
    const rail = railRef.current
    const inner = innerRef.current
    if (!rail || !inner) return

    function update() {
      // Set a CSS custom property on the outer rail. Stylesheets can then
      // read this with var(--demo-h) to size the rail's sticky height.
      // This is the bridge between JS-known measurements and CSS-driven layout.
      rail.style.setProperty('--demo-h', `${inner.offsetHeight}px`)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(inner)
    // ResizeObserver, like any subscription, needs to be cleaned up to
    // avoid leaking listeners when the component unmounts.
    return () => ro.disconnect()
  }, [])

  return (
    <aside ref={railRef} className="demo-rail" aria-label="Mobile demo">
      <div ref={innerRef} className="demo-rail-inner">
        <PhoneCarousel screens={screens} />
      </div>
    </aside>
  )
}
