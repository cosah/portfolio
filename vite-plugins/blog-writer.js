// blog-writer is a custom Vite plugin that lets the in-browser editor at
// /blog-editor persist posts to disk during development. It exposes two
// endpoints on the Vite dev server:
//
//   POST /__write-post     write or update a post markdown file
//   DELETE /__delete-post  delete an existing post markdown file
//
// Both endpoints exist only in dev because the configureServer hook is
// only called by `vite dev`, never by `vite build` or `vite preview`.
// That's the security model: the editor UI on a deployed site simply
// has nothing to talk to.
//
// Serialization is hand-rolled to match the custom parser in
// src/data/blog.js exactly. This avoids gray-matter's js-yaml output,
// which would wrap long strings at 80 chars, write arrays in block
// style, and use YAML single-quote escapes the parser doesn't decode.

import fs from 'node:fs'
import path from 'node:path'

// Constrain slugs to lowercase kebab-case. This prevents path traversal
// (no /, no .., no \\), and matches the filename convention the loader expects.
const SLUG_REGEX = /^[a-z0-9-]+$/
const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog')
const BLOG_DATA_MODULE = path.resolve(process.cwd(), 'src/data/blog.js')
const ASSETS_DIR = path.resolve(process.cwd(), 'public/blog-assets')

// Cap on image upload size. 5MB is generous for a personal blog and
// keeps the base64-over-JSON payloads manageable. Larger uploads get a
// 413 with a readable error.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_MIME = /^image\/(png|jpe?g|gif|webp|avif|svg\+xml)$/i

// Force Vite to re-evaluate src/data/blog.js so its import.meta.glob
// picks up file additions, edits, and deletions. Vite's own watcher
// reliably catches adds and edits but not always deletes, so we poke
// the module graph after every write or delete.
async function invalidateBlogModule(server) {
  const mods = server.moduleGraph.getModulesByFile(BLOG_DATA_MODULE)
  if (!mods || mods.size === 0) return
  for (const mod of mods) {
    server.moduleGraph.invalidateModule(mod)
    // reloadModule pushes an HMR update to connected clients. Without
    // it, the invalidation only affects the next request that hits
    // the dev server (e.g. a full page reload).
    try {
      await server.reloadModule(mod)
    } catch {
      /* swallow; if reloadModule is unavailable, the invalidation alone is enough on next nav */
    }
  }
}

// Pull the whole request body as a UTF-8 string, then JSON.parse. Tiny
// helper instead of a dependency like body-parser; the editor only ever
// sends small JSON payloads.
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

// Send a JSON response with the given status. The Vite dev server uses
// Node's built-in http response object; res.end with a Content-Type
// header gives a clean JSON response without an extra dep.
function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

// Validate every tag in the array. Loose enough to allow numbers and
// hyphens; strict enough to block weird characters that would break
// the frontmatter or the URL.
function validTags(tags) {
  if (!Array.isArray(tags)) return false
  return tags.every((t) => typeof t === 'string' && SLUG_REGEX.test(t))
}

// Normalize an uploaded filename to something safe to write and serve.
// Lowercases, strips characters outside [a-z0-9._-], collapses runs of
// dashes. Preserves the extension. Empty results fall back to 'image'.
function safeAssetName(filename) {
  const last = (filename || '').split(/[\\/]/).pop() || ''
  const dot = last.lastIndexOf('.')
  const stem = dot > 0 ? last.slice(0, dot) : last
  const ext = dot > 0 ? last.slice(dot).toLowerCase() : ''
  const safeStem = stem
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  const base = safeStem || 'image'
  return `${base}${ext.replace(/[^a-z0-9.]+/g, '')}`
}

// If `target.ext` already exists in dir, append a -2, -3, etc. before
// the extension until we find a free name. Avoids overwriting an
// upload with the same filename from a different source.
function uniqueAssetPath(dir, name) {
  const full = path.join(dir, name)
  if (!fs.existsSync(full)) return { name, path: full }
  const dot = name.lastIndexOf('.')
  const stem = dot > 0 ? name.slice(0, dot) : name
  const ext = dot > 0 ? name.slice(dot) : ''
  for (let i = 2; i < 10000; i++) {
    const candidate = `${stem}-${i}${ext}`
    const candidatePath = path.join(dir, candidate)
    if (!fs.existsSync(candidatePath)) return { name: candidate, path: candidatePath }
  }
  // 9999 collisions on one filename feels impossible in practice; bail loud.
  throw new Error('too many collisions resolving unique asset name')
}

// Build the on-disk markdown file. Format mirrors what the parser in
// src/data/blog.js reads:
//
//   ---
//   title: bare or single-quoted
//   slug: kebab-case-bare
//   date: 'YYYY-MM-DD'  (always quoted to prevent YAML date coercion)
//   excerpt: bare or single-quoted
//   tags: [a, b, c]  (flow style, terser than block)
//   draft: true|false
//   ---
//
//   body
//
// Single quotes inside single-quoted strings are escaped by doubling
// (YAML's standard), and the parser decodes that.
function stringifyFrontmatter(data, body) {
  const lines = [
    '---',
    `title: ${quoteIfNeeded(data.title)}`,
    `slug: ${data.slug}`,
    `date: ${quoteAlways(data.date)}`,
    `excerpt: ${quoteIfNeeded(data.excerpt)}`,
    `tags: [${data.tags.join(', ')}]`,
    `draft: ${data.draft ? 'true' : 'false'}`,
  ]
  // Optional hero image fields. Only emit them when present so existing
  // posts without a hero don't gain empty `heroImage: ''` lines on
  // re-save (cleaner diffs).
  if (data.heroImage) {
    lines.push(`heroImage: ${quoteIfNeeded(data.heroImage)}`)
    if (data.heroImageAlt) {
      lines.push(`heroImageAlt: ${quoteIfNeeded(data.heroImageAlt)}`)
    }
  }
  lines.push('---', '')
  // Body normalized to end without a trailing newline; we add exactly
  // one after to keep the file ending consistent.
  const cleanBody = String(body || '').replace(/\s+$/, '')
  return lines.join('\n') + cleanBody + '\n'
}

// Single-quote and escape. Used for dates (always quote so YAML never
// reinterprets them as a Date type).
function quoteAlways(raw) {
  const s = String(raw ?? '')
  return `'${s.replace(/'/g, "''")}'`
}

// Quote a string only when it could be misread by the parser. The parser
// is permissive: it takes the substring after the first colon, trims it,
// and uses it as-is unless it's wrapped in quotes or looks like an array.
// We therefore only need to quote strings that are empty, start with a
// YAML indicator, look like a number/keyword/date, or contain leading
// or trailing whitespace.
function quoteIfNeeded(raw) {
  const s = String(raw ?? '')
  if (s === '') return "''"
  if (
    /^[!&*|>%@`#\[{?-]/.test(s) ||  // YAML indicator at the start
    /^\s|\s$/.test(s) ||             // leading or trailing whitespace
    /^(true|false|null|yes|no|~)$/i.test(s) || // boolean / null keywords
    /^[+-]?\d/.test(s)                 // looks like a number or date
  ) {
    return `'${s.replace(/'/g, "''")}'`
  }
  return s
}

export default function blogWriter() {
  return {
    name: 'blog-writer',
    // configureServer fires only when Vite runs as a dev server. The
    // server parameter is the underlying Connect-like middleware stack.
    // Endpoints registered here don't exist in vite build or vite preview.
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only match our endpoints; let everything else flow through.
        const isWrite = req.method === 'POST' && req.url === '/__write-post'
        const isDelete = req.method === 'DELETE' && req.url?.startsWith('/__delete-post/')
        const isUpload = req.method === 'POST' && req.url === '/__upload-image'
        if (!isWrite && !isDelete && !isUpload) return next()

        try {
          if (isWrite) {
            const body = await readJsonBody(req)
            const { slug, title, date, excerpt, tags, draft, content, heroImage, heroImageAlt } = body

            // Validate inputs. Bail with a 400 and a readable message
            // so the editor can show the specific problem inline.
            if (!slug || !SLUG_REGEX.test(slug)) {
              return sendJson(res, 400, { error: 'slug must match /^[a-z0-9-]+$/' })
            }
            if (!title || typeof title !== 'string') {
              return sendJson(res, 400, { error: 'title is required' })
            }
            if (!validTags(tags)) {
              return sendJson(res, 400, { error: 'tags must be an array of kebab-case strings' })
            }
            if (typeof content !== 'string') {
              return sendJson(res, 400, { error: 'content must be a string' })
            }

            const file = stringifyFrontmatter(
              {
                title,
                slug,
                date: date || new Date().toISOString().slice(0, 10),
                excerpt: excerpt || '',
                tags,
                draft: !!draft,
                heroImage: typeof heroImage === 'string' ? heroImage : '',
                heroImageAlt: typeof heroImageAlt === 'string' ? heroImageAlt : '',
              },
              content,
            )

            // Ensure the directory exists before writing. recursive:true
            // is idempotent if it already exists.
            fs.mkdirSync(BLOG_DIR, { recursive: true })
            const filepath = path.join(BLOG_DIR, `${slug}.md`)
            fs.writeFileSync(filepath, file, 'utf8')

            // Force the loader module to re-evaluate so the new/edited
            // post is reflected immediately across the running app.
            await invalidateBlogModule(server)

            return sendJson(res, 200, {
              ok: true,
              path: `src/content/blog/${slug}.md`,
            })
          }

          if (isDelete) {
            // Pull slug from the URL: /__delete-post/welcome -> 'welcome'.
            const slug = req.url.slice('/__delete-post/'.length)
            if (!SLUG_REGEX.test(slug)) {
              return sendJson(res, 400, { error: 'invalid slug' })
            }
            const filepath = path.join(BLOG_DIR, `${slug}.md`)
            if (!fs.existsSync(filepath)) {
              return sendJson(res, 404, { error: 'post not found' })
            }
            fs.unlinkSync(filepath)

            // Force the loader module to re-evaluate so the deleted
            // post disappears from the index, post pages, and sidebar
            // without a hard refresh.
            await invalidateBlogModule(server)

            return sendJson(res, 200, { ok: true })
          }

          if (isUpload) {
            const body = await readJsonBody(req)
            const { slug, filename, mimeType, data } = body

            // Validate inputs.
            if (!slug || !SLUG_REGEX.test(slug)) {
              return sendJson(res, 400, { error: 'slug must match /^[a-z0-9-]+$/' })
            }
            if (!filename || typeof filename !== 'string') {
              return sendJson(res, 400, { error: 'filename is required' })
            }
            if (!mimeType || !ALLOWED_IMAGE_MIME.test(mimeType)) {
              return sendJson(res, 400, { error: 'unsupported mime type (image/png|jpeg|gif|webp|avif|svg+xml only)' })
            }
            if (typeof data !== 'string') {
              return sendJson(res, 400, { error: 'data must be a base64-encoded string' })
            }

            // Decode and enforce the size cap. Buffer.from validates the
            // base64 input loosely; we re-check the byte length after.
            const buf = Buffer.from(data, 'base64')
            if (buf.length === 0) {
              return sendJson(res, 400, { error: 'data is empty or invalid base64' })
            }
            if (buf.length > MAX_IMAGE_BYTES) {
              return sendJson(res, 413, {
                error: `image exceeds the ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB limit`,
              })
            }

            // Asset folder = public/blog-assets/<slug>/. Auto-create.
            // Resolve a unique filename inside that folder so consecutive
            // uploads of "screenshot.png" don't overwrite each other.
            const slugDir = path.join(ASSETS_DIR, slug)
            fs.mkdirSync(slugDir, { recursive: true })
            const safe = safeAssetName(filename)
            const { name, path: finalPath } = uniqueAssetPath(slugDir, safe)
            fs.writeFileSync(finalPath, buf)

            // Return the URL that the markdown can reference, plus the
            // disk-relative path for the editor's success toast.
            return sendJson(res, 200, {
              ok: true,
              url: `/blog-assets/${slug}/${name}`,
              path: `public/blog-assets/${slug}/${name}`,
            })
          }
        } catch (err) {
          return sendJson(res, 500, { error: String(err.message || err) })
        }
      })
    },
  }
}
