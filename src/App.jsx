// App.jsx is the heart of the SPA. It does five jobs:
//
//   1. Maps URL paths to React page components (the ROUTES table)
//   2. Implements history-API routing in ~30 lines (no router library)
//   3. Intercepts internal anchor clicks so navigation is a pushState
//      instead of a full page reload, while preserving every browser
//      convention (middle-click, cmd-click, target=_blank, etc.)
//   4. Keeps document.title, meta tags, and Open Graph synced per route
//   5. Fires GA4 page_view events on every navigation
//
// Everything else (page chrome, layout) lives in the page components.

import { useState, useEffect } from 'react'

// CSS is imported here at the app shell so every page on every route has
// access to the global tokens, layout grid, and component styles. Order
// matters: variables.css → global.css → layout.css → components.css →
// page-specific stylesheets. Later imports can override earlier ones.
import './css/global.css'
import './css/layout.css'
import './css/components.css'
import './css/index.css'
import './css/about.css'
import './css/resume.css'
import './css/audit.css'
import './css/docs.css'
import './css/blog.css'

import Home from './pages/Home'
import TheDiag from './pages/TheDiag'
import Mintify from './pages/Mintify'
import Roamio from './pages/Roamio'
import SeedLibrary from './pages/SeedLibrary'
import CourtsAudit from './pages/CourtsAudit'
import LayoutDemo from './pages/LayoutDemo'
import About from './pages/About'
import Resume from './pages/Resume'
import AccessibilityAudit from './pages/AccessibilityAudit'
import Todo from './pages/Todo'
import Docs from './pages/Docs'
import Blog from './pages/Blog'
import BlogEditor from './pages/BlogEditor'
// A private, unlisted page (shared by link only). Registered as a route and
// marked noindex below, but deliberately kept out of sitemap.xml and
// robots.txt so the URL isn't advertised.
import PowerpointForDanna from './pages/PowerpointForDanna'
import { CASE_STUDIES } from './data/caseStudies'
import { findDocsPage } from './data/docsNav'
import { findPost } from './data/blog'
// The Seed Library expo poster doubles as the default Open Graph share image
// for any route that isn't a case study (the case study hero replaces it).
import seedHero from './assets/seed-expo-poster.png'

// The full route table. Keys are URL path segments (no leading slash); values
// are the page components. Adding a new route is exactly four steps:
//   1. Create src/pages/MyPage.jsx
//   2. Import it above
//   3. Add an entry here
//   4. Add a title to STATIC_TITLES and a description to PAGE_DESCRIPTIONS
const ROUTES = {
  '': Home,
  'the-diag': TheDiag,
  'mintify': Mintify,
  'roamio': Roamio,
  'seed-library': SeedLibrary,
  'courts-audit': CourtsAudit,
  'layout-demo': LayoutDemo,
  'about': About,
  'resume': Resume,
  'audit': AccessibilityAudit,
  'todo': Todo,
  'docs': Docs,
  'blog': Blog,
  'blog-editor': BlogEditor,
  'powerpoint_for_danna': PowerpointForDanna,
}

// Reads the URL path and normalizes it into a route key. Strips leading and
// trailing slashes so '/seed-library' → 'seed-library' and '/' → '' (home).
// Sub-paths like 'docs/components/lightbox' are preserved as-is; the lookup
// below falls back to the first segment if the full path isn't registered.
function getRoute() {
  return window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '')
}

// Backward compatibility for the period when this app used hash routing.
// If a visitor arrives with a URL like example.com/#/seed-library (an old
// bookmark or a shared link from before the migration), this rewrites the
// URL in place using history.replaceState so the SPA can route normally
// from window.location.pathname. replaceState (not pushState) means there's
// no extra history entry to break the browser back button.
function migrateLegacyHash() {
  if (typeof window === 'undefined') return null
  const h = window.location.hash
  if (h.startsWith('#/')) {
    const path = h.replace(/^#\/?/, '')
    const target = '/' + path + window.location.search
    window.history.replaceState(null, '', target)
    return path
  }
  return null
}

const SITE_NAME = "Anthony Shephard's Portfolio"
const DEFAULT_DESCRIPTION = "Five case studies in product design, project management, and UX research and design by Anthony Shephard. Real clients, tests, insights, and the rebuilds that followed."

// Static page titles. Case studies aren't listed here, they get their
// titles from CASE_STUDIES.title inside titleForRoute. Sub-paths under docs
// also fall through to docs-specific handling.
const STATIC_TITLES = {
  '': SITE_NAME,
  resume: 'Resume',
  about: 'About',
  audit: 'Accessibility Audit',
  todo: 'Todo',
  'layout-demo': 'Layout Demo',
  docs: 'Docs',
  blog: 'Blog',
  'blog-editor': 'Blog editor',
  powerpoint_for_danna: 'For Danna',
}

// Per-route meta descriptions. Used for <meta name="description">,
// og:description, and twitter:description. Case studies inherit from
// CASE_STUDIES.subtitle so we don't duplicate copy.
const PAGE_DESCRIPTIONS = {
  '': DEFAULT_DESCRIPTION,
  resume: "Anthony Shephard's resume. Bachelor of Science in Information (User Experience Design) at the University of Michigan. PM, UX, research, and design.",
  about: "Anthony Shephard off the clock. Origins, current obsessions, a few opinions worth defending, and the tools I work with daily.",
  audit: "Internal accessibility audit of this portfolio site. WCAG 2.1 AA, self-review.",
  todo: "Internal open todos: content, accessibility, performance, engineering.",
  'layout-demo': "Internal layout demo for the symmetric content-column system.",
  docs: "Documentation for this portfolio repository. Architecture, design system, patterns, and every reusable component.",
  blog: "Short notes from Anthony Shephard. Building, reading, cooking, and the occasional opinion.",
  'blog-editor': "Internal dev-only blog editor.",
  powerpoint_for_danna: "A short proposal. Six slides. One ask.",
}

// Routes in this set get a noindex/nofollow robots meta tag. Most are also
// listed as Disallow entries in public/robots.txt. They're reachable by URL
// (useful for sharing with reviewers) but excluded from search indexing.
// Exception: 'powerpoint_for_danna' is noindex here but intentionally NOT in
// robots.txt or sitemap.xml — it's a private share-by-link page, and listing
// the path in robots.txt would only advertise it.
const INTERNAL_ROUTES = new Set(['audit', 'todo', 'layout-demo', 'blog-editor', 'powerpoint_for_danna'])

// Builds the browser tab title for a given route. Sub-paths under /docs
// (e.g. 'docs/components/lightbox') are unpacked here so each sub-page
// gets a meaningful title like "Lightbox · Docs · Anthony Shephard's Portfolio".
function titleForRoute(routeKey) {
  if (routeKey === 'docs' || routeKey.startsWith('docs/')) {
    const subPath = routeKey === 'docs' ? '' : routeKey.slice('docs/'.length)
    const page = findDocsPage(subPath)
    const docsTitle = page ? `${page.title} · Docs` : 'Docs'
    return `${docsTitle} · ${SITE_NAME}`
  }
  // Blog sub-paths: '/blog/welcome' becomes "Welcome to the blog · Blog · ...".
  if (routeKey.startsWith('blog/')) {
    const slug = routeKey.slice('blog/'.length)
    const post = findPost(slug)
    const blogTitle = post ? `${post.title} · Blog` : 'Blog'
    return `${blogTitle} · ${SITE_NAME}`
  }
  if (routeKey in STATIC_TITLES) {
    const v = STATIC_TITLES[routeKey]
    return v === SITE_NAME ? v : `${v} · ${SITE_NAME}`
  }
  // If it's not in STATIC_TITLES, check CASE_STUDIES; case study pages
  // use their own title from the data file.
  const cs = CASE_STUDIES.find((c) => c.id === routeKey)
  return cs ? `${cs.title} · ${SITE_NAME}` : SITE_NAME
}

// Aggregates everything the meta-tag useEffect needs in one object. Fallback
// order for description: case study subtitle → exact-path description →
// route-root description (so 'docs/anything' inherits the docs description) →
// site default. Same for noindex: sub-paths inherit from their parent.
function metaForRoute(routeKey) {
  const cs = CASE_STUDIES.find((c) => c.id === routeKey)
  const routeRoot = routeKey.split('/')[0]
  // Blog post lookup: when the route is 'blog/<slug>', pull the post and
  // use its excerpt as the description, its title in the meta tags, and
  // its hero image as the og:image when one is set.
  const post = routeKey.startsWith('blog/')
    ? findPost(routeKey.slice('blog/'.length))
    : null
  return {
    title: titleForRoute(routeKey),
    description:
      post?.excerpt ||
      cs?.subtitle ||
      PAGE_DESCRIPTIONS[routeKey] ||
      PAGE_DESCRIPTIONS[routeRoot] ||
      DEFAULT_DESCRIPTION,
    image: post?.heroImage || cs?.heroImage || seedHero,
    noindex: INTERNAL_ROUTES.has(routeKey) || INTERNAL_ROUTES.has(routeRoot),
  }
}

// Imperatively sets a meta tag in <head>. Creates the tag if it doesn't
// exist yet (first navigation), reuses it on subsequent navigations.
// `attr` is either 'name' (standard meta) or 'property' (Open Graph).
// The two namespaces use different attribute names in HTML.
function setMeta(key, value, attr = 'name') {
  if (value == null || value === '') return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', value)
}

// Converts a path or full URL into an absolute URL. Open Graph image
// crawlers (Facebook, LinkedIn, iMessage) require absolute URLs for og:image.
// Passes through anything that already starts with http(s).
function absoluteUrl(path) {
  if (!path) return path
  if (/^https?:\/\//.test(path)) return path
  const sep = path.startsWith('/') ? '' : '/'
  return `${window.location.origin}${sep}${path}`
}

export default function App() {
  // useState's lazy initializer (the arrow function form) runs only on the
  // first render. On the very first mount we check for a legacy hash URL
  // and rewrite it to a clean path before reading the route. Without the
  // lazy form, this would run on every render and re-trigger the migration.
  const [route, setRoute] = useState(() => {
    const migrated = migrateLegacyHash()
    return migrated !== null ? migrated : getRoute()
  })

  // popstate fires when the user uses the browser back/forward buttons.
  // It does NOT fire for our own pushState calls in the click handler.
  // We update React state directly there. The empty dep array means we
  // register the listener once and tear it down on unmount.
  useEffect(() => {
    const onPop = () => {
      setRoute(getRoute())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // SPA navigation via global click interception. The single delegated
  // listener on document is preferred over wrapping every <a> in a custom
  // Link component because plain <a href> elements already give us native
  // semantics (middle-click, right-click "open in new tab", focus styles,
  // copy link address). We only override the default for a narrow case:
  // plain left-clicks on same-origin links that aren't opting out via
  // target or download. Anything else falls through to the browser.
  useEffect(() => {
    const onClick = (e) => {
      // Anything other than primary left mouse button: skip.
      if (e.button !== 0) return
      // Modifier keys mean the user wants the browser default (new tab,
      // new window, save target, etc.), so don't intercept.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      // Something else already handled this event (e.g. a button inside
      // a link). Don't double-handle.
      if (e.defaultPrevented) return
      // .closest() walks up the DOM tree to find the nearest <a> ancestor,
      // so clicks on <span>s or <img>s inside a link still navigate.
      const a = e.target.closest('a')
      if (!a) return
      // target="_blank" or any framed target: respect the author's intent.
      if (a.target && a.target !== '' && a.target !== '_self') return
      // download attribute means the browser handles it as a file download.
      if (a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href) return
      // External (http://, https://), protocols (mailto:, tel:), or in-page
      // anchors (#section): let the browser handle natively.
      if (/^([a-z]+:|\/\/|#)/i.test(href)) return
      // Cross-origin same-window navigation: not our SPA's concern.
      if (a.origin !== window.location.origin) return

      // Past all the bailouts. This is a same-origin SPA navigation.
      e.preventDefault()
      const target = a.pathname + a.search + a.hash
      // Clicking the link to the current page is a no-op; don't push a
      // duplicate history entry.
      if (target === window.location.pathname + window.location.search + window.location.hash) return
      // Give any interested component a chance to veto the navigation.
      // The blog editor uses this to prompt for confirmation when the
      // form has unsaved changes. The event is cancelable; calling
      // preventDefault() on it aborts the navigation entirely.
      const navEv = new CustomEvent('spa-nav-attempt', { cancelable: true })
      window.dispatchEvent(navEv)
      if (navEv.defaultPrevented) return
      window.history.pushState(null, '', target)
      setRoute(getRoute())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // This effect is the canonical place where per-route side effects happen.
  // It runs on every route change because of the [route] dep array, so:
  //   - document.title updates so the browser tab name follows navigation
  //   - meta tags update for SEO, link previews, robots directive
  //   - GA4 receives a page_view event with the new path
  // Note: in dev mode <StrictMode> double-mounts effects, so you'll see
  // two page_view events per navigation in dev. Production runs once.
  useEffect(() => {
    const { title, description, image, noindex } = metaForRoute(route)
    const imageUrl = absoluteUrl(image)

    document.title = title

    setMeta('description', description, 'name')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:image', imageUrl, 'property')
    setMeta('og:url', window.location.href, 'property')
    setMeta('twitter:title', title, 'name')
    setMeta('twitter:description', description, 'name')
    setMeta('twitter:image', imageUrl, 'name')
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow', 'name')

    // window.gtag is the global function injected by the Google Analytics
    // gtag.js script tag in index.html. The script is async, so it might
    // not be loaded yet on the very first render. The typeof guard avoids
    // a ReferenceError in that case. The script also might be blocked by
    // an ad blocker; same guard handles that.
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_path: `/${route}`,
        page_location: window.location.href,
      })
    }
  }, [route])

  // Pages call this onHome prop when they need to navigate back to the home
  // page programmatically (e.g. the navbar logo). It's passed as a prop
  // because the pages live inside <Page /> below and would otherwise have
  // to read window.history themselves. Passing a function down is cleaner.
  // The early return avoids pushing a duplicate history entry when already
  // on the home page.
  function goHome() {
    if (window.location.pathname === '/') return
    window.history.pushState(null, '', '/')
    setRoute('')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // Two-step route resolution: try the exact path first, then fall back to
  // the first segment. This is what makes Docs.jsx work as a sub-router.
  // Any path starting with 'docs/' resolves to the Docs page, which then
  // reads its own sub-path internally. Final fallback is Home, so an
  // unknown route quietly displays the home page instead of throwing.
  const Page = ROUTES[route] ?? ROUTES[route.split('/')[0]] ?? Home

  // Preload every case study hero image, no matter which route is active.
  // The hidden, zero-size <img> tags below trigger the browser to fetch
  // and decode each image off-screen so the first visit to any case study
  // already has its hero in memory. This trades a small upfront network
  // cost for a much snappier perceived load when the user opens a case study.
  const heroPreloads = CASE_STUDIES.filter((c) => c.heroImage)

  return (
    <>
      {/* Home gets called without the onHome / route props because it's
          the root destination. It doesn't need to navigate home, and its
          children don't need to know the route. Every other page receives
          both: onHome for the navbar logo's click, and route for components
          like Docs that need to derive their sub-path from it. */}
      {Page === Home ? (
        <Home />
      ) : (
        <Page onHome={goHome} route={route} />
      )}
      {/* The hero preloader. aria-hidden plus zero dimensions plus
          pointer-events:none means the images are invisible, untabbable,
          and undiscoverable to assistive tech. loading="eager" overrides
          any browser default of lazy-loading so the preload actually
          happens immediately. decoding="async" tells the browser it can
          decode these in a background thread without blocking layout. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {heroPreloads.map((c) => (
          <img
            key={c.id}
            src={c.heroImage}
            alt=""
            loading="eager"
            decoding="async"
          />
        ))}
      </div>
    </>
  )
}
