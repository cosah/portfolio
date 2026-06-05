import { useEffect, useRef, useState } from 'react'
import { CASE_STUDIES } from '../data/caseStudies'

export default function Navbar({
  onHome,
  label,
  slug,
  crumbOverride,
  caseStudyMenu,
  hideProgress,
}) {
  const [frac, setFrac] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (hideProgress) return
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
  }, [hideProgress])

  useEffect(() => {
    if (!dropdownOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    const onOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onOutside)
    }
  }, [dropdownOpen])

  const current = CASE_STUDIES.find((c) => c.id === slug)
  const displayLabel = crumbOverride || current?.title || slug || 'case-study'
  const dropdownItems = current
    ? CASE_STUDIES.filter((c) => c.id !== slug)
    : caseStudyMenu
    ? CASE_STUDIES
    : null
  const showDropdown = dropdownItems && dropdownItems.length > 0
  const showWorkPrefix = !crumbOverride

  return (
    <header className="sys-header" role="banner">
      <div className="sys-header-inner">
        <a className="name" href="#/" aria-label="Anthony Shephard, home">
          anthony.shephard
        </a>
        <span className="crumbs">
          {showWorkPrefix && <span aria-hidden="true">work / </span>}
          {showDropdown ? (
            <span
              ref={dropdownRef}
              className={`crumbs-dropdown${dropdownOpen ? ' is-open' : ''}`}
            >
              <button
                type="button"
                className="crumbs-trigger"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                aria-label={`${displayLabel}, switch case study`}
                onClick={() => setDropdownOpen((o) => !o)}
              >
                <span className="here">{displayLabel}</span>
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
                {dropdownItems.map((cs) => (
                  <a
                    key={cs.id}
                    href={`#/${cs.id}`}
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {cs.title}
                  </a>
                ))}
              </div>
            </span>
          ) : (
            <span className="here">{displayLabel}</span>
          )}
          {label ? <span aria-hidden="true">{` / ${label}`}</span> : ''}
        </span>
        <span className="nav-links">
          {/* <a href="#/about">About</a> -- hidden, page not ready */}
          <a href="#/resume">Resume</a>
          <a
            href="https://www.linkedin.com/in/anthony-shephard/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon"
            aria-label="LinkedIn profile"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
          <a
            href="https://github.com/cosah/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon"
            aria-label="Portfolio source on GitHub"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18A11 11 0 0 1 12 6.8c.98.01 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
          <a
            href="mailto:antshep@umich.edu"
            className="nav-icon"
            aria-label="Email Anthony"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </a>
        </span>
      </div>
      {!hideProgress && (
        <div
          className="progress-bar"
          role="progressbar"
          aria-label="Reading progress"
          aria-valuenow={Math.round(frac * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${frac * 100}%` }}
        />
      )}
    </header>
  )
}
