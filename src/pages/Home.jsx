// Home is the landing page. It shows the site eyebrow, a one-line value
// prop, a meta panel with role/school/program/year, and then the grid of
// case study cards driven by the CASE_STUDIES data file. Each card is a
// real anchor element (not a button-with-onClick) so middle-click and
// right-click "open in new tab" work natively.

import { CASE_STUDIES } from '../data/caseStudies'
import Navbar from '../components/Navbar'

// Static meta data for the right side of the home header. Anything that
// changes (year, program) gets edited here, not deep inside JSX.
const HOME_META = [
  { label: 'Role', value: 'PM, UX, Research' },
  { label: 'School', value: 'University of Michigan' },
  { label: 'Program', value: 'Bachelor of Science in Information' },
  { label: 'Year', value: '2026' },
]

export default function Home() {
  return (
    <div className="home-page">
      {/* Skip link is the first focusable element. Keyboard users hitting
          Tab once on page load land here, can press Enter, and jump
          straight to the case studies section. WCAG 2.4.1. */}
      <a href="#case-studies" className="skip-link">Skip to case studies</a>

      {/* hideProgress because the home page is short enough that the
          progress bar wouldn't move meaningfully. crumbOverride suppresses
          the "work / [slug]" default and replaces it with "Home". */}
      <Navbar crumbOverride="Home" hideProgress />

      <header className="home-header">
        <div>
          <p className="home-eyebrow">Portfolio · 2026</p>
          <h1>
            Anthony Shephard.
            <br/>
            <em>Product designer.</em>
          </h1>
          <p>Five case studies in product design, project management, and UX research and design. Real clients, tests, insights, and the rebuilds that followed.</p>
        </div>
        <div className="home-meta">
          {HOME_META.map(({ label, value }) => (
            <div key={label} className="row">
              <span>{label.toLowerCase()}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </header>

      <main id="case-studies" className="case-studies-section">
        <p className="case-studies-eyebrow"><span className="num">01</span> · Selected work</p>
        {/* Destructure each case study inside the map. Iterating CASE_STUDIES
            order = order on the page. To re-order the cards, re-order the
            array in src/data/caseStudies.js. */}
        {CASE_STUDIES.map(({ id, title, eyebrow, subtitle, tags, award, heroImage, heroImagePosition, heroImageSize }, i) => (
          // Card is a real <a> so middle-click and right-click work.
          // App.jsx's global click interceptor handles SPA navigation.
          <a
            key={id}
            className="case-study-card"
            href={`/${id}`}
            aria-label={`View ${title} case study`}
          >
            {/* Hero image goes in as a background-image rather than an <img>
                tag. This makes it easy to compose with other layered
                effects (gradient overlays, mix-blend-modes) and avoids
                the inline-element layout concerns of an <img>. */}
            {heroImage && (
              <div
                className="card-image-bg"
                aria-hidden="true"
                style={{
                  backgroundImage: `url(${heroImage})`,
                  // Each case study can override the default top-right
                  // positioning if it has a hero that needs different
                  // framing (e.g. portrait phone screens).
                  backgroundPosition: heroImagePosition || 'top right',
                  backgroundSize: heroImageSize || 'cover',
                }}
              />
            )}
            <span className="card-index">{String(i + 1).padStart(2, '0')}</span>
            <div className="card-body">
              <p className="card-eyebrow">{eyebrow}</p>
              <h2>{title}</h2>
              <p className="card-subtitle">{subtitle}</p>
              <div className="card-meta">
                {tags.map(tag => (
                  <span key={tag} className="card-tag">{tag}</span>
                ))}
                {/* Optional award marker. Only the Seed Library case
                    study has one right now (UMSI Expo Pathway Award). */}
                {award && (
                  <span className="card-award">★ {award}</span>
                )}
              </div>
            </div>
            <span className="card-arrow" aria-hidden="true">→</span>
          </a>
        ))}
      </main>

      <footer className="home-footer">
        <span className="end-marker">end of index · anthony.shephard</span>
        {/* HTML entity for the smiling face emoji. Same visual as the
            literal emoji character but avoids relying on file encoding. */}
        <span>thanks for visiting &#x1F604;</span>
      </footer>
    </div>
  )
}
