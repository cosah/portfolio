import { useState, useEffect, useRef } from 'react'

const ITEM_H = 28
const TOLERANCE = 2

export default function TableOfContents({ sections }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const navRef = useRef(null)

  useEffect(() => {
    if (!sections || sections.length === 0) return

    const rail = navRef.current?.closest('.toc-rail')
    if (rail) {
      rail.style.setProperty('--toc-h', `${sections.length * ITEM_H}px`)
    }

    function update() {
      const items = navRef.current?.querySelectorAll('.toc-item')
      if (!items || items.length === 0) return

      let active = 0
      for (let i = 0; i < sections.length; i++) {
        const sectionEl = document.getElementById(sections[i].id)
        if (!sectionEl) continue
        const labelEl = sectionEl.querySelector('.section-id')
        const labelY = (labelEl ?? sectionEl).getBoundingClientRect().top
        const itemY = items[i].getBoundingClientRect().top
        if (labelY <= itemY + TOLERANCE) active = i
      }

      const scrollBottom = window.scrollY + window.innerHeight
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      )
      if (scrollBottom >= docHeight - TOLERANCE) {
        active = sections.length - 1
      }

      setActiveIndex(active)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sections])

  function handleClick(e, id, idx) {
    e.preventDefault()
    const sectionEl = document.getElementById(id)
    if (!sectionEl) return

    const labelEl = sectionEl.querySelector('.section-id')
    const items = navRef.current?.querySelectorAll('.toc-item')
    const tocItem = items?.[idx]

    if (labelEl && tocItem) {
      const labelY = labelEl.getBoundingClientRect().top
      const itemY = tocItem.getBoundingClientRect().top
      const target = window.scrollY + (labelY - itemY)
      window.scrollTo({ top: target, behavior: 'smooth' })
    } else {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav ref={navRef} className="toc" aria-label="Table of contents">
      <div className="toc-track" aria-hidden="true" />
      <div
        className="toc-indicator"
        aria-hidden="true"
        style={{ '--toc-index': activeIndex }}
      />
      <ol className="toc-list">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className={`toc-item${i === activeIndex ? ' active' : ''}`}
          >
            <a href={`#${s.id}`} onClick={(e) => handleClick(e, s.id, i)}>
              <span className="toc-num">{String(s.num).padStart(2, '0')}</span>
              <span className="toc-label">{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
