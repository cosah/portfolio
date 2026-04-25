const CASE_STUDIES = [
  {
    id: 'seed-library',
    title: 'UM Seed Library',
    eyebrow: 'BSI UX Capstone · UX Research & Design',
    subtitle: 'Redesigning a campus seed distribution system from a 4% completion rate to a connected physical-digital ecosystem, tested with 355 participants across four research methods.',
    tags: ['UX Research', 'Client Liaison', 'Figma', 'Fall 2025 – Winter 2026'],
    accent: '#00274C',
    award: 'BSI UX Pathway Award',
  },
  {
    id: 'mintify',
    title: 'Mintify × Michigan Justice For All',
    eyebrow: 'Mintify Consulting · Project Manager',
    subtitle: 'Led a 10-person student consulting team to redesign Michigan debt court forms for a real government client, coordinating three pods across research, analysis, and design over 15 weeks.',
    tags: ['Project Management', 'Client Relations', 'Form Redesign', 'Fall 2025'],
    accent: '#1A3B5C',
  },
  {
    id: 'roamio',
    title: 'Roamio',
    eyebrow: 'SI 311 · Zero-to-One Product Design',
    subtitle: 'A travel marketplace connecting Gen Z travelers with verified local agents. Owned customer discovery research from scratch: 5 sessions, 10 hypotheses, and a research pivot that changed the product.',
    tags: ['Product Research', 'Customer Discovery', 'Figma Make', 'Spring 2026'],
    accent: '#1D3D2F',
  },
  {
    id: 'the-diag',
    title: 'The Diag',
    eyebrow: 'SI 407 · iOS App Design',
    subtitle: 'A native iOS event discovery app for the University of Michigan, built end-to-end from competitive analysis to usability-tested hi-fi prototype, with full ownership of the Create Event feature.',
    tags: ['Product Strategy', 'UX Design', 'Usability Testing', 'Fall 2025'],
    accent: '#00274C',
  },
  {
    id: 'courts-audit',
    title: 'Michigan Courts Accessibility Audit',
    eyebrow: 'SI 338 · WCAG 2.1 AA Audit',
    subtitle: 'A WCAG 2.1 AA compliance audit of 7 Michigan Courts pages delivered to a real government client, with full ownership of Site 4 and Presentation Lead for the client-facing findings deck.',
    tags: ['Accessibility', 'WCAG 2.1 AA', 'Government Client', 'Fall 2025'],
    accent: '#1E3D2F',
  },
]

export default function Home({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-corner-links">
        <a href="https://www.linkedin.com/in/anthony-shephard/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:antshep@umich.edu">Email</a>
      </div>
      <header className="home-header">
        <p className="home-eyebrow">Portfolio</p>
        <h1>Anthony Shephard</h1>
        <p>Product management, UX research, and design. <br/>Five case studies from the University of Michigan.</p>
      </header>

      <main className="case-studies-section">
        <p className="case-studies-eyebrow">Case Studies</p>
        {CASE_STUDIES.map(({ id, title, eyebrow, subtitle, tags, accent, award }) => (
          <button
            key={id}
            className="case-study-card"
            style={{ '--card-accent': accent }}
            onClick={() => onNavigate(id)}
            aria-label={`View ${title} case study`}
          >
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
            <span className="card-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </main>

      <footer className="home-footer">
        Anthony Shephard · University of Michigan · 2026
      </footer>
    </div>
  )
}
