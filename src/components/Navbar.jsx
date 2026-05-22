import { useEffect, useState } from 'react'
import { CASE_STUDIES } from '../data/caseStudies'

export default function Navbar({ onHome, label, slug }) {
  const [frac, setFrac] = useState(0)

  useEffect(() => {
    function update() {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setFrac(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const current = CASE_STUDIES.find((c) => c.id === slug)
  const others = CASE_STUDIES.filter((c) => c.id !== slug)
  const hereLabel = current ? current.title : slug || 'case-study'

  return (
    <header className="sys-header" role="banner">
      <button className="name" onClick={onHome} aria-label="Anthony Shephard, home">
        anthony.shephard
      </button>
      <span className="crumbs" aria-hidden="true">
        work /{' '}
        {current ? (
          <span className="crumbs-dropdown">
            <button
              type="button"
              className="crumbs-trigger"
              aria-haspopup="true"
              aria-label={`${current.title} — switch case study`}
            >
              <span className="here">{hereLabel}</span>
              <svg
                viewBox="0 0 24 24"
                width="10"
                height="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chevron"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="dropdown-menu" role="menu">
              {others.map((cs) => (
                <a
                  key={cs.id}
                  href={`#/${cs.id}`}
                  className="dropdown-item"
                  role="menuitem"
                >
                  {cs.title}
                </a>
              ))}
            </div>
          </span>
        ) : (
          <span className="here">{hereLabel}</span>
        )}
        {label ? ` / ${label}` : ''}
      </span>
      <span className="nav-links">
        <a
          href="https://www.linkedin.com/in/anthony-shephard/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a href="mailto:antshep@umich.edu">Email</a>
      </span>
      <div
        className="progress-bar"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(frac * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${frac * 100}%` }}
      />
    </header>
  )
}
