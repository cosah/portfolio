// Postbuild step: write dist/blog/feed.xml from src/content/blog/*.md.
//
// Reads every .md file in src/content/blog/, parses each via the shared
// parser (src/data/parseFrontmatter.js), filters drafts, and renders a
// minimal valid RSS 2.0 feed. Each per-post step is wrapped in a
// try/catch so one malformed post can't crash the entire deploy: a
// failing post emits an XML comment instead.
//
// Runs after `vite build` (so dist/ already exists) and after
// scripts/spa-fallback.mjs.

import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { parsePost } from '../src/data/parseFrontmatter.js'

const SITE_URL = 'https://anthonyships.com'
const FEED_TITLE = "Anthony Shephard's Blog"
const FEED_DESCRIPTION = 'Short notes from Anthony Shephard. Building, reading, cooking, and the occasional opinion.'

const cwd = process.cwd()
const blogDir = resolve(cwd, 'src/content/blog')
const distDir = resolve(cwd, 'dist')
const outDir = resolve(distDir, 'blog')
const outFile = resolve(outDir, 'feed.xml')

// Guard: if vite build didn't run, dist/ won't exist and there's nothing
// to write into. Fail loud rather than silently dropping the feed.
if (!existsSync(distDir)) {
  console.error('blog-rss: dist/ not found. Did vite build succeed?')
  process.exit(1)
}

// XML 1.0 only allows a narrow set of characters and requires escaping
// of &, <, >, ", '. We use this on every text node we emit (title,
// description, link), so a post title with an ampersand can't corrupt
// the feed.
function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Convert an ISO date string (YYYY-MM-DD) to RFC 822 format, which is
// what RSS 2.0 requires. Falls back to "now" if the date is missing or
// unparseable so the feed is still valid.
function toRfc822(isoDate) {
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return new Date().toUTCString()
  // Anchor at noon UTC so timezone shifts don't bounce dates across days.
  d.setUTCHours(12, 0, 0, 0)
  return d.toUTCString()
}

// Build one <item>...</item> block for a single post.
function renderItem(post) {
  const link = `${SITE_URL}/blog/${post.slug}`
  const desc = post.excerpt || ''
  return [
    '  <item>',
    `    <title>${escapeXml(post.title)}</title>`,
    `    <link>${escapeXml(link)}</link>`,
    `    <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `    <pubDate>${toRfc822(post.date)}</pubDate>`,
    `    <description>${escapeXml(desc)}</description>`,
    ...post.tags.map((t) => `    <category>${escapeXml(t)}</category>`),
    '  </item>',
  ].join('\n')
}

// Read the blog directory, parse each file, filter drafts. Per-file
// errors are caught and surfaced as XML comments so the feed remains
// valid and the deploy keeps going.
let items = []
let errors = []
try {
  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'))
  for (const filename of files) {
    try {
      const raw = readFileSync(join(blogDir, filename), 'utf8')
      const post = parsePost(`./${filename}`, raw)
      if (post.draft) continue
      items.push(post)
    } catch (err) {
      errors.push({ filename, message: String(err.message || err) })
    }
  }
} catch (err) {
  console.error(`blog-rss: failed to read ${blogDir}:`, err.message)
  process.exit(1)
}

// Sort by date descending so the freshest posts appear at the top of
// the feed. Matches the order in src/data/blog.js.
items.sort((a, b) => String(b.date).localeCompare(String(a.date)))

const feedLink = `${SITE_URL}/blog/feed.xml`
const siteLink = `${SITE_URL}/blog`
const lastBuildDate = new Date().toUTCString()

// Use atom:link inside <channel> so feed readers can self-discover the
// feed URL. Required by some validators.
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  '<channel>',
  `  <title>${escapeXml(FEED_TITLE)}</title>`,
  `  <link>${escapeXml(siteLink)}</link>`,
  `  <description>${escapeXml(FEED_DESCRIPTION)}</description>`,
  '  <language>en-us</language>',
  `  <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
  `  <atom:link href="${escapeXml(feedLink)}" rel="self" type="application/rss+xml" />`,
  ...errors.map((e) => `  <!-- skipped ${escapeXml(e.filename)}: ${escapeXml(e.message)} -->`),
  ...items.map(renderItem),
  '</channel>',
  '</rss>',
  '',
].join('\n')

mkdirSync(outDir, { recursive: true })
writeFileSync(outFile, xml, 'utf8')

const summary = `blog-rss: wrote dist/blog/feed.xml (${items.length} posts${
  errors.length > 0 ? `, ${errors.length} skipped` : ''
})`
console.log(summary)
if (errors.length > 0) {
  for (const e of errors) {
    console.warn(`  skipped ${e.filename}: ${e.message}`)
  }
}
