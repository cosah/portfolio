import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { DOCS_NAV, DOCS_FLAT, findDocsPage } from '../data/docsNav'

function extractText(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object' && node.props?.children) {
    return extractText(node.props.children)
  }
  return ''
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      /* swallow */
    }
  }

  return (
    <button
      type="button"
      className={`docs-copy${copied ? ' is-copied' : ''}`}
      onClick={copy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
    >
      <span className="docs-copy-icon" aria-hidden="true">
        {copied ? (
          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8l3.5 3.5L13 5" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="9" height="11" rx="1" />
            <path d="M6 3V2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1" />
          </svg>
        )}
      </span>
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

/* ============================================================
   Helpers
   ============================================================ */

function Code({ lang = 'jsx', head, children }) {
  const text = extractText(children)
  return (
    <>
      {head && (
        <div className="docs-code-head">
          <span>{head}</span>
          <span>{lang}</span>
        </div>
      )}
      <pre className="docs-code">
        <CopyButton text={text} />
        <code>{children}</code>
      </pre>
    </>
  )
}

function PropsTable({ rows }) {
  return (
    <table className="docs-props">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td>
              {r.name}
              {r.required && <span className="req">required</span>}
            </td>
            <td>{r.type}</td>
            <td>{r.default || '—'}</td>
            <td>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Note({ kind = 'info', children }) {
  const cls = kind === 'info' ? 'docs-note' : `docs-note docs-note--${kind}`
  const mark = kind === 'warn' ? '!' : kind === 'good' ? '✓' : 'i'
  return (
    <div className={cls}>
      <span className="docs-note-mark">{mark}</span>
      <div>{children}</div>
    </div>
  )
}

function Pager({ path }) {
  const idx = DOCS_FLAT.findIndex((p) => p.path === path)
  if (idx < 0) return null
  const prev = idx > 0 ? DOCS_FLAT[idx - 1] : null
  const next = idx < DOCS_FLAT.length - 1 ? DOCS_FLAT[idx + 1] : null
  const href = (p) => `/docs${p ? '/' + p : ''}`
  return (
    <div className="docs-pager">
      {prev ? (
        <a className="docs-pager-link docs-pager-link--prev" href={href(prev.path)}>
          <span className="docs-pager-eyebrow">← Previous</span>
          <span className="docs-pager-title">{prev.title}</span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a className="docs-pager-link docs-pager-link--next" href={href(next.path)}>
          <span className="docs-pager-eyebrow">Next →</span>
          <span className="docs-pager-title">{next.title}</span>
        </a>
      ) : (
        <span />
      )}
    </div>
  )
}

function PageWrap({ eyebrow, title, lede, children, path }) {
  return (
    <article>
      {eyebrow && <p className="docs-eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {lede && <p className="docs-lede">{lede}</p>}
      {children}
      <Pager path={path} />
    </article>
  )
}

/* ============================================================
   Introduction
   ============================================================ */

function Overview() {
  return (
    <PageWrap
      eyebrow="INTRODUCTION"
      title="Anthony Shephard's Portfolio — Docs"
      lede="A reference for everything inside the portfolio repo: how it's built, how it routes, the design tokens, every reusable component, and the patterns that hold the case studies together."
      path=""
    >
      <p>
        The portfolio is a single-page React app built with Vite. It uses hash-based routing
        (no server-side fallback required) and ships as a static bundle to GitHub Pages.
        These docs are a sibling route at <code>/docs</code>; they are intentionally not
        linked from the main site and exist primarily so the GitHub README can point reviewers
        at structured documentation.
      </p>

      <h2>What's in here</h2>
      <ul>
        <li>
          <strong>Architecture</strong> — the project layout, the routing scheme, the
          build/deploy pipeline.
        </li>
        <li>
          <strong>Design system</strong> — every CSS custom property, every font, the symmetric
          content-column system.
        </li>
        <li>
          <strong>Patterns</strong> — hash routing, SEO meta tags, GA analytics wiring, and the
          accessibility patterns that came out of the WCAG 2.1 AA self-audit.
        </li>
        <li>
          <strong>Data</strong> — the shape of <code>CASE_STUDIES</code>, which drives the home
          page, the navbar dropdown, and per-route SEO.
        </li>
        <li>
          <strong>Components</strong> — every reusable React component in{' '}
          <code>src/components/</code>, with props, types, and a copy-pasteable example.
        </li>
      </ul>

      <h2>Tech stack</h2>
      <ul>
        <li>React 19 (no router library — hash-based routing in ~30 lines)</li>
        <li>Vite 5 (dev server, build, asset pipeline)</li>
        <li>Plain CSS with custom properties (no Tailwind, no CSS-in-JS)</li>
        <li>Google Analytics 4 via <code>gtag.js</code></li>
        <li>Deployed to GitHub Pages</li>
      </ul>

      <h2>How to read these docs</h2>
      <p>
        Each page stands on its own. The sidebar groups related topics. The pager at the
        bottom of every page walks linearly through the table of contents if you'd rather
        read end-to-end.
      </p>

      <h2>Project repository</h2>
      <p>
        Source: <a href="https://github.com/cosah/portfolio" target="_blank" rel="noopener noreferrer">github.com/cosah/portfolio</a>.
      </p>
    </PageWrap>
  )
}

function GettingStarted() {
  return (
    <PageWrap
      eyebrow="INTRODUCTION"
      title="Getting Started"
      lede="Clone, install, run. Three commands."
      path="getting-started"
    >
      <h2>Prerequisites</h2>
      <ul>
        <li><strong>Node.js 18+</strong> (uses native <code>fetch</code> and ESM)</li>
        <li><strong>npm</strong> (other package managers work too)</li>
      </ul>

      <h2>Local development</h2>
      <Code lang="bash" head="Terminal">
{`git clone https://github.com/cosah/portfolio.git
cd portfolio
npm install
npm run dev`}
      </Code>
      <p>
        Vite serves on <code>http://localhost:5173</code> by default. If the port is
        occupied it'll auto-increment (5174, 5175, …).
      </p>

      <h2>Available scripts</h2>
      <PropsTable rows={[
        { name: 'npm run dev', type: 'dev server', desc: 'Vite hot-reload dev server.' },
        { name: 'npm run build', type: 'production build', desc: 'Produces optimized static bundle in dist/.' },
        { name: 'npm run preview', type: 'preview build', desc: 'Serves the production build locally for smoke-testing.' },
      ]} />

      <h2>First places to look</h2>
      <ul>
        <li><code>src/App.jsx</code> — route registry and meta-tag/analytics wiring.</li>
        <li><code>src/data/caseStudies.js</code> — content metadata for the home grid.</li>
        <li><code>src/css/variables.css</code> — every color and font token.</li>
        <li><code>src/pages/Home.jsx</code> — the landing page.</li>
      </ul>

      <Note kind="good">
        <p>
          You can poke around any route by changing the URL hash, e.g.{' '}
          <code>/seed-library</code>, <code>/audit</code>, <code>/docs</code>.
        </p>
      </Note>
    </PageWrap>
  )
}

/* ============================================================
   Architecture
   ============================================================ */

function ProjectStructure() {
  return (
    <PageWrap
      eyebrow="ARCHITECTURE"
      title="Project Structure"
      lede="Where things live and why."
      path="project-structure"
    >
      <Code lang="text" head="Top-level tree">
{`portfolio/
├── public/                  # Static assets served verbatim from the root
│   ├── favicon.*            # Favicons
│   ├── share-default.png    # Default OG share image
│   ├── *-demo.mp4           # Video demos
│   └── ...
├── src/
│   ├── assets/              # Images / SVGs imported by JS (hashed by Vite)
│   ├── components/          # Reusable React components (Navbar, Lightbox, …)
│   ├── pages/               # One file per route (Home, SeedLibrary, …)
│   ├── data/                # Static content: caseStudies, docsNav
│   ├── css/                 # Global CSS modules (variables, layout, …)
│   ├── App.jsx              # Route registry, meta-tag + analytics wiring
│   └── main.jsx             # React mount point
├── index.html               # Single HTML entry; static fallback meta tags
├── vite.config.js
└── package.json`}
      </Code>

      <h2>Components vs pages</h2>
      <p>
        <code>src/components/</code> holds reusable building blocks. A component is
        reusable if it appears in more than one place, or if its purpose is generic enough
        that it could.
      </p>
      <p>
        <code>src/pages/</code> holds top-level route components, one per route registered
        in <code>App.jsx</code>. Each case study is a page; each internal tool (Audit, Todo,
        Docs) is a page.
      </p>

      <h2>Assets: public/ vs src/assets/</h2>
      <PropsTable rows={[
        { name: 'public/', type: 'static', desc: 'Served verbatim at /. URL is stable. Use for files referenced by URL string (videos, OG image, favicons).' },
        { name: 'src/assets/', type: 'imported', desc: 'Resolved by Vite at build time. Filenames get hashed for caching. Use for everything imported by JS (images, SVGs).' },
      ]} />

      <Note>
        <p>
          Rule of thumb: if you write the path as a string (e.g.{' '}
          <code>{`<video src="/foo.mp4">`}</code>), it lives in <code>public/</code>. If you
          write <code>import foo from './foo.png'</code>, it lives in{' '}
          <code>src/assets/</code>.
        </p>
      </Note>

      <h2>CSS organization</h2>
      <PropsTable rows={[
        { name: 'variables.css', type: 'tokens', desc: 'Custom properties (colors, fonts, spacing). The single source of truth for the palette.' },
        { name: 'global.css', type: 'reset', desc: 'Document-level styles, resets, link defaults, scrollbar.' },
        { name: 'layout.css', type: 'layout', desc: 'Symmetric content-column system, case-study-page wrapper, rails.' },
        { name: 'components.css', type: 'components', desc: 'Styles for everything in src/components/. The biggest file.' },
        { name: 'index.css', type: 'home', desc: 'Home page only.' },
        { name: 'about.css, resume.css', type: 'page-specific', desc: 'About and Resume pages.' },
        { name: 'audit.css', type: 'internal', desc: 'Accessibility Audit + Todo pages (they share table styles).' },
        { name: 'docs.css', type: 'docs', desc: 'This documentation site.' },
      ]} />
    </PageWrap>
  )
}

function Routing() {
  return (
    <PageWrap
      eyebrow="ARCHITECTURE"
      title="Routing"
      lede="HTML5 history-API routing in ~60 lines. No router library."
      path="routing"
    >
      <h2>How it works</h2>
      <p>
        Routes are stored in the URL pathname (<code>/route-id</code>) and managed with{' '}
        <code>window.history.pushState</code> and the <code>popstate</code> event. No hash
        fragments, no router library — clean URLs that are good for SEO, sharing, and AI
        crawlers.
      </p>
      <p>
        Direct hits to a sub-path (e.g. someone pasting{' '}
        <code>https://anthonyships.com/seed-library</code> into a fresh tab) work because
        GitHub Pages serves a copy of <code>index.html</code> at <code>404.html</code> —
        the SPA loads on any path and routes from <code>window.location.pathname</code>.
      </p>

      <Code lang="jsx" head="App.jsx (excerpt)">
{`const ROUTES = {
  '': Home,
  'the-diag': TheDiag,
  'mintify': Mintify,
  // …
  'docs': Docs,
}

function getRoute() {
  return window.location.pathname
    .replace(/^\\/+/, '')
    .replace(/\\/+$/, '')
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onPop = () => {
      setRoute(getRoute())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const Page = ROUTES[route] ?? ROUTES[route.split('/')[0]] ?? Home
  return <Page />
}`}
      </Code>

      <h2>SPA click interception</h2>
      <p>
        Plain left-clicks on internal anchors use{' '}
        <code>history.pushState</code> instead of a full page reload. Middle-click,
        Cmd/Ctrl-click, Shift-click, right-click, <code>target="_blank"</code>, and{' '}
        <code>download</code> attributes all bypass the interceptor, so every link still
        supports "open in new tab" natively.
      </p>

      <Code lang="jsx" head="App.jsx (excerpt)">
{`useEffect(() => {
  const onClick = (e) => {
    if (e.button !== 0) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = e.target.closest('a')
    if (!a) return
    if (a.target && a.target !== '_self') return
    if (a.hasAttribute('download')) return
    const href = a.getAttribute('href')
    if (!href || /^([a-z]+:|\\/\\/|#)/i.test(href)) return
    if (a.origin !== window.location.origin) return

    e.preventDefault()
    const target = a.pathname + a.search + a.hash
    window.history.pushState(null, '', target)
    setRoute(getRoute())
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}, [])`}
      </Code>

      <h2>Registering a route</h2>
      <ol>
        <li>Create a page component in <code>src/pages/</code>.</li>
        <li>Add an entry to <code>ROUTES</code> in <code>App.jsx</code>.</li>
        <li>Add a title to <code>STATIC_TITLES</code> and a description to <code>PAGE_DESCRIPTIONS</code>.</li>
        <li>If the page should be hidden from search engines, add the route id to <code>INTERNAL_ROUTES</code>.</li>
      </ol>

      <h2>Sub-routes</h2>
      <p>
        Routes can include a slash (e.g. <code>docs/components/lightbox</code>). The lookup
        falls back to the first segment, so <code>docs/anything</code> always lands on the
        Docs component. The component then does its own sub-routing by reading the rest of
        the pathname.
      </p>

      <h2>Legacy hash links</h2>
      <p>
        Older bookmarks or shared links may still use the hash form{' '}
        (<code>/#/seed-library</code>). On initial mount, App.jsx detects any URL whose hash
        starts with <code>#/</code> and rewrites it to the clean path via{' '}
        <code>history.replaceState</code>, so old links resolve to the right page without a
        broken state.
      </p>

      <h2>Navigation</h2>
      <p>
        Anywhere in the app, an anchor with <code>href="/route-id"</code> just works — the
        global click handler converts it to a pushState. Programmatic navigation is{' '}
        <code>window.history.pushState(null, '', '/route-id')</code> followed by{' '}
        <code>setRoute(getRoute())</code>.
      </p>
    </PageWrap>
  )
}

function BuildDeploy() {
  return (
    <PageWrap
      eyebrow="ARCHITECTURE"
      title="Build & Deploy"
      lede="Static bundle. GitHub Pages. No server."
      path="build-deploy"
    >
      <h2>Production build</h2>
      <Code lang="bash" head="Terminal">
{`npm run build`}
      </Code>
      <p>
        Vite produces a static bundle in <code>dist/</code>: a single HTML entry plus
        hashed JS/CSS/asset chunks. Heroes are preloaded and lazy assets are
        code-split per route.
      </p>

      <h2>Preview locally</h2>
      <Code lang="bash" head="Terminal">
{`npm run preview`}
      </Code>
      <p>
        Serves <code>dist/</code> on a local port. Useful for sanity-checking the
        production output before pushing.
      </p>

      <h2>Deploy to GitHub Pages</h2>
      <p>
        The site is deployed via GitHub Actions on every push to <code>main</code>. The
        workflow file lives at <code>.github/workflows/deploy.yml</code>.
      </p>

      <h2>SPA fallback for clean URLs</h2>
      <p>
        Routing uses the HTML5 history API, so paths like{' '}
        <code>/seed-library</code> need to resolve to <code>index.html</code> even on a
        cold direct hit. GitHub Pages serves <code>404.html</code> for any path it can't
        find, so the build copies <code>dist/index.html</code> →{' '}
        <code>dist/404.html</code> as a postbuild step:
      </p>
      <Code lang="json" head="package.json">
{`"scripts": {
  "build": "vite build && node scripts/spa-fallback.mjs"
}`}
      </Code>
      <p>
        The fallback script writes <code>dist/404.html</code> with identical content.
        The HTTP status is technically <code>404</code>, but the rendered content is the
        SPA, which then routes from <code>window.location.pathname</code>.
      </p>

      <h2>Base path</h2>
      <p>
        <code>vite.config.js</code> sets <code>base: '/'</code>. If you deploy under a
        sub-path (e.g. <code>username.github.io/portfolio/</code>), change it to{' '}
        <code>base: '/portfolio/'</code> and make sure all anchors stay relative.
      </p>
    </PageWrap>
  )
}

/* ============================================================
   Design system
   ============================================================ */

function ColorsDoc() {
  const tokens = [
    { name: '--bg', val: '#0E0F11', desc: 'Base background — almost-black.' },
    { name: '--surface', val: '#16181B', desc: 'Card / panel background.' },
    { name: '--surface-2', val: '#1D1F23', desc: 'Hover / striped row.' },
    { name: '--surface-3', val: '#25282D', desc: 'Pressed / active.' },
    { name: '--rule', val: '#2A2D32', desc: 'Default border / divider.' },
    { name: '--rule-strong', val: '#3B3F46', desc: 'Emphasized border.' },
    { name: '--ink', val: '#F2EFE8', desc: 'Primary text (≥7:1 against bg).' },
    { name: '--ink-mid', val: '#A4A29A', desc: 'Secondary text (4.5:1).' },
    { name: '--ink-soft', val: '#8A8A87', desc: 'Tertiary / metadata (5.8:1).' },
    { name: '--good', val: '#E8C547', desc: 'Positive / award accent (yellow).' },
    { name: '--good-dim', val: '#9B8224', desc: 'Muted yellow.' },
    { name: '--warn', val: '#FF7C3A', desc: 'Warning / critical accent (orange).' },
    { name: '--warn-dim', val: '#8F4A22', desc: 'Muted orange.' },
    { name: '--info', val: '#6BB3FF', desc: 'Info / link accent (blue).' },
  ]
  return (
    <PageWrap
      eyebrow="DESIGN SYSTEM"
      title="Color & Tokens"
      lede="One palette. Defined as CSS custom properties on :root. Reference by name everywhere."
      path="design/colors"
    >
      <p>
        All colors are declared in{' '}
        <code>src/css/variables.css</code> under <code>:root</code>. Components reference
        them as <code>var(--token)</code> — no hex codes scattered through component
        styles.
      </p>

      <h2>Tokens</h2>
      <div className="docs-swatches">
        {tokens.map((t) => (
          <div className="docs-swatch" key={t.name}>
            <span className="docs-swatch-chip" style={{ background: t.val }} />
            <span className="docs-swatch-meta">
              <span className="docs-swatch-name">{t.name}</span>
              <span className="docs-swatch-val">{t.val} — {t.desc}</span>
            </span>
          </div>
        ))}
      </div>

      <h2>Contrast</h2>
      <ul>
        <li><code>--ink</code> on <code>--bg</code> → ~13.2:1 (AAA).</li>
        <li><code>--ink-mid</code> on <code>--bg</code> → ~7.4:1 (AAA).</li>
        <li><code>--ink-soft</code> on <code>--bg</code> → ~5.8:1 (AA).</li>
      </ul>
      <p>
        <code>--ink-dim</code> was retired during the accessibility audit; all consumers
        moved to <code>--ink-soft</code>.
      </p>
    </PageWrap>
  )
}

function TypographyDoc() {
  return (
    <PageWrap
      eyebrow="DESIGN SYSTEM"
      title="Typography"
      lede="Three families. Each with one job."
      path="design/typography"
    >
      <PropsTable rows={[
        { name: '--serif', type: 'Fraunces', default: 'headings', desc: 'Editorial / case-study titles. Optical-size variable font.' },
        { name: '--sans', type: 'Inter', default: 'body', desc: 'Body copy, UI labels, controls.' },
        { name: '--mono', type: 'JetBrains Mono', default: 'metadata', desc: 'Eyebrows, captions, code, tags, technical detail.' },
      ]} />

      <h2>Where each is used</h2>
      <ul>
        <li><strong>Fraunces</strong> — H1 / H2 / H3 inside case studies, big numbers in <code>StatRow</code>, <code>Callout</code> titles.</li>
        <li><strong>Inter</strong> — paragraph body, navbar, buttons, page descriptions.</li>
        <li><strong>JetBrains Mono</strong> — section labels ("SEC. 04"), tags ("Mixed-Methods Research"), captions, audit tables, dates.</li>
      </ul>

      <h2>Sizes</h2>
      <p>
        Sizes are usually declared with <code>clamp(min, vw, max)</code> for fluid
        responsive scaling. There is no global type scale; each context tunes its own.
      </p>
    </PageWrap>
  )
}

function LayoutDoc() {
  return (
    <PageWrap
      eyebrow="DESIGN SYSTEM"
      title="Layout & Spacing"
      lede="Symmetric content column. Sticky left rail. Editorial reading width."
      path="design/layout"
    >
      <h2>Tokens</h2>
      <PropsTable rows={[
        { name: '--max-width', type: 'px', default: '1464px', desc: 'Outermost page max-width.' },
        { name: '--content-w', type: 'px', default: '840px', desc: 'Reading column for case-study prose.' },
        { name: '--rail-w', type: 'px', default: '240px', desc: 'Left rail (TOC) width.' },
        { name: '--rail-gap', type: 'px', default: '40px', desc: 'Gap between rail and content.' },
      ]} />

      <h2>The case-study layout</h2>
      <p>
        Every case study uses a 3-column grid: TOC rail on the left, prose in the middle,
        breathing room on the right. The right column intentionally mirrors the left's
        width so the prose stays optically centered.
      </p>
      <Code lang="css" head="Approximate layout (simplified)">
{`.case-study-layout {
  display: grid;
  grid-template-columns:
    var(--rail-w)
    var(--rail-gap)
    minmax(0, var(--content-w))
    var(--rail-gap)
    var(--rail-w);
  max-width: var(--max-width);
  margin: 0 auto;
}`}
      </Code>

      <h2>Vertical rhythm</h2>
      <p>
        Spacing is by feel, not on a strict 4/8px grid. Common values: 8 / 12 / 16 / 20 /
        24 / 32 / 48 / 64. Sections are separated by 48px+ to give each finding room to
        breathe.
      </p>
    </PageWrap>
  )
}

/* ============================================================
   Patterns
   ============================================================ */

function SeoMeta() {
  return (
    <PageWrap
      eyebrow="PATTERNS"
      title="SEO & Meta Tags"
      lede="Per-route document.title, description, Open Graph, Twitter Cards, robots."
      path="patterns/seo-meta"
    >
      <h2>How it works</h2>
      <p>
        Two layers:
      </p>
      <ol>
        <li>
          <strong>Static fallback</strong> in <code>index.html</code> — covers crawlers that
          don't execute JavaScript (Facebook, LinkedIn, iMessage, most Slack previews).
        </li>
        <li>
          <strong>Per-route updates</strong> in <code>App.jsx</code> — a useEffect that
          mutates <code>document.head</code> whenever the route changes. Covers Googlebot
          and other JS-aware crawlers, plus browser tab titles.
        </li>
      </ol>

      <h2>What gets set per route</h2>
      <ul>
        <li><code>document.title</code> → <em>"Page Title · Anthony Shephard's Portfolio"</em></li>
        <li><code>{`<meta name="description">`}</code></li>
        <li><code>og:title</code>, <code>og:description</code>, <code>og:image</code>, <code>og:url</code></li>
        <li><code>twitter:title</code>, <code>twitter:description</code>, <code>twitter:image</code></li>
        <li><code>{`<meta name="robots">`}</code> → <code>noindex,nofollow</code> for internal routes, else <code>index,follow</code></li>
      </ul>

      <h2>Per-route data</h2>
      <p>
        Case studies inherit their <code>subtitle</code> as the description and their{' '}
        <code>heroImage</code> as the OG image. Non-case-study routes (Resume, About,
        Audit, Todo, Layout Demo) have bespoke descriptions in <code>PAGE_DESCRIPTIONS</code>.
      </p>

      <Note kind="warn">
        <p>
          The dynamic updates help JS-aware crawlers. For social previews, the fallback in{' '}
          <code>index.html</code> is what most platforms see. To preview per-route OG cards
          correctly, you'd need SSR or a build-time prerender step — not currently set up.
        </p>
      </Note>
    </PageWrap>
  )
}

function AnalyticsDoc() {
  return (
    <PageWrap
      eyebrow="PATTERNS"
      title="Analytics"
      lede="Google Analytics 4 via gtag.js. Manual page_view per route change."
      path="patterns/analytics"
    >
      <h2>Setup</h2>
      <p>
        The <code>gtag.js</code> script loads asynchronously from{' '}
        <code>index.html</code>. The config sets{' '}
        <code>send_page_view: false</code> so GA doesn't auto-fire on initial load.
      </p>

      <Code lang="html" head="index.html">
{`<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXX', { send_page_view: false });
</script>`}
      </Code>

      <h2>Per-route page_view</h2>
      <p>
        The same useEffect that updates the meta tags also fires a manual{' '}
        <code>page_view</code>:
      </p>

      <Code lang="jsx" head="App.jsx (excerpt)">
{`if (typeof window.gtag === 'function') {
  window.gtag('event', 'page_view', {
    page_title: title,
    page_path: \`/\${route}\`,
    page_location: window.location.href,
  })
}`}
      </Code>

      <p>
        Reports show clean logical paths (<code>/seed-library</code>,{' '}
        <code>/audit</code>) rather than the literal hash URL.
      </p>

      <Note kind="warn">
        <p>
          React's <code>{`<StrictMode>`}</code> double-mounts effects in development, which
          doubles the dev <code>page_view</code> count. Production builds are unaffected.
        </p>
      </Note>
    </PageWrap>
  )
}

function AccessibilityDoc() {
  return (
    <PageWrap
      eyebrow="PATTERNS"
      title="Accessibility"
      lede="WCAG 2.1 AA. Self-audited. 11 findings resolved across two passes."
      path="patterns/accessibility"
    >
      <h2>Resolved findings</h2>
      <p>
        See <a href="/audit">/audit</a> for the full audit table. Highlights:
      </p>
      <ul>
        <li><strong>Page titles</strong> — every route updates <code>document.title</code> on navigation.</li>
        <li><strong>Skip link</strong> — first focusable element on every case study page.</li>
        <li><strong>Lightbox focus management</strong> — captures previous focus on open, traps Tab inside, restores on close.</li>
        <li><strong>Carousel announcements</strong> — slide counter has <code>aria-live="polite"</code> so screen readers narrate the change.</li>
        <li><strong>Use of color</strong> — disabled carousel arrows render <code>·</code> instead of <code>←</code>/<code>→</code>; reduced opacity is supplementary.</li>
        <li><strong>Dropdown trigger</strong> — Navbar dropdown is keyboard-operable with proper <code>aria-haspopup</code> / <code>aria-expanded</code>.</li>
      </ul>

      <h2>Patterns to follow</h2>
      <ul>
        <li>Every interactive element has a real <code>{`<button>`}</code> or <code>{`<a>`}</code>.</li>
        <li>Decorative icons get <code>aria-hidden="true"</code>; the button itself carries the label.</li>
        <li>State changes that aren't visually obvious go through an <code>aria-live</code> region.</li>
        <li>Color is never the only signal. Pair with shape, opacity, or text.</li>
      </ul>
    </PageWrap>
  )
}

/* ============================================================
   Data
   ============================================================ */

function CaseStudiesSchema() {
  return (
    <PageWrap
      eyebrow="DATA"
      title="CASE_STUDIES Schema"
      lede="The shape of every case study entry. Drives Home, the Navbar dropdown, and per-route SEO."
      path="data/case-studies"
    >
      <p>
        Defined in <code>src/data/caseStudies.js</code>. Exported as <code>CASE_STUDIES</code>.
        Each entry is consumed in three places: the Home grid (image + tags + subtitle),
        the Navbar case-study dropdown, and the per-route meta-tag updates (subtitle →
        description, heroImage → og:image).
      </p>

      <h2>Entry shape</h2>
      <PropsTable rows={[
        { name: 'id', type: 'string', required: true, desc: 'Hash route id. Must match the key in App.jsx ROUTES.' },
        { name: 'title', type: 'string', required: true, desc: 'Full case-study title.' },
        { name: 'eyebrow', type: 'string', required: true, desc: 'Short uppercase context (course, role).' },
        { name: 'subtitle', type: 'string', required: true, desc: 'One-paragraph summary. Reused as the meta description.' },
        { name: 'tags', type: 'string[]', required: true, desc: 'Small chips on the Home card (methodology, tools, semester).' },
        { name: 'award', type: 'string', default: '—', desc: 'Optional award badge displayed on the Home card.' },
        { name: 'heroImage', type: 'imported image', required: true, desc: 'Image module (import from ../assets). Used as the og:image and the Home card visual.' },
        { name: 'heroImageSize', type: 'string', default: '—', desc: 'Optional background-size override for the Home card.' },
        { name: 'heroImagePosition', type: 'string', default: '—', desc: 'Optional background-position override.' },
      ]} />

      <h2>Adding a case study</h2>
      <ol>
        <li>Import a hero image at the top of <code>caseStudies.js</code>.</li>
        <li>Add an entry to the <code>CASE_STUDIES</code> array.</li>
        <li>Create <code>src/pages/&lt;Title&gt;.jsx</code>.</li>
        <li>Register the route in <code>App.jsx</code>.</li>
      </ol>

      <Code lang="js" head="caseStudies.js">
{`import myHero from '../assets/my-case-hero.png'

export const CASE_STUDIES = [
  // …existing entries
  {
    id: 'my-case',
    title: 'My Case Study',
    eyebrow: 'Course · Role',
    subtitle: 'One paragraph summary.',
    tags: ['Tag A', 'Tag B'],
    heroImage: myHero,
  },
]`}
      </Code>
    </PageWrap>
  )
}

/* ============================================================
   Components
   ============================================================ */

const COMPONENT_DOCS = {
  navbar: {
    title: 'Navbar',
    file: 'src/components/Navbar.jsx',
    blurb:
      'Top-of-page chrome. Shown on every route. Renders the breadcrumb / site title, scroll progress bar, case-study dropdown, and external/social links.',
    props: [
      { name: 'onHome', type: '() => void', required: true, desc: 'Navigate back to the home route. Wired up by App.jsx.' },
      { name: 'slug', type: 'string', desc: 'Current route id (e.g. "seed-library"). Determines the breadcrumb label and dropdown current state.' },
      { name: 'label', type: 'string', desc: 'Optional sub-label appended after the slug. Rarely used.' },
      { name: 'crumbOverride', type: 'string', desc: 'Override the displayed breadcrumb text. Used by internal pages.' },
      { name: 'caseStudyMenu', type: 'boolean', default: 'false', desc: 'Force-show the case-study dropdown even when the slug is not a case study.' },
      { name: 'hideProgress', type: 'boolean', default: 'false', desc: 'Hide the scroll progress bar. Use on pages without scrollable content.' },
    ],
    usage: `<Navbar onHome={onHome} slug="seed-library" />

// Internal page with custom label, no progress bar:
<Navbar
  onHome={onHome}
  slug="audit"
  crumbOverride="Accessibility Audit"
  hideProgress
/>`,
    notes: (
      <>
        <p>
          The dropdown trigger is a real <code>{`<button>`}</code> with{' '}
          <code>aria-haspopup="menu"</code> and <code>aria-expanded</code>. Esc closes,
          outside-click closes, focus returns to the trigger.
        </p>
      </>
    ),
  },
  'progress-bar': {
    title: 'ProgressBar',
    file: 'src/components/ProgressBar.jsx',
    blurb:
      'Thin scroll-progress bar at the top of the page. Used internally by Navbar; not typically rendered directly.',
    props: [],
    usage: `// Rendered automatically by <Navbar />.
// Not intended for standalone use.`,
  },
  'table-of-contents': {
    title: 'TableOfContents',
    file: 'src/components/TableOfContents.jsx',
    blurb:
      'Sticky left-rail TOC for case studies. Highlights the currently visible section based on scroll position.',
    props: [
      { name: 'sections', type: 'Array<{ num, label, id }>', required: true, desc: 'List of sections. id must match an element id on the page (used by the scroll-spy IntersectionObserver).' },
    ],
    usage: `const SECTIONS = [
  { num: 1, label: 'The problem', id: 'sec-1' },
  { num: 2, label: 'Research approach', id: 'sec-2' },
  // …
]

<TableOfContents sections={SECTIONS} />`,
    notes: (
      <p>
        Uses <code>IntersectionObserver</code> internally. Sections are highlighted as
        they enter the viewport. The corresponding sidebar entry receives{' '}
        <code>aria-current="location"</code>.
      </p>
    ),
  },
  'case-study-hero': {
    title: 'CaseStudyHero',
    file: 'src/components/CaseStudyHero.jsx',
    blurb:
      'Top of each case study. Eyebrow + title + subtitle + meta panel + optional hero image with corner labels.',
    props: [
      { name: 'kicker', type: 'string', desc: 'Small uppercase eyebrow above the title.' },
      { name: 'title', type: 'string', required: true, desc: 'Main title.' },
      { name: 'titleEmphasis', type: 'string | ReactNode', desc: 'Trailing emphasised fragment of the title (rendered with accent color).' },
      { name: 'subtitle', type: 'string', desc: 'Lead paragraph below the title.' },
      { name: 'meta', type: 'Array<{ label, value }>', desc: 'Right-side meta rows (project, role, year, etc.).' },
      { name: 'corners', type: '{ topLeft?, topRight?, bottomLeft?, bottomRight? }', default: '{}', desc: 'Optional corner labels on the hero image frame.' },
      { name: 'heroImage', type: 'imported image', desc: 'Hero image source.' },
      { name: 'heroImageAlt', type: 'string', desc: 'Image alt text.' },
      { name: 'heroImageContain', type: 'boolean', desc: 'Use object-fit: contain instead of cover.' },
      { name: 'heroLabel', type: 'string', desc: 'Optional bottom label on the image (e.g. award).' },
    ],
    usage: `<CaseStudyHero
  kicker="BSI UX Capstone"
  title="University of Michigan Seed Library"
  subtitle="Redesigning a campus seed distribution system…"
  meta={META}
  heroImage={seedHero}
  heroImageAlt="UMSI Expo poster"
  heroLabel="UMSI Expo Pathway Award"
/>`,
  },
  'case-study-footer': {
    title: 'CaseStudyFooter',
    file: 'src/components/CaseStudyFooter.jsx',
    blurb:
      'Bottom of each case study. Shows previous/next case-study links derived from CASE_STUDIES order.',
    props: [
      { name: 'slug', type: 'string', required: true, desc: 'Current case-study id. Used to compute prev/next.' },
      { name: 'children', type: 'ReactNode', desc: 'Optional content rendered above the prev/next row (e.g. credits).' },
    ],
    usage: `<CaseStudyFooter slug="seed-library">
  <p>Credits, acknowledgements, etc.</p>
</CaseStudyFooter>`,
  },
  'section-label': {
    title: 'SectionLabel',
    file: 'src/components/SectionLabel.jsx',
    blurb:
      '"SEC. 04" eyebrow above each case-study section heading. Pairs with TableOfContents numbering.',
    props: [
      { name: 'num', type: 'number', required: true, desc: 'Section number.' },
      { name: 'children', type: 'ReactNode', desc: 'Label text rendered next to the number.' },
    ],
    usage: `<SectionLabel num={4}>Personas</SectionLabel>
<h2>Two personas, one decision tree.</h2>`,
  },
  'image-slot': {
    title: 'ImageSlot',
    file: 'src/components/ImageSlot.jsx',
    blurb:
      'Captioned figure with click-to-zoom. Accepts a single image, multiple images, raw SVG, or raw HTML.',
    props: [
      { name: 'id', type: 'string', desc: 'Optional anchor id for deep linking.' },
      { name: 'caption', type: 'ReactNode', desc: 'Figure caption.' },
      { name: 'label', type: 'string', desc: 'Optional small label above the figure (e.g. "FIG. 3.1").' },
      { name: 'src', type: 'string', desc: 'Single image source.' },
      { name: 'srcs', type: 'Array<{ src, alt }>', desc: 'Multiple images displayed side-by-side. Each is independently zoomable.' },
      { name: 'svg', type: 'string', desc: 'Raw SVG markup (dangerouslySetInnerHTML).' },
      { name: 'html', type: 'string', desc: 'Raw HTML markup.' },
      { name: 'alt', type: 'string', desc: 'Image alt text.' },
      { name: 'aspect', type: '"16x9" | "9x16" | "4x3" | "1x1"', default: '"16x9"', desc: 'Frame aspect ratio.' },
      { name: 'contain', type: 'boolean', desc: 'Use object-fit: contain instead of cover.' },
      { name: 'phone', type: 'boolean', desc: 'Shorthand: forces 9x16 aspect (phone screenshot).' },
      { name: 'children', type: 'ReactNode', desc: 'Fallback content when no src is provided.' },
    ],
    usage: `<ImageSlot
  label="FIG. 3.1 · Affinity diagram"
  caption="Round 1 clustering. 47 codes across 9 themes."
  src={affinityImg}
  alt="Affinity board, round 1"
  aspect="4x3"
/>`,
  },
  'image-grid': {
    title: 'ImageGrid',
    file: 'src/components/ImageGrid.jsx',
    blurb:
      'Simple N-column grid wrapper. Pass ImageSlot or other children inside.',
    props: [
      { name: 'columns', type: '2 | 3 | 4', default: '4', desc: 'Number of grid columns.' },
      { name: 'children', type: 'ReactNode', required: true, desc: 'Grid items.' },
    ],
    usage: `<ImageGrid columns={3}>
  <ImageSlot src={a} alt="…" />
  <ImageSlot src={b} alt="…" />
  <ImageSlot src={c} alt="…" />
</ImageGrid>`,
  },
  'grid-frames': {
    title: 'GridFrames',
    file: 'src/components/GridFrames.jsx',
    blurb:
      'Data-driven N-column grid. Each cell renders a labeled, captioned, zoomable frame. The grid wires the frames into a single Lightbox carousel.',
    props: [
      { name: 'items', type: 'Array<{ ix, name, src, alt, desc, contain }>', required: true, desc: 'Items. ix = index label (e.g. "3.1"). name = short name. desc = description below the label.' },
      { name: 'cols', type: '2 | 3 | 4', default: '4', desc: 'Number of columns.' },
      { name: 'aspect', type: '"9x16" | "16x9" | "4x3" | "1x1"', default: '"9x16"', desc: 'Frame aspect ratio.' },
    ],
    usage: `const PAGES = [
  { ix: '7.1', name: 'Plant Listing', src: imgPlantListing, alt: '…', desc: '…' },
  { ix: '7.2', name: 'Plant Detail', src: imgPlantDetail, alt: '…', desc: '…' },
  // …
]

<GridFrames items={PAGES} cols={4} aspect="9x16" />`,
    notes: (
      <p>
        Clicking any frame opens the Lightbox at that index. Prev/Next inside the
        Lightbox iterates through all frames in the grid.
      </p>
    ),
  },
  'scroll-figure': {
    title: 'ScrollFigure',
    file: 'src/components/ScrollFigure.jsx',
    blurb:
      'Long image that pages within a fixed frame. Useful for very tall research artifacts (user flows, journey maps).',
    props: [
      { name: 'id', type: 'string', desc: 'Optional anchor id.' },
      { name: 'caption', type: 'ReactNode', desc: 'Figure caption below the frame.' },
      { name: 'src', type: 'string', required: true, desc: 'Image source.' },
      { name: 'alt', type: 'string', required: true, desc: 'Alt text.' },
      { name: 'naturalAspect', type: 'string', desc: 'Native aspect ratio of the image (e.g. "9 / 32") for accurate page math.' },
      { name: 'pages', type: 'number', default: '2', desc: 'Number of pages to split the image into.' },
    ],
    usage: `<ScrollFigure
  id="user-flow"
  caption="FIG. 5.2 · End-to-end user flow"
  src={imgUserFlow}
  alt="User flow"
  pages={3}
/>`,
    notes: (
      <p>
        Pagination is keyboard-accessible (Tab to the controls, Enter to advance). The
        page indicator has <code>aria-live="polite"</code> so AT announces changes.
        Clicking the image opens it in the Lightbox.
      </p>
    ),
  },
  'video-section': {
    title: 'VideoSection',
    file: 'src/components/VideoSection.jsx',
    blurb:
      'Embedded video block. Supports MP4 + MOV sources, an optional CSS crop, and responsive height that caps at 50vh on large screens.',
    props: [
      { name: 'title', type: 'string', desc: 'Optional heading above the video.' },
      { name: 'description', type: 'string', desc: 'Optional caption below the heading.' },
      { name: 'mp4', type: 'string', desc: 'MP4 source URL.' },
      { name: 'mov', type: 'string', desc: 'Fallback MOV source URL.' },
      { name: 'maxWidth', type: 'string', default: '"360px"', desc: 'Max width of the video element.' },
      { name: 'cropPct', type: 'number', default: '0', desc: 'Symmetric CSS crop (0–0.5). Applies a transform scale to zoom past the visible frame edges.' },
      { name: 'aspectRatio', type: 'string', desc: 'CSS aspect-ratio for the crop frame (only used when cropPct > 0).' },
      { name: 'responsiveHeight', type: 'boolean', default: 'false', desc: 'Cap video height to 100vh on mobile / 50vh ≥1100px. Width auto-adjusts.' },
    ],
    usage: `<VideoSection
  description="Guided tour of the discovery, map, calendar, and create flows."
  mp4={\`\${import.meta.env.BASE_URL}the-diag-demo.mp4\`}
  maxWidth="100%"
  responsiveHeight
/>`,
    notes: (
      <p>
        All videos on the site are silent. <code>{`<track kind="captions">`}</code> is
        not currently required because there's no audio content (closed as N/A in the
        WCAG audit).
      </p>
    ),
  },
  lightbox: {
    title: 'Lightbox',
    file: 'src/components/Lightbox.jsx',
    blurb:
      'Full-screen image modal with two render modes. Single-image mode (pass src / svg / html) for one-shot zooms. Track mode (pass items[]) for carousels — renders every slide in a flex track and translates it on navigation, matching the in-page carousel transition.',
    props: [
      { name: 'items', type: 'Array<{ src, alt }>', desc: 'Track mode. When provided, every slide is rendered side-by-side and the track is translated based on index. Use for carousels so navigation animates smoothly instead of swapping images.' },
      { name: 'src', type: 'string', desc: 'Single-image mode. Mutually exclusive with svg / html / items.' },
      { name: 'svg', type: 'string', desc: 'Raw SVG markup (dangerouslySetInnerHTML). Single-image mode.' },
      { name: 'html', type: 'string', desc: 'Raw HTML markup. Single-image mode.' },
      { name: 'alt', type: 'string', desc: 'Alt text / fallback aria-label.' },
      { name: 'label', type: 'string', desc: 'Footer label and aria-label for the dialog.' },
      { name: 'isOpen', type: 'boolean', required: true, desc: 'Controlled state. Renders nothing when false.' },
      { name: 'onClose', type: '() => void', required: true, desc: 'Called on Esc, outside click, X button, or arrow click when there\'s no next.' },
      { name: 'onPrev', type: '() => void', desc: 'Called on left arrow / ArrowLeft / swipe-right.' },
      { name: 'onNext', type: '() => void', desc: 'Called on right arrow / image click / ArrowRight / swipe-left.' },
      { name: 'canPrev', type: 'boolean', default: 'true', desc: 'Disable the prev arrow without removing it (e.g. at the start of a finite series). Also gates swipe-right.' },
      { name: 'canNext', type: 'boolean', default: 'true', desc: 'Disable the next arrow. Also gates swipe-left.' },
      { name: 'index', type: 'number', desc: 'Current slide index. Required for track mode; optional for single-image mode (used by the mobile counter).' },
      { name: 'total', type: 'number', desc: 'Total slide count. Drives the mobile counter ("2 / 5"). Required to render the counter.' },
      { name: 'accent', type: '"good" | "info" | "warn"', desc: 'Color accent for arrows / close button.' },
    ],
    usage: `// Single-image:
const [open, setOpen] = useState(false)
return (
  <>
    <button onClick={() => setOpen(true)}>Zoom</button>
    <Lightbox
      src={src}
      alt="…"
      label="FIG. 3.1 · Affinity board"
      isOpen={open}
      onClose={() => setOpen(false)}
    />
  </>
)

// Carousel (track mode):
const [open, setOpen] = useState(false)
const [i, setI] = useState(0)
const total = boards.length
return (
  <Lightbox
    items={boards.map((b, ix) => ({ src: b.src, alt: b.label || \`Board \${ix + 1}\` }))}
    label="FIG. 4.1 · Affinity boards"
    isOpen={open}
    onClose={() => setOpen(false)}
    onPrev={() => setI((n) => Math.max(0, n - 1))}
    onNext={() => setI((n) => Math.min(total - 1, n + 1))}
    canPrev={i > 0}
    canNext={i < total - 1}
    index={i}
    total={total}
  />
)`,
    notes: (
      <>
        <p>
          <strong>Track mode.</strong> Every slide is rendered up front so the browser
          can use its image cache (which is already warm from the in-page carousel that
          triggered the lightbox). Navigation is a pure CSS transform — no fetch, no
          paint gap, no abrupt swap. Matches the in-page carousel transition exactly.
        </p>
        <p>
          <strong>Tall images.</strong> Each slide's aspect ratio is captured on{' '}
          <code>onLoad</code>. When naturalHeight / naturalWidth &gt; 1.6, that slide
          gets <code>.is-tall-slide</code>. The behavior of that class is{' '}
          <em>viewport-conditional</em>:
        </p>
        <ul>
          <li>
            <strong>Desktop</strong> (above 720px wide, non-landscape-phone): the class
            has no effect. Images use the default <code>object-fit: contain</code> and
            fill the lightbox on their longest dimension — landscape fills width,
            portrait fills height.
          </li>
          <li>
            <strong>Mobile</strong> (under 720px, or landscape phones under 540px tall):
            the tall slide is set to <code>width: 100vw</code> with{' '}
            <code>overflow-y: auto</code>, so phone-screenshot-aspect images stay
            readable and scrollable inside the slide. Per-slide, not global, so a
            portrait slide next to a landscape slide both render correctly.
          </li>
        </ul>
        <p>
          <strong>Touch.</strong> Horizontal swipe (≥50px and dominating vertical movement
          by 1.5×) triggers <code>onPrev</code> / <code>onNext</code> with respect for{' '}
          <code>canPrev</code> / <code>canNext</code>. Vertical swipe scrolls the
          underlying tall slide if applicable.
        </p>
        <p>
          <strong>Mobile.</strong> Under 720px wide, or landscape phones under 540px
          tall, the lightbox goes full-bleed: no card chrome, no caption, floating
          close/arrows/counter. Track-mode transitions still play.
        </p>
        <p>
          <strong>Focus management.</strong> On open: captures{' '}
          <code>document.activeElement</code>, focuses the close button on the next
          animation frame, traps Tab/Shift+Tab inside the dialog. On close: restores the
          captured focus.
        </p>
      </>
    ),
  },
  'board-carousel': {
    title: 'BoardCarousel',
    file: 'src/components/BoardCarousel.jsx',
    blurb:
      'Carousel of board-shaped images with prev/next arrows. Used for affinity diagrams, research artifacts, and similar landscape content.',
    props: [
      { name: 'id', type: 'string', desc: 'Optional anchor id.' },
      { name: 'caption', type: 'ReactNode', desc: 'Caption below the carousel.' },
      { name: 'boards', type: 'Array<{ src, label }>', required: true, desc: 'Boards to display. label appears under the carousel.' },
      { name: 'aspect', type: '"16x9" | "9x16" | "4x3" | "1x1"', default: '"16x9"', desc: 'Frame aspect ratio.' },
      { name: 'contain', type: 'boolean', default: 'true', desc: 'object-fit: contain. Set false for cover.' },
    ],
    usage: `<BoardCarousel
  id="affinity"
  caption="FIG. 4.1 · Affinity boards (15 themes)"
  boards={AFFINITY_BOARDS}
  aspect="16x9"
/>`,
    notes: (
      <p>
        Disabled arrows render <code>·</code> instead of <code>←</code>/<code>→</code>{' '}
        to convey disabled state without relying on color. The slide counter has{' '}
        <code>aria-live="polite"</code>.
      </p>
    ),
  },
  'phone-carousel': {
    title: 'PhoneCarousel',
    file: 'src/components/PhoneCarousel.jsx',
    blurb:
      'Carousel for mobile screen mockups. Renders a phone-shaped frame around the active screen.',
    props: [
      { name: 'screens', type: 'Array<{ src, alt, label }>', required: true, desc: 'Phone screens.' },
    ],
    usage: `<PhoneCarousel screens={SCREENS} />`,
  },
  'research-carousel': {
    title: 'ResearchCarousel',
    file: 'src/components/ResearchCarousel.jsx',
    blurb:
      'Free-form research slide carousel. Each slide can be an image or a custom node.',
    props: [
      { name: 'slides', type: 'Array<{ src, alt, label, node }>', required: true, desc: 'Slides. If node is provided it replaces the image.' },
      { name: 'lightbox', type: 'boolean', default: 'true', desc: 'Enable Lightbox zoom on image slides.' },
    ],
    usage: `<ResearchCarousel slides={SLIDES} />`,
  },
  'demo-rail': {
    title: 'DemoRail',
    file: 'src/components/DemoRail.jsx',
    blurb:
      'Two-column layout: PhoneCarousel on one side, prose on the other. For walking through a flow alongside commentary.',
    props: [
      { name: 'screens', type: 'Array<{ src, alt, label }>', required: true, desc: 'Phone screens passed through to PhoneCarousel.' },
    ],
    usage: `<DemoRail screens={CREATE_FLOW_SCREENS}>
  <h3>Create event flow</h3>
  <p>…</p>
</DemoRail>`,
  },
  'before-after-pair': {
    title: 'BeforeAfterPair',
    file: 'src/components/BeforeAfterPair.jsx',
    blurb:
      'Side-by-side before/after comparison with annotations. After can render multiple images.',
    props: [
      { name: 'before', type: '{ label, tag, src, alt, annotations[] }', required: true, desc: 'Before-state object.' },
      { name: 'after', type: '{ label, tag, src or srcs[], alt, annotations[] }', required: true, desc: 'After-state object. srcs is an array of { src, alt } for multi-image after.' },
      { name: 'aspect', type: '"9x16" | "16x9" | "4x3" | "1x1"', default: '"9x16"', desc: 'Frame aspect ratio for both sides.' },
    ],
    usage: `<BeforeAfterPair
  aspect="4x3"
  before={{
    label: 'FIG. 8.1 · V1 system',
    tag: '4.32% completion',
    src: imgV1,
    alt: 'Original setup',
    annotations: ['Two machines required.', 'Loose seeds transfer.'],
  }}
  after={{
    label: 'FIG. 8.2 · V2 system',
    tag: 'design for ship',
    srcs: [{ src: imgV2, alt: '…' }, { src: imgV2Instructions, alt: '…' }],
    annotations: ['Envelope dispenser eliminated.', 'Color-coded.'],
  }}
/>`,
  },
  callout: {
    title: 'Callout',
    file: 'src/components/Callout.jsx',
    blurb:
      'Boxed callout for a notable finding. Optional label, stat, and title above the body.',
    props: [
      { name: 'label', type: 'string', desc: 'Small uppercase label.' },
      { name: 'stat', type: 'string', desc: 'Big number / percentage (rendered in serif).' },
      { name: 'title', type: 'string', desc: 'Title row.' },
      { name: 'tone', type: '"warn" | "good" | "info"', default: '"warn"', desc: 'Accent color.' },
      { name: 'children', type: 'ReactNode', desc: 'Body content.' },
    ],
    usage: `<Callout
  label="Key finding"
  stat="4.32%"
  title="Field flow completion baseline"
>
  <p>Pre-redesign, only 4.32% of users completed the seed-acquisition flow…</p>
</Callout>`,
  },
  'decision-card': {
    title: 'DecisionCard',
    file: 'src/components/DecisionCard.jsx',
    blurb:
      'Numbered design decision card. Title + rationale + body. Used to surface the "why" behind each decision in the design section.',
    props: [
      { name: 'number', type: 'number', required: true, desc: 'Decision number (1, 2, 3…).' },
      { name: 'title', type: 'string', required: true, desc: 'Short decision statement.' },
      { name: 'rationale', type: 'string', required: true, desc: 'One-sentence "why" — appears in a callout under the title.' },
      { name: 'children', type: 'ReactNode', desc: 'Body content with detail.' },
    ],
    usage: `<DecisionCard
  number={1}
  title="Color-coded capsules with paper-slip confirmation"
  rationale="A single identification method is a single point of failure…"
>
  <p>The redesign mapped each capsule color to one plant…</p>
</DecisionCard>`,
  },
  'finding-block': {
    title: 'FindingBlock',
    file: 'src/components/FindingBlock.jsx',
    blurb:
      'Bordered block with a small label and a body. Lighter weight than Callout; for surfacing observations inline with prose.',
    props: [
      { name: 'label', type: 'string', required: true, desc: 'Small label at the top of the block.' },
      { name: 'children', type: 'ReactNode', desc: 'Body content.' },
    ],
    usage: `<FindingBlock label="Observation">
  <p>Every participant succeeded at obtaining a capsule and failed at the next step…</p>
</FindingBlock>`,
  },
  'pull-quote': {
    title: 'PullQuote',
    file: 'src/components/PullQuote.jsx',
    blurb:
      'Stylized blockquote for participant quotes and similar emphasis. Optional attribution, context, and reference.',
    props: [
      { name: 'id', type: 'string', desc: 'Optional anchor id.' },
      { name: 'who', type: 'string', desc: 'Attribution (name / participant id).' },
      { name: 'context', type: 'string', desc: 'Context line below the attribution.' },
      { name: 'ref', type: 'string', desc: 'Reference (e.g. session id).' },
      { name: 'cite', type: 'string', desc: 'Citation URL passed to the underlying <blockquote cite="…">.' },
      { name: 'children', type: 'ReactNode', required: true, desc: 'Quote body.' },
    ],
    usage: `<PullQuote who="P3" context="Field study, Shapiro Library" ref="S3-0:42">
  I had no idea this even existed.
</PullQuote>`,
  },
  'stat-row': {
    title: 'StatRow',
    file: 'src/components/StatRow.jsx',
    blurb:
      'Row of large statistics. Each stat has a label, value, optional delta, and tone.',
    props: [
      { name: 'stats', type: 'Array<{ label, value, delta, tone }>', required: true, desc: 'Stat objects. tone is "warn" | "good" | "info".' },
    ],
    usage: `<StatRow stats={[
  { label: 'Field flow completion', value: '4.3%', delta: 'pre-redesign baseline', tone: 'warn' },
  { label: 'Awareness gap', value: '85%', delta: 'never heard of it', tone: 'warn' },
  { label: 'Seed identification', value: '0 / 7', delta: 'pre-design usability', tone: 'warn' },
]} />`,
    notes: (
      <p>
        Two-stat rows render side by side; three-stat rows render three-up. More
        than three wraps to the next row.
      </p>
    ),
  },
  'contrib-grid': {
    title: 'ContribGrid',
    file: 'src/components/ContribGrid.jsx',
    blurb:
      'Grid showing contributors with name + role. Used in case-study footers and team credits.',
    props: [
      { name: 'items', type: 'Array<{ name, role }>', required: true, desc: 'Contributors.' },
    ],
    usage: `<ContribGrid items={[
  { name: 'Anthony Shephard', role: 'Researcher · Liaison' },
  { name: 'Teammate', role: 'Designer' },
  // …
]} />`,
  },
}

function ComponentDoc({ data, path }) {
  return (
    <article>
      <p className="docs-eyebrow">COMPONENT · <code>{data.file}</code></p>
      <h1>{data.title}</h1>
      <p className="docs-lede">{data.blurb}</p>

      {data.props && data.props.length > 0 && (
        <>
          <h2>Props</h2>
          <PropsTable rows={data.props} />
        </>
      )}

      <h2>Usage</h2>
      <Code lang="jsx" head="Example">{data.usage}</Code>

      {data.notes && (
        <>
          <h2>Notes</h2>
          {data.notes}
        </>
      )}

      <Pager path={path} />
    </article>
  )
}

function ComponentsIndex() {
  return (
    <PageWrap
      eyebrow="COMPONENTS"
      title="Components Overview"
      lede="Every reusable component in src/components/. Grouped by purpose. Pick a component from the sidebar for props and usage."
      path="components"
    >
      <h2>Layout & navigation</h2>
      <ul>
        <li><a href="/docs/components/navbar">Navbar</a> — top-of-page chrome with breadcrumb, progress bar, dropdown, links.</li>
        <li><a href="/docs/components/progress-bar">ProgressBar</a> — internal scroll progress.</li>
        <li><a href="/docs/components/table-of-contents">TableOfContents</a> — sticky left rail with scroll-spy.</li>
        <li><a href="/docs/components/case-study-hero">CaseStudyHero</a> — top of every case study.</li>
        <li><a href="/docs/components/case-study-footer">CaseStudyFooter</a> — bottom of every case study (prev/next).</li>
        <li><a href="/docs/components/section-label">SectionLabel</a> — "SEC. 04" eyebrow.</li>
      </ul>

      <h2>Content & media</h2>
      <ul>
        <li><a href="/docs/components/image-slot">ImageSlot</a> — captioned figure with click-to-zoom.</li>
        <li><a href="/docs/components/image-grid">ImageGrid</a> — N-column grid wrapper.</li>
        <li><a href="/docs/components/grid-frames">GridFrames</a> — data-driven labeled grid.</li>
        <li><a href="/docs/components/scroll-figure">ScrollFigure</a> — paged scroll of tall images.</li>
        <li><a href="/docs/components/video-section">VideoSection</a> — embedded video with crop + responsive sizing.</li>
        <li><a href="/docs/components/lightbox">Lightbox</a> — full-screen image modal.</li>
      </ul>

      <h2>Carousels</h2>
      <ul>
        <li><a href="/docs/components/board-carousel">BoardCarousel</a> — landscape boards / artifacts.</li>
        <li><a href="/docs/components/phone-carousel">PhoneCarousel</a> — phone-shaped frame for mobile screens.</li>
        <li><a href="/docs/components/research-carousel">ResearchCarousel</a> — free-form slides.</li>
        <li><a href="/docs/components/demo-rail">DemoRail</a> — PhoneCarousel + prose layout.</li>
      </ul>

      <h2>Comparisons & highlights</h2>
      <ul>
        <li><a href="/docs/components/before-after-pair">BeforeAfterPair</a> — annotated before/after comparison.</li>
        <li><a href="/docs/components/callout">Callout</a> — highlighted finding block.</li>
        <li><a href="/docs/components/decision-card">DecisionCard</a> — numbered design decision.</li>
        <li><a href="/docs/components/finding-block">FindingBlock</a> — inline observation block.</li>
        <li><a href="/docs/components/pull-quote">PullQuote</a> — participant quote with attribution.</li>
        <li><a href="/docs/components/stat-row">StatRow</a> — large statistics row.</li>
        <li><a href="/docs/components/contrib-grid">ContribGrid</a> — team / contributor grid.</li>
      </ul>
    </PageWrap>
  )
}

function NotFound({ subPath }) {
  return (
    <article>
      <p className="docs-eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="docs-lede">
        <code>{subPath ? `/docs/${subPath}` : '/docs'}</code> doesn't match any docs
        page. Use the sidebar.
      </p>
    </article>
  )
}

/* ============================================================
   Pages map
   ============================================================ */

const PAGES = {
  '': Overview,
  'getting-started': GettingStarted,
  'project-structure': ProjectStructure,
  'routing': Routing,
  'build-deploy': BuildDeploy,
  'design/colors': ColorsDoc,
  'design/typography': TypographyDoc,
  'design/layout': LayoutDoc,
  'patterns/seo-meta': SeoMeta,
  'patterns/analytics': AnalyticsDoc,
  'patterns/accessibility': AccessibilityDoc,
  'data/case-studies': CaseStudiesSchema,
  'components': ComponentsIndex,
}

// Register all component docs under components/<key>
Object.entries(COMPONENT_DOCS).forEach(([key, data]) => {
  const path = `components/${key}`
  PAGES[path] = () => <ComponentDoc data={data} path={path} />
})

/* ============================================================
   Sidebar
   ============================================================ */

function Sidebar({ subPath }) {
  return (
    <aside className="docs-sidebar" aria-label="Documentation navigation">
      {DOCS_NAV.map((section) => (
        <div className="docs-sidebar-section" key={section.section}>
          <h3>{section.section}</h3>
          <ul className="docs-sidebar-list">
            {section.items.map((item) => {
              const href = `/docs${item.path ? '/' + item.path : ''}`
              const isCurrent = item.path === subPath
              return (
                <li key={item.path}>
                  <a href={href} aria-current={isCurrent ? 'page' : undefined}>
                    {item.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </aside>
  )
}

/* ============================================================
   Main Docs component
   ============================================================ */

function deriveSubPath(route) {
  if (!route || route === 'docs') return ''
  if (route.startsWith('docs/')) return route.slice('docs/'.length)
  return ''
}

export default function Docs({ onHome, route }) {
  const subPath = deriveSubPath(route)

  // Scroll to top of content on sub-route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [subPath])

  const Page = PAGES[subPath]
  const page = findDocsPage(subPath)
  const subLabel = page && page.path !== '' ? page.title : undefined

  return (
    <div className="docs-page">
      <a href="#docs-main" className="skip-link">Skip to content</a>
      <Navbar
        onHome={onHome}
        slug="docs"
        crumbOverride="Docs"
        label={subLabel}
        hideProgress
      />
      <div className="docs-layout">
        <Sidebar subPath={subPath} />
        <main id="docs-main" className="docs-content">
          {Page ? <Page /> : <NotFound subPath={subPath} />}
        </main>
      </div>
    </div>
  )
}
