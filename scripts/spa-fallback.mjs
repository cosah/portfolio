// Postbuild step: write dist/404.html as a copy of dist/index.html.
//
// GitHub Pages serves 404.html for any path it can't find. With a clean-URL SPA,
// a direct hit to /seed-library (no file on disk) needs to render the same SPA
// shell as /. This makes that happen without any redirect flash.
//
// Status code is technically 404, but the rendered content is the SPA which
// then routes from window.location.pathname. Crawlers that execute JS see the
// real page content.

import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const index = resolve(dist, 'index.html')
const notFound = resolve(dist, '404.html')

if (!existsSync(index)) {
  console.error('spa-fallback: dist/index.html not found. Did vite build succeed?')
  process.exit(1)
}

copyFileSync(index, notFound)
console.log('spa-fallback: wrote dist/404.html')
