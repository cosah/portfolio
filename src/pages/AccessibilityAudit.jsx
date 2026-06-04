import Navbar from '../components/Navbar'

const RESOLVED = [
  {
    id: 'C1',
    sev: 'critical',
    wcag: '1.2.2',
    summary: 'No audio content in any embedded video; SC 1.2.2 does not apply. Closed as N/A.',
    location: 'VideoSection.jsx',
  },
  {
    id: 'C2',
    sev: 'critical',
    wcag: '4.1.2',
    summary: 'Removed `aria-hidden` from `.crumbs`. "work /" prefix wrapped in its own nested `aria-hidden` span. Dropdown trigger and items now perceivable to AT.',
    location: 'Navbar.jsx',
  },
  {
    id: 'C3',
    sev: 'critical',
    wcag: '2.4.2',
    summary: '`document.title` updates per route via a `useEffect` in App.jsx using `CASE_STUDIES` titles. Format: `[Page] · Anthony Shephard\'s Portfolio`.',
    location: 'App.jsx',
  },
  {
    id: 'S1',
    sev: 'serious',
    wcag: '1.4.3',
    summary: '`--ink-dim` retired from the token set. Sole consumer (`.outro-tag`) switched to `--ink-soft` (5.8:1).',
    location: 'variables.css, about.css',
  },
  {
    id: 'S2',
    sev: 'serious',
    wcag: '4.1.2',
    summary: 'Lightbox `.img-modal-card` now declares `role="dialog"`, `aria-modal="true"`, and `aria-label` from figure label / alt / fallback.',
    location: 'Lightbox.jsx',
  },
  {
    id: 'S3',
    sev: 'serious',
    wcag: '2.4.3 · 2.1.2',
    summary: 'Lightbox captures `document.activeElement` on open, focuses close button via rAF, traps Tab/Shift+Tab within the dialog, restores focus on close.',
    location: 'Lightbox.jsx',
  },
  {
    id: 'S4',
    sev: 'serious',
    wcag: '1.4.13',
    summary: 'Crumbs dropdown controlled by `useState`: trigger has `onClick`, `aria-haspopup="menu"`, `aria-expanded` reflects state, Esc closes, outside-click closes. Hover/focus-within preserved as desktop convenience.',
    location: 'Navbar.jsx',
  },
  {
    id: 'M1',
    sev: 'moderate',
    wcag: '4.1.2',
    summary: 'Every `.arrow-chip` span in BoardCarousel / PhoneCarousel / ScrollFigure now has `aria-hidden="true"`. Button `aria-label` carries the semantic name.',
    location: '3 carousel components',
  },
  {
    id: 'M2',
    sev: 'moderate',
    wcag: '4.1.3',
    summary: 'Slide counter / label paragraphs in all three carousels have `aria-live="polite"` and `aria-atomic="true"`. Counter announces on each navigation.',
    location: '3 carousel components',
  },
  {
    id: 'M3',
    sev: 'moderate',
    wcag: '1.4.1',
    summary: 'Disabled carousel arrow now renders `·` instead of `←`/`→`. Opacity reduction retained. Stop glyph + opacity carries the disabled state independent of color.',
    location: 'BoardCarousel.jsx, ScrollFigure.jsx',
  },
  {
    id: 'M4',
    sev: 'moderate',
    wcag: '2.1.1',
    summary: 'Removed `#toolbar=0&navpanes=0` URL fragment from the resume iframe. Browser PDF viewer toolbar (zoom, page jump, search, fit-to-width) restored.',
    location: 'Resume.jsx',
  },
]

function CodeMark({ text }) {
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function AccessibilityAudit({ onHome }) {
  return (
    <div className="case-study-page">
      <a href="#audit-table" className="skip-link">Skip to table</a>
      <Navbar onHome={onHome} slug="audit" crumbOverride="Accessibility Audit" hideProgress />

      <main className="audit-main">
        <header className="audit-head">
          <p className="audit-eyebrow">Internal · Unlisted</p>
          <h1 className="audit-title">Accessibility Audit</h1>
          <p className="audit-meta">
            WCAG 2.1 AA · Self-review by code audit · 0 open findings
          </p>
          <p className="audit-prev">
            <strong>All 11 findings resolved across two passes.</strong> Pass 1 closed 7 via non-visual code changes. Pass 2 closed the remaining 4: C1 (N/A · silent video), S1 (token retired), M3 (stop glyph), M4 (PDF toolbar restored).
          </p>
          <p className="audit-prev">
            Sibling page: <a href="#/todo" className="audit-link">Open todos</a> · content, perf, SEO, and follow-up engineering work.
          </p>
          <ul className="audit-counts">
            <li className="count count--good">
              <span className="count-num">11</span>
              <span className="count-label">Resolved</span>
            </li>
            <li className="count">
              <span className="count-num">0</span>
              <span className="count-label">Open</span>
            </li>
          </ul>
        </header>

        <div
          id="audit-table"
          className="audit-table"
          role="table"
          aria-label="Resolved accessibility findings"
        >
          <div className="audit-row audit-row--head audit-row--resolved-head" role="row">
            <div role="columnheader">#</div>
            <div role="columnheader">Severity</div>
            <div role="columnheader">WCAG</div>
            <div role="columnheader">Resolution</div>
            <div role="columnheader">Where</div>
          </div>
          {RESOLVED.map((r) => (
            <div className="audit-row audit-row--resolved-full" role="row" key={r.id}>
              <div className="audit-id" role="cell">{r.id}</div>
              <div className={`audit-sev audit-sev--${r.sev}`} role="cell">{r.sev}</div>
              <div className="audit-wcag" role="cell">{r.wcag}</div>
              <div className="audit-failure" role="cell">
                <CodeMark text={r.summary} />
              </div>
              <div className="audit-where" role="cell">
                <CodeMark text={r.location} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
