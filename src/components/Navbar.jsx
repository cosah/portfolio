import { useEffect, useState } from 'react'

export default function Navbar({ onHome, label, slug }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function update() {
      const total = document.body.scrollHeight - window.innerHeight
      const p = total > 0 ? Math.min(99, Math.round((window.scrollY / total) * 100)) : 0
      setPct(p)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <header className="sys-header" role="banner">
      <button className="name" onClick={onHome} aria-label="Anthony Shephard, home">
        anthony.shephard
      </button>
      <span className="crumbs" aria-hidden="true">
        work / <span className="here">{slug || 'case-study'}</span>{label ? ` / ${label}` : ''}
      </span>
      <span className="progress" aria-live="polite" aria-atomic="true">
        <span className="sr-only">Reading progress: </span>
        progress <span className="pct">{String(pct).padStart(2, '0')}</span>%
      </span>
    </header>
  )
}
