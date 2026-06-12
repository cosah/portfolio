// Pure-JS frontmatter parser shared by:
//   - src/data/blog.js (browser / Vite, uses import.meta.glob)
//   - scripts/blog-rss.mjs (Node, uses fs.readdirSync)
//
// No Vite-specific imports here; this module must work under plain
// Node ESM. Both callers feed it raw markdown text and consume the
// shaped post objects.
//
// The matching serializer lives in vite-plugins/blog-writer.js.

// Words-per-minute for the read-time calculation. 225 is the
// conventional adult silent reading rate for prose.
export const WPM = 225

// Frontmatter parser. Handles both YAML array styles so it can read
// posts written by hand or by the blog-writer plugin, plus legacy
// posts that were written by gray-matter before the switch:
//
//   Flow style (what the editor now writes, and what's easiest to type):
//     tags: [design, react]
//
//   Block style (what gray-matter wrote before, and what real YAML
//   parsers default to):
//     tags:
//       - design
//       - react
//
// Plus scalar key/value pairs, booleans, and quoted strings. Returns
// { data, content }. If no frontmatter is present, data is empty and
// content is the full raw string.
export function parseFrontmatter(raw) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!fmMatch) return { data: {}, content: raw }
  const [, fmBlock, content] = fmMatch
  const data = {}
  const lines = fmBlock.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    // Block-list item lines (indented "- value") are consumed by the
    // parent key's handler below; skip them when seen at this level so
    // they don't get treated as their own key:value.
    if (/^\s+-/.test(line)) continue
    const idx = line.indexOf(':')
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    // Empty value after the colon means either a true empty field or
    // the start of a block-style list. Peek ahead at indented `- item`
    // lines and collect them into an array.
    if (value === '') {
      const items = []
      let j = i + 1
      while (j < lines.length) {
        const next = lines[j]
        const m = next.match(/^\s+-\s*(.*)$/)
        if (!m) break
        items.push(stripQuotes(m[1].trim()))
        j++
      }
      data[key] = items.length > 0 ? items : ''
      // Don't advance i; the early `continue` at the top of the loop
      // will skip the consumed list items naturally.
      continue
    }
    data[key] = parseValue(value)
  }
  return { data, content: content || '' }
}

// Turns a frontmatter value string into the appropriate JS primitive.
// Supports the shapes the editor writes: quoted strings, bare strings,
// booleans, and bracket-list arrays of bare strings.
export function parseValue(v) {
  if (v === 'true') return true
  if (v === 'false') return false
  // [a, b, c] form for tags. We don't need nested arrays or escaped
  // commas because the editor enforces kebab-case tags.
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((s) => stripQuotes(s.trim()))
  }
  return stripQuotes(v)
}

// Strip surrounding quotes from a frontmatter scalar. Single-quoted
// strings get YAML's standard '' -> ' unescape so apostrophes round-trip
// cleanly (the blog-writer plugin and gray-matter both produce that
// escape). Double-quoted strings are returned as-is; neither writer
// emits backslash escapes so we don't need to decode them.
export function stripQuotes(s) {
  if (s.startsWith("'") && s.endsWith("'") && s.length >= 2) {
    return s.slice(1, -1).replace(/''/g, "'")
  }
  if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
    return s.slice(1, -1)
  }
  return s
}

// Count the meaningful words in a body string. Strips markdown syntax
// noise (code fences, headings, links, emphasis markers) before splitting
// so a code-heavy post doesn't get an inflated count.
export function countWords(body) {
  if (!body || typeof body !== 'string') return 0
  const cleaned = body
    .replace(/```[\s\S]*?```/g, ' ')      // fenced code blocks
    .replace(/`[^`]*`/g, ' ')              // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links keep their label only
    .replace(/[*_~#>-]/g, ' ')             // markdown punctuation
  const tokens = cleaned.split(/\s+/).filter(Boolean)
  return tokens.length
}

// Normalize one entry: parse frontmatter, derive a slug from the filename
// as a fallback if the frontmatter doesn't specify one, compute word
// count and read time, and shape the object the rest of the app consumes.
//
// `path` is the source path of the markdown file. Used only to derive
// a fallback slug when frontmatter doesn't provide one.
export function parsePost(path, raw) {
  const { data, content } = parseFrontmatter(raw)
  const filenameSlug = path.split('/').pop().replace(/\.md$/, '')
  const body = content || ''
  const words = countWords(body)
  const readMinutes = Math.max(1, Math.round(words / WPM))
  return {
    slug: data.slug || filenameSlug,
    title: data.title || 'Untitled',
    // String coerce defensively, in case a future parser ever returns
    // something non-string here (e.g. an accidental Date).
    date: String(data.date || '1970-01-01'),
    excerpt: data.excerpt || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: !!data.draft,
    // Optional hero image. Treated as a URL path (e.g.
    // /blog-assets/<slug>/cover.jpg). Empty string when absent so the
    // post template can do a plain truthy check.
    heroImage: data.heroImage || '',
    heroImageAlt: data.heroImageAlt || '',
    body,
    words,
    readMinutes,
  }
}
