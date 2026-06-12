// Shared marked instance used by BlogPost.jsx for rendered post bodies
// and BlogEditor.jsx for the live preview pane. Centralizing the config
// keeps the two render paths in sync (extensions, options, themes).
//
// marked-highlight is the official extension that pipes fenced code
// blocks through a syntax highlighter. We use Prism, with a small set
// of bundled languages imported eagerly below. Eager bundling (rather
// than Prism's autoloader) keeps the deploy self-contained: no
// runtime CDN fetches, no CSP friction.

import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import Prism from 'prismjs'

// Prism's core bundle already registers: markup (html), css, clike,
// javascript. Below are the extras we want to support. Adding a new
// language later is a one-line import here.
//
// Order matters: each `import` side-effect-registers its grammar with
// Prism. Languages that extend others (typescript extends javascript,
// jsx extends markup + javascript, tsx extends typescript + jsx) need
// their base languages loaded first.
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'

// marked.use() registers the highlight extension. langPrefix sets the
// CSS class on the wrapping <code> element so the Prism theme (in
// blog.css) can scope itself to highlighted blocks.
marked.use(
  markedHighlight({
    langPrefix: 'language-',
    highlight(code, lang) {
      // If the language is unknown or not loaded, return the code
      // unmodified. marked-highlight will still wrap it in
      // <code class="language-<lang>"> so styling is consistent
      // (just no token coloring).
      if (lang && Prism.languages[lang]) {
        return Prism.highlight(code, Prism.languages[lang], lang)
      }
      return code
    },
  })
)

// Custom marked extension: pandoc-style image attributes.
//
//   ![alt](url){width=50%}
//   ![alt](url){width=400px height=300px}
//   ![alt](url){width=80% .center}
//
// Recognized attributes:
//   width=  height=   any CSS length (50%, 400px, 2rem, auto)
//   .name              shortcut for class="name" (e.g. ".center")
//
// Anything else inside {...} is ignored. If the {...} payload can't be
// parsed, falls back to plain <img>, never throws.
const imageAttrsExtension = {
  name: 'imageAttrs',
  level: 'inline',
  // Inline extensions need a `start` to tell marked where the next
  // possible match might be. Returning the index of "![" speeds up
  // lookups inside long paragraphs.
  start(src) {
    const i = src.indexOf('![')
    return i < 0 ? undefined : i
  },
  tokenizer(src) {
    // Match ![alt](url){attrs} OR ![alt](url "title"){attrs}.
    const rule = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\{([^}]+)\}/
    const match = rule.exec(src)
    if (!match) return
    return {
      type: 'imageAttrs',
      raw: match[0],
      alt: match[1],
      href: match[2],
      title: match[3] || '',
      attrs: match[4],
    }
  },
  renderer(token) {
    let style = ''
    let cssClass = 'blog-inline-img'
    try {
      for (const piece of token.attrs.split(/\s+/)) {
        if (!piece) continue
        if (piece.startsWith('.')) {
          // .name -> class shorthand
          cssClass += ' ' + piece.slice(1)
          continue
        }
        const eq = piece.indexOf('=')
        if (eq < 0) continue
        const key = piece.slice(0, eq).toLowerCase()
        const value = piece.slice(eq + 1)
        if (key === 'width' || key === 'height') {
          // Loose CSS-length whitelist. Allows digits, dot, %, px, em,
          // rem, vh, vw, plus literal "auto". Reject anything weird
          // so a malformed attr can't inject arbitrary CSS.
          if (/^(auto|[\d.]+(px|%|em|rem|vh|vw)?)$/.test(value)) {
            style += `${key}:${value};`
          }
        }
      }
    } catch {
      // Defensive: even if the parser above hits something weird, just
      // fall through to a plain image rather than throwing and breaking
      // the post body render.
      style = ''
      cssClass = 'blog-inline-img'
    }
    const attrs = [
      `src="${escapeAttr(token.href)}"`,
      `alt="${escapeAttr(token.alt)}"`,
      token.title ? `title="${escapeAttr(token.title)}"` : '',
      `class="${cssClass}"`,
      style ? `style="${style}"` : '',
    ].filter(Boolean).join(' ')
    return `<img ${attrs}>`
  },
}

// Minimal HTML attribute escaping. Output is wrapped in double quotes
// so we only need to escape & and " (and < to be safe).
function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

marked.use({ extensions: [imageAttrsExtension] })

// gfm: GitHub-flavored markdown (tables, strikethrough, autolinks).
// breaks: single newlines become <br>, matching the casual blog feel.
marked.setOptions({ gfm: true, breaks: true })

export { marked }
