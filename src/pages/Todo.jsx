// Todo is the sister internal page to AccessibilityAudit. Same table UX,
// but lists open work items grouped by priority (P0 = blocker, P1 = next
// round, P2 = polish, P3 = back-burner) and category (A11y, Perf, Eng, etc).

import Navbar from '../components/Navbar'

// Each entry has an id (T2, T3, ...), priority, category, the task title,
// and optional longer notes. The id letter T just disambiguates from
// audit's C/S/M letters. status (rarely set) is for in-progress items.
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
  {
    id: 'T12',
    pri: 'p2',
    cat: 'Blog',
    task: 'Blog v3.1: magazine-grid card redesign.',
    notes: 'Replace the flex-row card with a CSS Grid that reflows 3 → 2 → 1 columns. Each card gets a 16:9 top-banner hero, meta line, title, excerpt, tags. Posts without `heroImage` get a styled placeholder. Tags cap at three pills + a "+N more" chip. Full spec in plan section v3.1.',
  },
  {
    id: 'T13',
    pri: 'p2',
    cat: 'Blog',
    task: 'Blog v3.2: toolbar alignment buttons (text + images).',
    notes: 'Add Left/Center/Right buttons after the list buttons in `BlogEditorToolbar`. Detection: image-only selections modify the image-attrs `.center` shorthand; everything else wraps in `<div class="blog-align-*">`. Toggle off by reapplying the same direction. Full spec in plan section v3.2.',
  },
  {
    id: 'T14',
    pri: 'p2',
    cat: 'Blog',
    task: 'Blog v3.3: redirect to post after Save and Publish.',
    notes: 'In `BlogEditor.jsx` `doSave`, add `pushState` + dispatched `popstate` to `/blog/<slug>` on success when `draft === false`. Save Draft does not redirect. Full spec in plan section v3.3.',
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
    id: 'T15',
    pri: 'p3',
    cat: 'Blog',
    task: 'Blog v3 backlog: tag cloud, search, scheduled posts, backup/export.',
    notes: 'Tag cloud at the bottom of the index (frequency-sized). Client-side search (Fuse.js or similar over title / body / tags). Scheduled posts: filter out future-dated posts at build time. Backup/export: `npm run blog:backup` script that zips `src/content/blog/` and `public/blog-assets/`.',
  },
  {
    id: 'T16',
    pri: 'p3',
    cat: 'Analytics',
    task: 'Cloudflare Workers proxy in front of Google Analytics.',
    notes: 'Distant. Move DNS to Cloudflare, write a Worker on `/__analytics/*` that forwards events to GA Measurement Protocol server-side. Client request goes to `anthonyships.com/__analytics/collect` instead of `googletagmanager.com/gtag/js`, dodging adblockers. Restores visibility on the ~30-40% of audience using content blockers. Current `typeof window.gtag === "function"` guard means clean degradation, so not urgent.',
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

// Pre-compute counts per priority so the header pills render quickly.
// Done at module load (not in the component) since the data is static.
const COUNTS = {
  p0: TODOS.filter((t) => t.pri === 'p0').length,
  p1: TODOS.filter((t) => t.pri === 'p1').length,
  p2: TODOS.filter((t) => t.pri === 'p2').length,
  p3: TODOS.filter((t) => t.pri === 'p3').length,
}

// Same backtick-to-inline-code helper as AccessibilityAudit.jsx. Kept
// per-page (rather than shared) so each internal page stays self-contained
// and the import graph for the public pages doesn't drag it in.
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
            Sibling page: <a href="/audit" className="audit-link">Accessibility audit</a> · all 11 findings closed.
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
