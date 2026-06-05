import { CASE_STUDIES } from '../data/caseStudies'
import Navbar from '../components/Navbar'

const HOME_META = [
  { label: 'Role', value: 'PM, UX, Research' },
  { label: 'School', value: 'University of Michigan' },
  { label: 'Program', value: 'Bachelor of Science in Information' },
  { label: 'Year', value: '2026' },
]

export default function Home() {
  return (
    <div className="home-page">
      <a href="#case-studies" className="skip-link">Skip to case studies</a>

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
        {CASE_STUDIES.map(({ id, title, eyebrow, subtitle, tags, award, heroImage, heroImagePosition, heroImageSize }, i) => (
          <a
            key={id}
            className="case-study-card"
            href={`#/${id}`}
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
          </a>
        ))}
      </main>

      <footer className="home-footer">
        <span className="end-marker">end of index · anthony.shephard</span>
        <span>thanks for visiting &#x1F604;</span>
      </footer>
    </div>
  )
}
