import { CASE_STUDIES } from '../data/caseStudies'

const HOME_META = [
  { label: 'Role', value: 'PM, UX, Research' },
  { label: 'School', value: 'University of Michigan' },
  { label: 'Program', value: 'BS Information' },
  { label: 'Year', value: '2026' },
]

export default function Home({ onNavigate }) {
  return (
    <div className="home-page">
      <a href="#case-studies" className="skip-link">Skip to case studies</a>

      <div className="home-corner-links">
        {/* <a href="#/about">About</a> -- hidden, page not ready */}
        <a href="https://www.linkedin.com/in/anthony-shephard/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:antshep@umich.edu">Email</a>
      </div>

      <header className="home-header">
        <div>
          <p className="home-eyebrow">Portfolio · 2026</p>
          <h1>
            Anthony Shephard.
            <br/>
            <em>Five case studies.</em>
          </h1>
          <p>Product management, UX research, and design. Real clients, real tests, real failures, and the rebuilds that followed.</p>
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
        {CASE_STUDIES.map(({ id, title, eyebrow, subtitle, tags, award, heroImage, heroImagePosition, heroImageSize }, i) => (
          <button
            key={id}
            className="case-study-card"
            onClick={() => onNavigate(id)}
            aria-label={`View ${title} case study`}
          >
            {heroImage && (
              <div
                className="card-image-bg"
                aria-hidden="true"
                style={{
                  backgroundImage: `url(${heroImage})`,
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
                {award && (
                  <span className="card-award">★ {award}</span>
                )}
              </div>
            </div>
            <span className="card-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </main>

      <footer className="home-footer">
        <span className="end-marker">end of index · anthony.shephard</span>
        <span>university of michigan · 2026</span>
      </footer>
    </div>
  )
}
