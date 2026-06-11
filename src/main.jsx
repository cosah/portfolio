// The single entry point Vite uses to mount the React tree. Wired up from
// index.html via <script type="module" src="/src/main.jsx">.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// createRoot is the React 18+ API for concurrent rendering. The argument is
// the DOM node React will own and re-render into; #root is declared in
// index.html.
//
// StrictMode is a dev-only wrapper that runs effects, refs, and state
// updaters twice on mount. That double-invocation surfaces side-effect bugs
// (e.g. effects that aren't safely re-runnable). Production builds skip it.
// Heads-up while reading App.jsx: a useEffect that fires a GA page_view
// will fire twice in dev because of StrictMode, but only once in production.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
