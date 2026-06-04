import Navbar from '../components/Navbar'

const TODOS = [
  // ---------- P1 (should land before next round of sharing) ----------
  {
    id: 'T2',
    pri: 'p1',
    cat: 'A11y',
    task: 'Real-user AT walkthrough.',
    notes: 'Drive Home + one case study with VoiceOver (mac/iOS) and NVDA (Windows). Reconcile findings against the code-only audit. Focus: dropdown announce, lightbox open/close, slide-change live region, focus restoration.',
  },
  {
    id: 'T3',
    pri: 'p1',
    cat: 'A11y',
    task: 'Run axe DevTools or WAVE against the production build.',
    notes: 'Code review can miss things only a runtime checker catches (computed contrast on overlaid gradients, dynamic ARIA state, image decode errors). Reconcile any new findings.',
  },
  {
    id: 'T4',
    pri: 'p1',
    cat: 'Content',
    task: 'About page production.',
    notes: 'Page is hidden behind a commented-out nav link. Replace every `[bracket]` placeholder with real bio copy. Drop actual photos into the Currently cards and the Origins collage. Re-enable the About nav link in `Navbar.jsx` line 124 and `Home.jsx` line 17.',
  },
  // ---------- P2 (nice-to-have, ship-quality polish) ----------
  {
    id: 'T7',
    pri: 'p2',
    cat: 'A11y',
    task: 'Touch / zoom / high-contrast spot checks.',
    notes: 'iOS Safari + Android Chrome touch interaction on dropdown and carousels. Browser zoom to 400% on Home and one case study, verify nothing horizontal-scrolls. Windows High Contrast Mode rendering of cards, chips, and the lightbox.',
  },
  {
    id: 'T8',
    pri: 'p2',
    cat: 'Perf',
    task: 'Asset compression sweep.',
    notes: 'Run `scripts/find_unused_assets.py` then inventory remaining files > 1.5 MB. Candidates: `roamio-homepage.png` (3.5 MB), `seed-expo-poster.png` (1.7 MB), 14 of 15 affinity boards average 1.5 MB. Consider WebP or AVIF for hero images.',
  },
  {
    id: 'T9',
    pri: 'p2',
    cat: 'Content',
    task: 'Specific labels for affinity-board carousel slides.',
    notes: 'Currently `BoardCarousel` items in SeedLibrary fig 4.1 are labeled `Board 1` through `Board 15`. Each board has a theme in the source image; surfacing them as labels would help skimmers and improve the `aria-live` slide announcement.',
  },
  {
    id: 'T10',
    pri: 'p2',
    cat: 'Eng',
    task: 'Lighthouse audit against production.',
    notes: 'Once the site is deployed, run Lighthouse for Performance / Accessibility / Best Practices / SEO. Track scores over time as a regression signal.',
  },

  // ---------- P3 (back-burner) ----------
  {
    id: 'T11',
    pri: 'p3',
    cat: 'Eng',
    task: 'Decide what to do with `/layout-demo` and `/audit` / `/todo` routes pre-ship.',
    notes: 'All three are unlisted but publicly accessible if anyone guesses the URL. Options: leave as-is, password-gate them, or remove from the deploy build via a `NODE_ENV` check.',
  },
  {
    id: 'T13',
    pri: 'p3',
    cat: 'Design',
    task: 'Single full-page carousel layout for case studies.',
    notes: 'Alternative case-study presentation where each section becomes a slide in a horizontal (or vertical) carousel that fills the viewport. Reads like a deck rather than a long-scroll article. Could be an opt-in "presentation mode" via a toggle on the existing case-study pages, or a standalone route.',
  },
]

const CATEGORIES = {
  Content: 'content',
  A11y: 'a11y',
  Analytics: 'analytics',
  SEO: 'seo',
  Perf: 'perf',
  Eng: 'eng',
}

const COUNTS = {
  p0: TODOS.filter((t) => t.pri === 'p0').length,
  p1: TODOS.filter((t) => t.pri === 'p1').length,
  p2: TODOS.filter((t) => t.pri === 'p2').length,
  p3: TODOS.filter((t) => t.pri === 'p3').length,
}

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

export default function Todo({ onHome }) {
  return (
    <div className="case-study-page">
      <a href="#todo-table" className="skip-link">Skip to table</a>
      <Navbar onHome={onHome} slug="todo" crumbOverride="Todo" hideProgress />

      <main className="audit-main">
        <header className="audit-head">
          <p className="audit-eyebrow">Internal · Unlisted</p>
          <h1 className="audit-title">Todo</h1>
          <p className="audit-meta">
            Open work across content, accessibility, performance, and engineering · {TODOS.length} items
          </p>
          <p className="audit-prev">
            Sibling page: <a href="#/audit" className="audit-link">Accessibility audit</a> · all 11 findings closed.
          </p>
          <ul className="audit-counts">
            <li className="count count--critical">
              <span className="count-num">{COUNTS.p0}</span>
              <span className="count-label">P0</span>
            </li>
            <li className="count count--serious">
              <span className="count-num">{COUNTS.p1}</span>
              <span className="count-label">P1</span>
            </li>
            <li className="count count--moderate">
              <span className="count-num">{COUNTS.p2}</span>
              <span className="count-label">P2</span>
            </li>
            <li className="count">
              <span className="count-num">{COUNTS.p3}</span>
              <span className="count-label">P3</span>
            </li>
          </ul>
        </header>

        <div
          id="todo-table"
          className="audit-table"
          role="table"
          aria-label="Open todo items"
        >
          <div className="audit-row audit-row--head audit-row--todo-head" role="row">
            <div role="columnheader">#</div>
            <div role="columnheader">Pri</div>
            <div role="columnheader">Category</div>
            <div role="columnheader">Task</div>
            <div role="columnheader">Notes</div>
          </div>
          {TODOS.map((t) => (
            <div className="audit-row audit-row--todo" role="row" key={t.id}>
              <div className="audit-id" role="cell">{t.id}</div>
              <div className={`audit-sev audit-sev--${t.pri}`} role="cell">
                {t.pri}
              </div>
              <div className="audit-wcag" role="cell">{t.cat}</div>
              <div className="audit-failure" role="cell">
                {t.status && (
                  <span className={`audit-status audit-status--${t.status}`}>
                    {t.status.replace('-', ' ')}
                  </span>
                )}
                <CodeMark text={t.task} />
              </div>
              <div className="audit-where" role="cell">
                <CodeMark text={t.notes} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
