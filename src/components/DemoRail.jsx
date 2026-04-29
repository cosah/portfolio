import { useEffect, useRef } from 'react'
import PhoneCarousel from './PhoneCarousel'

export default function DemoRail({ screens }) {
  const railRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const rail = railRef.current
    const inner = innerRef.current
    if (!rail || !inner) return

    function update() {
      rail.style.setProperty('--demo-h', `${inner.offsetHeight}px`)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(inner)
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
