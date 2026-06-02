import { useEffect, useState } from 'react'
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
        <button className="name" onClick={onHome} aria-label="Anthony Shephard, home">
          anthony.shephard
        </button>
        <span className="crumbs" aria-hidden="true">
          {showWorkPrefix && <>work / </>}
          {showDropdown ? (
            <span className="crumbs-dropdown">
              <button
                type="button"
                className="crumbs-trigger"
                aria-haspopup="true"
                aria-label={`${displayLabel}, switch case study`}
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
                  >
                    {cs.title}
                  </a>
                ))}
              </div>
            </span>
          ) : (
            <span className="here">{displayLabel}</span>
          )}
          {label ? ` / ${label}` : ''}
        </span>
        <span className="nav-links">
          {/* <a href="#/about">About</a> -- hidden, page not ready */}
          <a href="#/resume">Resume</a>
          <a
            href="https://www.linkedin.com/in/anthony-shephard/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
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
