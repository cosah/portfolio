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
  return window.location.hash.replace(/^#\/?/, '')
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
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
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
    window.location.hash = ''
  }

  const Page = ROUTES[route] ?? ROUTES[route.split('/')[0]] ?? Home
  const heroPreloads = CASE_STUDIES.filter((c) => c.heroImage)

  return (
    <>
      {Page === Home ? (
        <Home />
      ) : (
        <Page onHome={goHome} />
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
