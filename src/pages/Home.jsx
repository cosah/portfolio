// Home is the landing page. It shows the site eyebrow, a one-line value
// prop, a meta panel with role/school/program/year, and then a grid of
// work cards: case studies (src/data/caseStudies.js) and projects
// (src/data/projects.js) merged and sorted newest first. Every card action
// is a real anchor (or a button for Lightbox previews) so middle-click and
// "open in new tab" work natively.

import { useRef, useState } from 'react'
import { CASE_STUDIES } from '../data/caseStudies'
import { PROJECTS } from '../data/projects'
import Navbar from '../components/Navbar'
import Lightbox from '../components/Lightbox'
import CursorGrid from '../components/CursorGrid'

// Normalize both data sources into one card shape. Projects come first so
// that, when two items share a sortDate month, the project wins the tie.
// Array.prototype.sort is stable, so ties otherwise keep data-file order.
const WORK = [
  ...PROJECTS.map((p) => ({ ...p, key: p.id })),
  ...CASE_STUDIES.map((c) => ({
    key: c.id,
    title: c.title,
    eyebrow: c.eyebrow,
    term: c.term,
    sortDate: c.sortDate,
    description: c.subtitle,
    tags: c.tags,
    award: c.award,
    thumb: c.cardImage || c.heroImage,
    thumbPosition: c.cardImagePosition,
    thumbFit: c.cardImageFit,
    cardText: c.cardText,
    links: c.links,
  })),
].sort((a, b) => b.sortDate.localeCompare(a.sortDate))

// Internal routes start with "/" and stay in the SPA. Everything else is
// an external deployment, prototype, or repo and opens in a new tab.
function isExternal(href) {
  return !href.startsWith('/')
}
function externalProps(href) {
  return isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

// Static meta data for the right side of the home header. Anything that
// changes (year, program) gets edited here, not deep inside JSX.
const HOME_META = [
  { label: 'Role', value: 'PM, UX, Research' },
  { label: 'School', value: 'University of Michigan' },
  { label: 'Program', value: 'Master of Science in Information' },
  { label: 'Track', value: 'User Centered Agile Development' },
  { label: 'Graduating', value: 'May 2027' },
  { label: 'Interning', value: 'MindsEmerge' },
]

export default function Home() {
  // Only one Lightbox preview can be open at a time, so the open card's key
  // is the state. Used by cards with no public URL (the e-ink calendar).
  const [previewKey, setPreviewKey] = useState(null)
  const previewItem = WORK.find((w) => w.key === previewKey)

  // The cursor grid is confined to the hero's text area: from the left
  // edge to the meta panel's divider line, and down to the hero's bottom
  // rule. When the meta panel stacks under the text (narrow windows), it
  // stops at the top of the panel instead.
  const headerRef = useRef(null)
  const metaRef = useRef(null)
  const heroGridRegion = () => {
    const header = headerRef.current
    if (!header) return null
    const h = header.getBoundingClientRect()
    const region = { left: 0, top: h.top, right: document.documentElement.clientWidth, bottom: h.bottom - 1 }
    const meta = metaRef.current?.getBoundingClientRect()
    if (meta) {
      if (meta.left > h.left + h.width / 2) region.right = meta.left
      else region.bottom = meta.top
    }
    return region
  }

  return (
    <div className="home-page">
      {/* Decorative gridline reveal around the cursor, confined to the
          hero. Sits behind all content (see .cursor-grid in index.css). */}
      <CursorGrid getRegion={heroGridRegion} />
      {/* Skip link is the first focusable element. Keyboard users hitting
          Tab once on page load land here, can press Enter, and jump
          straight to the work list. WCAG 2.4.1. */}
      <a href="#work" className="skip-link">Skip to work</a>

      {/* hideProgress because the home page is short enough that the
          progress bar wouldn't move meaningfully. crumbOverride suppresses
          the "work / [slug]" default and replaces it with "Home". */}
      <Navbar crumbOverride="Home" hideProgress />

      <header className="home-header" ref={headerRef}>
        <div>
          <p className="home-eyebrow">Portfolio · 2026</p>
          <h1>
            Anthony Shephard.
            <br/>
            <em>Product designer.</em>
          </h1>
          <p>Case studies and builds in product design, project management, and UX research. Most come from real clients and real usability tests, and several are live apps you can open.</p>
        </div>
        <div className="home-meta" ref={metaRef}>
          {HOME_META.map(({ label, value }) => (
            <div key={label} className="row">
              <span>{label.toLowerCase()}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </header>

      <main id="work" className="work-section">
        <p className="work-eyebrow"><span className="num">01</span> · Selected work</p>
        {/* Newest first. To change the order, change sortDate in the data
            files rather than reordering arrays. */}
        <ul className="work-grid">
          {WORK.map((item) => {
            const primary = item.links[0]
            const openPreview = () => setPreviewKey(item.key)
            // The thumbnail repeats the primary action for mouse users. It's
            // hidden from keyboard and screen readers because the primary
            // button below offers the same action.
            const thumbClass = `work-thumb${item.panel ? ' is-panel' : ''}${item.cardText ? ' is-text' : ''}`
            const thumbInner = item.cardText ? (
              <span className="work-thumb-text">
                <span className="big">{item.cardText.big}</span>
                <span className="small">{item.cardText.small}</span>
              </span>
            ) : (
              <img
                src={item.thumb}
                alt=""
                loading="lazy"
                style={{ objectPosition: item.thumbPosition, objectFit: item.thumbFit }}
              />
            )
            return (
              <li key={item.key} className="work-card">
                {primary.preview ? (
                  <button type="button" className={thumbClass} onClick={openPreview} tabIndex={-1} aria-hidden="true">
                    {thumbInner}
                  </button>
                ) : (
                  <a className={thumbClass} href={primary.href} tabIndex={-1} aria-hidden="true" {...externalProps(primary.href)}>
                    {thumbInner}
                  </a>
                )}

                <div className="work-body">
                  <p className="work-card-eyebrow">
                    {item.eyebrow} <span className="work-term">· {item.term}</span>
                  </p>
                  <h2 className="work-title">{item.title}</h2>
                  <p className="work-desc">{item.description}</p>
                  <ul className="work-tags" aria-label="Skills and tools">
                    {item.tags.map((tag) => (
                      <li key={tag} className="work-tag">{tag}</li>
                    ))}
                    {/* Optional award marker. Only the Seed Library case
                        study has one right now (UMSI Expo Pathway Award). */}
                    {item.award && <li className="work-award">★ {item.award}</li>}
                  </ul>
                  <div className="work-links">
                    {item.links.map((link, i) => {
                      const cls = `work-link${i === 0 ? ' is-primary' : ''}`
                      if (link.preview) {
                        return (
                          <button key={link.label} type="button" className={cls} onClick={openPreview}>
                            {link.label} <span aria-hidden="true">⤢</span>
                          </button>
                        )
                      }
                      const external = isExternal(link.href)
                      return (
                        <a key={link.label} className={cls} href={link.href} {...externalProps(link.href)}>
                          {link.label}{' '}
                          <span aria-hidden="true">{external ? '↗' : '→'}</span>
                          {/* Names the card in each link so a screen reader's
                              links list reads "Open app, NoteTube" rather than
                              five identical "Open app" entries. */}
                          <span className="sr-only">, {item.title}{external ? ' (opens in a new tab)' : ''}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </main>

      <footer className="home-footer">
        <span className="end-marker">end of index · anthony.shephard</span>
        {/* HTML entity for the smiling face emoji. Same visual as the
            literal emoji character but avoids relying on file encoding. */}
        <span>thanks for visiting &#x1F604;</span>
      </footer>

      <Lightbox
        isOpen={Boolean(previewItem)}
        onClose={() => setPreviewKey(null)}
        src={previewItem?.thumb}
        alt={previewItem?.thumbAlt}
        label={previewItem?.preview?.label}
      />
    </div>
  )
}
