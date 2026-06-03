import { useState, useEffect } from 'react'
import './css/global.css'
import './css/layout.css'
import './css/components.css'
import './css/index.css'
import './css/about.css'
import './css/resume.css'
import './css/audit.css'

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
import { CASE_STUDIES } from './data/caseStudies'

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
}

function getRoute() {
  return window.location.hash.replace(/^#\/?/, '')
}

const SITE_NAME = "Anthony Shephard's Portfolio"
const STATIC_TITLES = {
  '': SITE_NAME,
  resume: 'Resume',
  about: 'About',
  audit: 'Accessibility Audit',
  'layout-demo': 'Layout Demo',
}

function titleForRoute(routeKey) {
  if (routeKey in STATIC_TITLES) {
    const v = STATIC_TITLES[routeKey]
    return v === SITE_NAME ? v : `${v} · ${SITE_NAME}`
  }
  const cs = CASE_STUDIES.find((c) => c.id === routeKey)
  return cs ? `${cs.title} · ${SITE_NAME}` : SITE_NAME
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
    document.title = titleForRoute(route)
  }, [route])

  function navigate(id) {
    window.location.hash = id ? `/${id}` : ''
  }

  function goHome() {
    navigate('')
  }

  const Page = ROUTES[route] ?? Home
  const heroPreloads = CASE_STUDIES.filter((c) => c.heroImage)

  return (
    <>
      {Page === Home ? (
        <Home onNavigate={navigate} />
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
