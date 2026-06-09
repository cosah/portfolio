import { useState, useEffect } from 'react'
import './css/global.css'
import './css/layout.css'
import './css/components.css'
import './css/index.css'
import './css/about.css'
import './css/resume.css'
import './css/audit.css'
import './css/docs.css'

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
import { CASE_STUDIES } from './data/caseStudies'
import { findDocsPage } from './data/docsNav'
import seedHero from './assets/seed-expo-poster.png'

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
}

function getRoute() {
  return window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '')
}

// One-time migration: anyone arriving with an old #/ hash link gets redirected
// to the clean path so bookmarks / shared links from the old hash era keep working.
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

const STATIC_TITLES = {
  '': SITE_NAME,
  resume: 'Resume',
  about: 'About',
  audit: 'Accessibility Audit',
  todo: 'Todo',
  'layout-demo': 'Layout Demo',
  docs: 'Docs',
}

const PAGE_DESCRIPTIONS = {
  '': DEFAULT_DESCRIPTION,
  resume: "Anthony Shephard's resume. Bachelor of Science in Information (User Experience Design) at the University of Michigan. PM, UX, research, and design.",
  about: "About Anthony Shephard. Off-the-clock dossier and what I'm into right now.",
  audit: "Internal accessibility audit of this portfolio site. WCAG 2.1 AA, self-review.",
  todo: "Internal open todos: content, accessibility, performance, engineering.",
  'layout-demo': "Internal layout demo for the symmetric content-column system.",
  docs: "Documentation for this portfolio repository — architecture, design system, patterns, and every reusable component.",
}

const INTERNAL_ROUTES = new Set(['audit', 'todo', 'layout-demo'])

function titleForRoute(routeKey) {
  if (routeKey === 'docs' || routeKey.startsWith('docs/')) {
    const subPath = routeKey === 'docs' ? '' : routeKey.slice('docs/'.length)
    const page = findDocsPage(subPath)
    const docsTitle = page ? `${page.title} · Docs` : 'Docs'
    return `${docsTitle} · ${SITE_NAME}`
  }
  if (routeKey in STATIC_TITLES) {
    const v = STATIC_TITLES[routeKey]
    return v === SITE_NAME ? v : `${v} · ${SITE_NAME}`
  }
  const cs = CASE_STUDIES.find((c) => c.id === routeKey)
  return cs ? `${cs.title} · ${SITE_NAME}` : SITE_NAME
}

function metaForRoute(routeKey) {
  const cs = CASE_STUDIES.find((c) => c.id === routeKey)
  const routeRoot = routeKey.split('/')[0]
  return {
    title: titleForRoute(routeKey),
    description:
      cs?.subtitle ||
      PAGE_DESCRIPTIONS[routeKey] ||
      PAGE_DESCRIPTIONS[routeRoot] ||
      DEFAULT_DESCRIPTION,
    image: cs?.heroImage || seedHero,
    noindex: INTERNAL_ROUTES.has(routeKey) || INTERNAL_ROUTES.has(routeRoot),
  }
}

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

function absoluteUrl(path) {
  if (!path) return path
  if (/^https?:\/\//.test(path)) return path
  const sep = path.startsWith('/') ? '' : '/'
  return `${window.location.origin}${sep}${path}`
}

export default function App() {
  const [route, setRoute] = useState(() => {
    const migrated = migrateLegacyHash()
    return migrated !== null ? migrated : getRoute()
  })

  // Browser back/forward
  useEffect(() => {
    const onPop = () => {
      setRoute(getRoute())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // SPA click interception — left clicks on internal links pushState instead of full reload.
  // Middle-click, Cmd/Ctrl-click, Shift-click, right-click, target="_blank", download all bypass.
  useEffect(() => {
    const onClick = (e) => {
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (e.defaultPrevented) return
      const a = e.target.closest('a')
      if (!a) return
      if (a.target && a.target !== '' && a.target !== '_self') return
      if (a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href) return
      // External, mailto/tel, in-page hash anchor — let the browser handle
      if (/^([a-z]+:|\/\/|#)/i.test(href)) return
      if (a.origin !== window.location.origin) return

      e.preventDefault()
      const target = a.pathname + a.search + a.hash
      if (target === window.location.pathname + window.location.search + window.location.hash) return
      window.history.pushState(null, '', target)
      setRoute(getRoute())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

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

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_path: `/${route}`,
        page_location: window.location.href,
      })
    }
  }, [route])

  function goHome() {
    if (window.location.pathname === '/') return
    window.history.pushState(null, '', '/')
    setRoute('')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const Page = ROUTES[route] ?? ROUTES[route.split('/')[0]] ?? Home
  const heroPreloads = CASE_STUDIES.filter((c) => c.heroImage)

  return (
    <>
      {Page === Home ? (
        <Home />
      ) : (
        <Page onHome={goHome} route={route} />
      )}
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
