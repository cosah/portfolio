// blog.js is the client-side data layer for the blog. It uses Vite's
// import.meta.glob to load every .md file in src/content/blog/ at build
// time, then runs each through the shared parser in parseFrontmatter.js.
// The parser is shared with scripts/blog-rss.mjs so the Node-side RSS
// generator and the browser-side data layer always agree on format.
//
// The matching serializer (for the editor's write path) lives in
// vite-plugins/blog-writer.js.

import { parsePost } from './parseFrontmatter'

// Vite's import.meta.glob loads every .md file in src/content/blog/.
// query: '?raw' returns the file contents as a string instead of a URL.
// import: 'default' means the default export of each glob module is
// directly the string (no .default unwrap on each entry).
// eager: true resolves them all at build time so we have a plain object,
// not a record of Promises.
const postModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Build the full post list once at module load. Sort by date descending
// so the freshest posts come first across the site.
const allPosts = Object.entries(postModules)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => String(b.date).localeCompare(String(a.date)))

// Drafts are visible in dev, hidden in production. import.meta.env.PROD
// is true only in production builds; Vite tree-shakes the dev branch
// out of the prod bundle so this is just an array filter at runtime.
export const POSTS = allPosts.filter((p) => (import.meta.env.PROD ? !p.draft : true))

// Ordered union of all tags across the visible posts. Used by the editor
// for autocomplete and by the index page for the filter strip.
// Iteration order follows first-seen, which matches the sort order
// (newest posts contribute their tags first).
export const ALL_TAGS = (() => {
  const seen = new Set()
  for (const post of POSTS) {
    for (const tag of post.tags) seen.add(tag)
  }
  return Array.from(seen)
})()

// Lookup helper mirroring the findDocsPage and CASE_STUDIES.find patterns
// used elsewhere in the codebase. Returns undefined when not found so
// consumers can fall back gracefully.
export function findPost(slug) {
  return POSTS.find((p) => p.slug === slug)
}
