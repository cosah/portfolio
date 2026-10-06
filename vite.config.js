import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogWriter from './vite-plugins/blog-writer.js'

// https://vite.dev/config/
export default defineConfig({
  // blogWriter only registers its endpoints via configureServer, which
  // runs in `vite dev` only. It contributes nothing to `vite build` or
  // `vite preview`, so leaving it always-on here is safe.
  plugins: [react(), blogWriter()],
  base: '/',
  server: {
    // Image uploads land in public/blog-assets/. Without this, each
    // upload adds a file Vite can't scope to an HMR boundary, so it
    // falls back to a full page reload that wipes the editor's unsaved
    // form state. sirv still serves these files on demand regardless.
    watch: {
      ignored: ['**/public/blog-assets/**'],
    },
  },
})
