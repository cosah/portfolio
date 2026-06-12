import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogWriter from './vite-plugins/blog-writer.js'

// https://vite.dev/config/
export default defineConfig({
  // blogWriter only registers its endpoints via configureServer, which
  // runs in `vite dev` only. It contributes nothing to `vite build` or
  // `vite preview`, so leaving it always-on here is safe.
  plugins: [react(), blogWriter()],
  base: '/'
})
