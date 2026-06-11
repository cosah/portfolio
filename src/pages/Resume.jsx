// Resume page is a thin wrapper around a browser PDF viewer iframe.
// The actual PDF lives in public/ and is served as a static asset.

import Navbar from '../components/Navbar'

// import.meta.env.BASE_URL is Vite's view of the base path the app is
// deployed under. For this project it's '/' (vite.config.js base setting),
// but referencing the env variable means deploying under a sub-path
// like '/portfolio/' would just work, no hardcoded changes needed.
const PDF_URL = `${import.meta.env.BASE_URL}anthony-shephard-resume.pdf`

export default function Resume({ onHome }) {
  return (
    <div className="case-study-page resume-page">
      <a href="#resume-frame" className="skip-link">Skip to resume</a>
      {/* caseStudyMenu makes the breadcrumb dropdown show case studies
          even though this isn't one. Useful for users who want to keep
          browsing after looking at the resume. hideProgress because the
          iframe handles its own scroll. */}
      <Navbar onHome={onHome} crumbOverride="Resume" caseStudyMenu hideProgress />

      <main className="resume-main">
        <header className="resume-head">
          <div>
            <p className="resume-eyebrow">Document · CV</p>
            <h1 className="resume-title">Resume</h1>
            <p className="resume-meta">Updated May 2026</p>
          </div>
          {/* The download attribute on an anchor forces the browser to
              download the linked file (with the suggested filename) rather
              than navigating to it. Works for same-origin URLs. */}
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

        {/* The iframe embeds the PDF using whatever the browser's native
            PDF viewer is (PDF.js in Firefox, the system viewer in Chrome
            and Safari). title is required by accessibility guidelines so
            screen readers know what the iframe contains. */}
        <iframe
          id="resume-frame"
          className="resume-frame"
          src={PDF_URL}
          title="Anthony Shephard, Resume"
        />

        {/* Fallback paragraph for cases where the iframe doesn't render
            (some old browsers, some embedded webviews, ad blockers). */}
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
