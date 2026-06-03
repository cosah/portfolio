import Navbar from '../components/Navbar'

const PDF_URL = `${import.meta.env.BASE_URL}anthony-shephard-resume.pdf`

export default function Resume({ onHome }) {
  return (
    <div className="case-study-page resume-page">
      <a href="#resume-frame" className="skip-link">Skip to resume</a>
      <Navbar onHome={onHome} crumbOverride="Resume" caseStudyMenu hideProgress />

      <main className="resume-main">
        <header className="resume-head">
          <div>
            <p className="resume-eyebrow">Document · CV</p>
            <h1 className="resume-title">Resume</h1>
            <p className="resume-meta">Updated May 2026</p>
          </div>
          <a
            href={PDF_URL}
            download="Anthony-Shephard-Resume.pdf"
            className="resume-download"
            aria-label="Download resume PDF"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Download PDF
          </a>
        </header>

        <iframe
          id="resume-frame"
          className="resume-frame"
          src={PDF_URL}
          title="Anthony Shephard, Resume"
        />

        <p className="resume-fallback">
          Can't see the resume?{' '}
          <a href={PDF_URL} target="_blank" rel="noopener noreferrer">
            Open it in a new tab
          </a>{' '}
          or{' '}
          <a href={PDF_URL} download="Anthony-Shephard-Resume.pdf">
            download the PDF directly
          </a>
          .
        </p>
      </main>
    </div>
  )
}
