import { useState, useEffect } from 'react'
import './css/global.css'
import './css/layout.css'
import './css/components.css'
import './css/index.css'

import Home from './pages/Home'
import TheDiag from './pages/TheDiag'
import Mintify from './pages/Mintify'
import Roamio from './pages/Roamio'
import SeedLibrary from './pages/SeedLibrary'
import CourtsAudit from './pages/CourtsAudit'

const ROUTES = {
  '': Home,
  'the-diag': TheDiag,
  'mintify': Mintify,
  'roamio': Roamio,
  'seed-library': SeedLibrary,
  'courts-audit': CourtsAudit,
}

function getRoute() {
  return window.location.hash.replace(/^#\/?/, '')
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function navigate(id) {
    window.location.hash = id ? `/${id}` : ''
  }

  function goHome() {
    navigate('')
  }

  const Page = ROUTES[route] ?? Home

  if (Page === Home) {
    return <Home onNavigate={navigate} />
  }

  return <Page onHome={goHome} />
}
