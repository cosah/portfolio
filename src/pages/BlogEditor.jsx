// BlogEditor is the dev-only authoring UI for /blog-editor. The whole
// component is gated by import.meta.env.DEV: in production it renders a
// small notice explaining the editor is dev-only, and the form code is
// tree-shaken out of the prod bundle by Vite's dead code elimination.
//
// In dev, it talks to the blog-writer Vite plugin (see
// vite-plugins/blog-writer.js) through two endpoints:
//   POST   /__write-post
//   DELETE /__delete-post/<slug>
//
// Those endpoints exist only on the Vite dev server, so even if someone
// navigates to /blog-editor on the live site there is nothing to write to.

import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import TagPill from '../components/TagPill'
import BlogEditorToolbar, { applyToolbarAction } from '../components/BlogEditorToolbar'
import { POSTS, ALL_TAGS } from '../data/blog'
// Shared marked instance with marked-highlight + Prism preconfigured.
import { marked } from '../data/marked'

// Normalize a free-form title into a kebab-case slug. Drops punctuation,
// collapses runs of whitespace and dashes. The Vite plugin enforces this
// same shape via its SLUG_REGEX validator.
function titleToSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Today's date in YYYY-MM-DD for the default date input value.
function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Empty form state used for "New post" and after deletes.
const emptyForm = () => ({
  title: '',
  slug: '',
  date: todayIso(),
  excerpt: '',
  tags: [],
  heroImage: '',
  heroImageAlt: '',
  body: '',
  // Originals are used to detect dirty state and slug changes.
  loadedSlug: null,
  loadedDraft: null,
  // slug auto-derive is on while the user has not manually edited slug.
  slugManuallyEdited: false,
})

export default function BlogEditor({ onHome }) {
  // Production gate. In a prod build, Vite's dead code elimination keeps
  // only this branch and tree-shakes everything after it.
  if (!import.meta.env.DEV) {
    return (
      <div className="blog-editor-page case-study-page">
        <Navbar onHome={onHome} slug="blog-editor" crumbOverride="Blog editor" hideProgress />
        <div className="blog-editor-prod-notice">
          <h1>Editor is dev-only</h1>
          <p>
            The blog editor only runs during local development. Edit posts in VS Code
            inside <code>src/content/blog/</code> and commit them as part of a normal git push.
          </p>
          <p>
            <a href="/blog">← Back to the blog</a>
          </p>
        </div>
      </div>
    )
  }

  return <BlogEditorDev onHome={onHome} />
}

function BlogEditorDev({ onHome }) {
  const [form, setForm] = useState(emptyForm)
  // Frozen snapshot of the form fields the last time they matched disk.
  // Updated on load (to mirror the loaded post) and on save (to mirror
  // what we just wrote). null means "new post, never saved". The dirty
  // check below compares form against this snapshot; without it we'd be
  // comparing against POSTS, which is a static module-level array and
  // never reflects in-session saves.
  const [savedSnapshot, setSavedSnapshot] = useState(null)
  const [saveStatus, setSaveStatus] = useState({ kind: 'idle' })
  // Controls the styled delete-confirm modal. A modal rather than a
  // click-twice arm pattern so a stray double-click can't ever delete
  // by accident: the destructive action lives behind a separate widget
  // with its own button that the user has to deliberately target.
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // When an image in the preview pane is clicked, this holds the parsed
  // markdown that produced it (so we can find-and-replace as the user
  // adjusts width/height). null when the resize modal is closed.
  const [resizeTarget, setResizeTarget] = useState(null)
  // Snapshot of the body taken at modal-open, restored on Cancel so the
  // live-preview edits don't stick if the user backs out.
  const [resizeSnapshot, setResizeSnapshot] = useState(null)
  // Slug-change panel state. choice is 'new' | 'move'; confirmed locks
  // in the choice so the save buttons can re-enable.
  const [slugChoice, setSlugChoice] = useState('new')
  const [slugConfirmed, setSlugConfirmed] = useState(false)
  // Stack of upload toasts. Each toast is { id, message, kind }. New
  // entries push to the end; auto-dismiss removes by id. Multiple in
  // quick succession stack instead of fighting over one slot.
  const [toasts, setToasts] = useState([])
  // Ref to the body textarea, shared with BlogEditorToolbar so toolbar
  // buttons can read the current selection and write back into it. The
  // upload flow also uses this to insert markdown at the cursor.
  const bodyTextareaRef = useRef(null)

  // Reset save status after 2s when it lands on "saved".
  useEffect(() => {
    if (saveStatus.kind !== 'saved') return
    const id = setTimeout(() => setSaveStatus({ kind: 'idle' }), 2000)
    return () => clearTimeout(id)
  }, [saveStatus])

  // When the slug field changes after loading an existing post, the
  // slug-change panel re-appears. Reset the confirmed flag so the user
  // has to make the choice again.
  const slugChanged = form.loadedSlug !== null && form.loadedSlug !== form.slug
  useEffect(() => {
    if (slugChanged) {
      setSlugConfirmed(false)
      setSlugChoice('new')
    }
  }, [slugChanged])

  // Form derivations and validation.
  const dirty = isDirty(form, savedSnapshot)
  const canSave =
    form.title.trim().length > 0 &&
    form.body.trim().length > 0 &&
    form.slug.length > 0 &&
    (!slugChanged || slugConfirmed)

  // Push a toast to the stack. Auto-dismisses after `ttlMs` (default 4s).
  // Kind is 'info' (default) or 'error'; styles differ.
  const pushToast = (message, kind = 'info', ttlMs = 4000) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, ttlMs)
  }
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id))

  // Read a File as base64. Returns a promise resolving to the data
  // portion only (the "iVBORw0K..." after the comma in the data URL).
  // Used by the upload flow below.
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = String(reader.result || '')
        const comma = result.indexOf(',')
        resolve(comma >= 0 ? result.slice(comma + 1) : result)
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

  // Insert text at the current cursor position in the body textarea,
  // then move the cursor to the end of the inserted text. Falls back
  // to appending if the ref isn't ready yet. Uses the functional
  // setForm updater so edits typed during an async upload aren't lost
  // when the insert eventually resolves.
  const insertIntoBody = (text) => {
    const ta = bodyTextareaRef.current
    if (!ta) {
      setForm((f) => ({ ...f, body: f.body + text }))
      return
    }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    setForm((f) => ({
      ...f,
      body: f.body.slice(0, start) + text + f.body.slice(end),
    }))
    // Restore selection just after the inserted text. Defer one tick so
    // the textarea sees the new value before we set the cursor.
    requestAnimationFrame(() => {
      if (!bodyTextareaRef.current) return
      const pos = start + text.length
      bodyTextareaRef.current.focus()
      bodyTextareaRef.current.setSelectionRange(pos, pos)
    })
  }

  // Upload a File via the Vite plugin endpoint. Returns the absolute
  // URL the editor can drop into the markdown. Surfaces errors via the
  // toast stack instead of throwing.
  const uploadImage = async (file) => {
    // The slug used to bucket the asset on disk. Falls back to "drafts"
    // when the post is brand new and has no slug yet.
    const targetSlug = form.slug && /^[a-z0-9-]+$/.test(form.slug)
      ? form.slug
      : 'drafts'
    try {
      const data = await fileToBase64(file)
      const res = await fetch('/__upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: targetSlug,
          filename: file.name,
          mimeType: file.type,
          data,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `upload failed (${res.status})`)
      }
      const json = await res.json()
      pushToast(`Saved to ${json.path}`, 'info')
      return json.url
    } catch (err) {
      pushToast(`Upload failed: ${err.message || err}`, 'error', 6000)
      return null
    }
  }

  // Called from the file input, the dropzone, and (later) the toolbar
  // image button. Uploads the file, then inserts standard markdown at
  // the cursor pointing at the new URL.
  const handleImageFile = async (file) => {
    if (!file) return
    const url = await uploadImage(file)
    if (!url) return
    // alt text falls back to the filename's stem so screen readers get
    // something useful even before the user edits it.
    const alt = file.name.replace(/\.[^.]+$/, '')
    insertIntoBody(`\n![${alt}](${url})\n`)
  }

  // Drag-and-drop handlers on the body field. preventDefault is
  // required on dragover to mark the area as a drop target.
  const onBodyDragOver = (e) => {
    if (Array.from(e.dataTransfer?.types || []).includes('Files')) {
      e.preventDefault()
    }
  }
  const onBodyDrop = (e) => {
    const files = Array.from(e.dataTransfer?.files || [])
    const image = files.find((f) => f.type.startsWith('image/'))
    if (!image) return
    e.preventDefault()
    handleImageFile(image)
  }

  // Update a single field. Auto-derives slug from title until the user
  // manually edits the slug field, at which point auto-derive stops.
  const update = (patch) => setForm((f) => ({ ...f, ...patch }))
  const onTitleChange = (e) => {
    const title = e.target.value
    if (!form.slugManuallyEdited) {
      update({ title, slug: titleToSlug(title) })
    } else {
      update({ title })
    }
  }
  const onSlugChange = (e) => {
    update({ slug: titleToSlug(e.target.value), slugManuallyEdited: true })
  }

  // Fill the form from a known post slug. Shared between the dropdown
  // handler and the mount-effect that reads ?slug= from the URL.
  // Returns true if a post matched and was loaded, false otherwise.
  const loadPostBySlug = (slug) => {
    const post = POSTS.find((p) => p.slug === slug)
    if (!post) return false
    setForm({
      title: post.title,
      slug: post.slug,
      date: post.date,
      excerpt: post.excerpt,
      tags: [...post.tags],
      heroImage: post.heroImage || '',
      heroImageAlt: post.heroImageAlt || '',
      body: post.body,
      loadedSlug: post.slug,
      loadedDraft: post.draft,
      slugManuallyEdited: true,
    })
    // Snapshot mirrors the loaded post so a freshly loaded form is
    // not dirty.
    setSavedSnapshot(makeSnapshot(post))
    setSlugConfirmed(false)
    setSlugChoice('new')
    setShowDeleteConfirm(false)
    setSaveStatus({ kind: 'idle' })
    return true
  }

  // Load existing dropdown: prompt to discard if the current form is dirty.
  const onLoad = (e) => {
    const slug = e.target.value
    // Reset the select back so the same option can be re-selected later.
    e.target.value = ''
    if (!slug) return
    if (dirty && !window.confirm('Discard unsaved changes?')) return
    loadPostBySlug(slug)
  }

  // One-shot pre-fill from the URL: visiting /blog-editor?slug=welcome
  // auto-loads that post into the form, then strips the query string so
  // the URL is clean while the user edits. Runs once per mount via the
  // empty dep array. Safe to call without a guard against re-runs because
  // App.jsx unmounts pages on route change (this mounts fresh each time).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const querySlug = params.get('slug')
    if (querySlug) {
      loadPostBySlug(querySlug)
      window.history.replaceState(null, '', '/blog-editor')
    }
    // loadPostBySlug closes over setters and POSTS (all stable); the
    // empty dep array is intentional for one-shot mount behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Guard against losing work when the user clicks a link or closes the
  // tab with unsaved changes.
  //
  // SPA navigation: App.jsx's global click interceptor dispatches a
  // cancelable 'spa-nav-attempt' CustomEvent before each pushState. We
  // listen for it here while the form is dirty and ask the user before
  // letting it proceed. preventDefault() on a cancelable CustomEvent
  // flips defaultPrevented true, which App.jsx checks to abort.
  //
  // beforeunload: covers closing the tab, hard reloads, typing a new URL
  // in the address bar. Modern browsers show a generic prompt and ignore
  // any custom message; we just opt in by calling preventDefault and
  // setting returnValue.
  //
  // Both listeners only register while dirty, so the prompt is silent
  // immediately after a fresh load or successful save.
  useEffect(() => {
    if (!dirty) return
    const spaHandler = (e) => {
      if (!window.confirm('Discard unsaved changes?')) e.preventDefault()
    }
    const unloadHandler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('spa-nav-attempt', spaHandler)
    window.addEventListener('beforeunload', unloadHandler)
    return () => {
      window.removeEventListener('spa-nav-attempt', spaHandler)
      window.removeEventListener('beforeunload', unloadHandler)
    }
  }, [dirty])

  // "New" button: prompt to discard, then reset.
  const onNew = () => {
    if (dirty && !window.confirm('Discard unsaved changes?')) return
    setForm(emptyForm())
    setSavedSnapshot(null)
    setSlugConfirmed(false)
    setSlugChoice('new')
    setShowDeleteConfirm(false)
    setSaveStatus({ kind: 'idle' })
  }

  // Perform the save. Differs from the Draft / Publish button only in
  // the value of `draft`. If the slug changed AND the user picked
  // "move", we DELETE the old file first, then write the new one.
  const doSave = async (draft) => {
    setSaveStatus({ kind: 'saving' })
    try {
      if (slugChanged && slugChoice === 'move' && form.loadedSlug) {
        const del = await fetch(`/__delete-post/${form.loadedSlug}`, { method: 'DELETE' })
        if (!del.ok) {
          const err = await del.json().catch(() => ({}))
          throw new Error(err.error || `delete failed (${del.status})`)
        }
      }
      const res = await fetch('/__write-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug,
          date: form.date,
          excerpt: form.excerpt.trim(),
          tags: form.tags,
          heroImage: form.heroImage || '',
          heroImageAlt: form.heroImageAlt || '',
          draft,
          content: form.body,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `save failed (${res.status})`)
      }
      // Update loaded markers so a follow-up save isn't treated as a
      // slug change, and the status pill reflects the new draft state.
      setForm((f) => ({
        ...f,
        loadedSlug: f.slug,
        loadedDraft: draft,
        slugManuallyEdited: true,
      }))
      // Freeze the just-saved form values as the new dirty-check
      // baseline. Without this, the next "load existing" or navigation
      // away would prompt to discard unsaved changes even though there
      // are none.
      setSavedSnapshot(makeSnapshot(form))
      setSlugConfirmed(false)
      setSlugChoice('new')
      setSaveStatus({ kind: 'saved' })
    } catch (err) {
      setSaveStatus({ kind: 'error', message: String(err.message || err) })
    }
  }

  // Open the styled confirm modal. The actual destructive call lives in
  // performDelete below, only fired when the user clicks the modal's
  // Delete button. This keeps accidental double-clicks on the toolbar
  // button from ever reaching the DELETE request.
  const onDeleteClick = () => {
    if (!form.loadedSlug) return
    setShowDeleteConfirm(true)
  }

  const performDelete = async () => {
    if (!form.loadedSlug) return
    setSaveStatus({ kind: 'saving' })
    try {
      const res = await fetch(`/__delete-post/${form.loadedSlug}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `delete failed (${res.status})`)
      }
      setForm(emptyForm())
      setSavedSnapshot(null)
      setSlugConfirmed(false)
      setSlugChoice('new')
      setShowDeleteConfirm(false)
      setSaveStatus({ kind: 'saved' })
    } catch (err) {
      // Leave the modal open on error so the user can see the message
      // and decide whether to retry or cancel out.
      setSaveStatus({ kind: 'error', message: String(err.message || err) })
    }
  }

  // Click handler on the preview body. When an <img> is clicked, look
  // up the matching markdown source in form.body and open the resize
  // modal. Clicks on non-image elements are ignored.
  const onPreviewBodyClick = (e) => {
    if (e.target.tagName !== 'IMG') return
    e.preventDefault()
    const src = e.target.getAttribute('src')
    if (!src) return
    const found = findImageMarkdown(form.body, src)
    if (!found) return
    setResizeSnapshot(form.body)
    setResizeTarget(found)
  }

  // Live find-and-replace driven by the resize modal. The modal computes
  // the new markdown each time the user adjusts dimension / value / unit;
  // we run the regex over the current body and swap the matching image
  // markdown in place. The src never changes, so we can re-locate the
  // image on every keystroke without storing extra position state.
  const replaceResizeTarget = (newMarkdown) => {
    if (!resizeTarget) return
    const re = imageRegex(resizeTarget.src)
    setForm((f) => ({ ...f, body: f.body.replace(re, newMarkdown) }))
  }

  const cancelResize = () => {
    if (resizeSnapshot !== null) {
      setForm((f) => ({ ...f, body: resizeSnapshot }))
    }
    setResizeTarget(null)
    setResizeSnapshot(null)
  }

  const applyResize = () => {
    setResizeTarget(null)
    setResizeSnapshot(null)
  }

  // Live preview from the body. Memoized so we don't re-parse on
  // every keystroke when only a different field changes.
  const previewHtml = useMemo(() => marked.parse(form.body || ''), [form.body])

  return (
    <div className="blog-editor-page case-study-page">
      <Navbar onHome={onHome} slug="blog-editor" crumbOverride="Blog editor" hideProgress />

      <main className="blog-editor-layout">
        <section className="blog-editor-main">
          <header className="blog-editor-head">
            <h1>Editor</h1>
            <div className="blog-editor-load">
              <select onChange={onLoad} aria-label="Load an existing post" defaultValue="">
                <option value="" disabled>Load existing…</option>
                {POSTS.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title}{p.draft ? ' (draft)' : ''}
                  </option>
                ))}
              </select>
              <button type="button" onClick={onNew}>New</button>
            </div>
          </header>

          {form.loadedSlug !== null && (
            <span
              className={`blog-editor-status blog-editor-status--${form.loadedDraft ? 'draft' : 'published'}`}
            >
              {form.loadedDraft ? 'Draft' : 'Published'}
            </span>
          )}

          <div className="blog-editor-form">
            <Field label="Title">
              <input value={form.title} onChange={onTitleChange} />
            </Field>
            <Field label="Slug">
              <input value={form.slug} onChange={onSlugChange} />
            </Field>
            <Field label="Date">
              <input type="date" value={form.date} onChange={(e) => update({ date: e.target.value })} />
            </Field>
            <Field label="Excerpt">
              <input
                value={form.excerpt}
                onChange={(e) => update({ excerpt: e.target.value })}
                maxLength={200}
                placeholder="One sentence summary used on the index and in SEO"
              />
            </Field>
            <Field label="Tags">
              <TagsField
                tags={form.tags}
                onChange={(next) => update({ tags: next })}
              />
            </Field>
            <Field label="Hero image">
              <HeroImageField
                heroImage={form.heroImage}
                heroImageAlt={form.heroImageAlt}
                onChange={(patch) => update(patch)}
                onUpload={uploadImage}
              />
            </Field>
            <Field label="Body (markdown)">
              {/* Markdown formatting toolbar above the body field.
                  Image button uses handleImageFile; other buttons
                  manipulate selection through applyToolbarAction. The
                  textarea below also accepts drag-and-drop for images. */}
              <BlogEditorToolbar
                textareaRef={bodyTextareaRef}
                onChange={(next) => setForm((f) => ({ ...f, body: next }))}
                onUploadImage={handleImageFile}
              />
              <textarea
                ref={bodyTextareaRef}
                value={form.body}
                onChange={(e) => update({ body: e.target.value })}
                onDragOver={onBodyDragOver}
                onDrop={onBodyDrop}
                onKeyDown={(e) => {
                  // Keyboard shortcuts for the most common actions.
                  // metaKey on macOS, ctrlKey elsewhere. We accept either
                  // for cross-platform convenience.
                  const mod = e.metaKey || e.ctrlKey
                  if (!mod) return
                  const k = e.key.toLowerCase()
                  if (k === 'b' || k === 'i') {
                    e.preventDefault()
                    applyToolbarAction(k === 'b' ? 'bold' : 'italic', e.currentTarget, (next) =>
                      setForm((f) => ({ ...f, body: next }))
                    )
                  }
                }}
                spellCheck="true"
              />
            </Field>
          </div>

          {slugChanged && (
            <SlugChangePanel
              oldSlug={form.loadedSlug}
              newSlug={form.slug}
              choice={slugChoice}
              setChoice={setSlugChoice}
              confirmed={slugConfirmed}
              setConfirmed={setSlugConfirmed}
            />
          )}

          <div className="blog-editor-actions">
            <button
              type="button"
              className="blog-editor-save-draft"
              disabled={!canSave || saveStatus.kind === 'saving'}
              onClick={() => doSave(true)}
            >
              Save Draft
            </button>
            <button
              type="button"
              className="blog-editor-save-publish"
              disabled={!canSave || saveStatus.kind === 'saving'}
              onClick={() => doSave(false)}
            >
              Save and Publish
            </button>
            {form.loadedSlug !== null && (
              <button
                type="button"
                className="blog-editor-delete"
                onClick={onDeleteClick}
                disabled={saveStatus.kind === 'saving'}
              >
                Delete
              </button>
            )}
            <SaveStatus status={saveStatus} />
          </div>
        </section>

        <aside className="blog-editor-preview">
          <p className="blog-editor-preview-label">Preview</p>
          <header className="blog-post-head">
            <p className="blog-post-date">{form.date || 'YYYY-MM-DD'}</p>
            <h1 className="blog-post-title">{form.title || 'Untitled'}</h1>
            {form.tags.length > 0 && (
              <div className="blog-post-tags">
                {form.tags.map((t) => <TagPill key={t} tag={t} />)}
              </div>
            )}
          </header>
          <div
            className="blog-post-body"
            onClick={onPreviewBodyClick}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </aside>
      </main>

      {toasts.length > 0 && (
        <div className="blog-editor-toast-stack" aria-live="polite">
          {toasts.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`blog-editor-toast blog-editor-toast--${t.kind}`}
              onClick={() => dismissToast(t.id)}
            >
              {t.message}
            </button>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          title={form.title || form.loadedSlug}
          isDeleting={saveStatus.kind === 'saving'}
          errorMessage={saveStatus.kind === 'error' ? saveStatus.message : null}
          onCancel={() => {
            setShowDeleteConfirm(false)
            if (saveStatus.kind === 'error') setSaveStatus({ kind: 'idle' })
          }}
          onConfirm={performDelete}
        />
      )}

      {resizeTarget && (
        <ResizeImageModal
          target={resizeTarget}
          onLiveChange={replaceResizeTarget}
          onCancel={cancelResize}
          onApply={applyResize}
        />
      )}
    </div>
  )
}

// ============================================================
// Image markdown parsing helpers used by the resize modal.
// ============================================================

// Regex-escape a string so it can be embedded in a dynamic RegExp without
// reinterpreting metacharacters in the original (mostly URL paths here).
function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Build a regex that matches the markdown for an image with the given
// src. Captures alt (1), optional title (2), optional {attrs} body (3).
// Tolerates the optional " title " segment and the optional {attrs}.
function imageRegex(src) {
  const esc = escapeRegex(src)
  return new RegExp(
    `!\\[([^\\]]*)\\]\\(${esc}(?:\\s+"([^"]*)")?\\)(?:\\{([^}]+)\\})?`
  )
}

// Find the markdown that produced the image with the given src, parsing
// the components into an object the resize modal can use to rebuild
// the markdown after the user changes width / height.
function findImageMarkdown(body, src) {
  const m = body.match(imageRegex(src))
  if (!m) return null
  return {
    full: m[0],
    alt: m[1],
    src,
    title: m[2] || '',
    attrs: m[3] || '',
  }
}

// Parse an existing {attrs} string into the modal's working state.
// Returns the first width or height it finds; defaults to width=100%
// when nothing useful is present.
function parseInitialAttrs(attrs) {
  if (attrs) {
    for (const piece of attrs.split(/\s+/)) {
      const eq = piece.indexOf('=')
      if (eq < 0) continue
      const k = piece.slice(0, eq).toLowerCase()
      if (k !== 'width' && k !== 'height') continue
      const v = piece.slice(eq + 1)
      const m = v.match(/^(\d+(?:\.\d+)?)(px|%)?$/)
      if (m) {
        return {
          dimension: k,
          value: parseFloat(m[1]),
          unit: m[2] || 'px',
        }
      }
    }
  }
  return { dimension: 'width', value: 100, unit: '%' }
}

// Rebuild the image markdown with the chosen dimension applied.
// dimension === 'none' or value <= 0 strips the {attrs} entirely
// (image renders at its natural size).
function buildImageMarkdown(target, dimension, value, unit) {
  const titleSeg = target.title ? ` "${target.title}"` : ''
  const base = `![${target.alt}](${target.src}${titleSeg})`
  if (dimension === 'none' || !value || value <= 0) return base
  return `${base}{${dimension}=${value}${unit}}`
}

// Styled in-app confirmation dialog for destructive actions. Renders a
// fixed-position backdrop and a centered card. Esc and backdrop click
// both cancel; the Cancel button is the default-focused control so that
// pressing Enter immediately after the modal opens is a safe action.
function DeleteConfirmModal({ title, isDeleting, errorMessage, onCancel, onConfirm }) {
  const cancelRef = useRef(null)

  // Focus the safe-default button on open. requestAnimationFrame defers
  // the focus call until after the element is in the DOM and stable.
  useEffect(() => {
    const id = requestAnimationFrame(() => cancelRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [])

  // Escape closes the modal. Only one listener at a time because the
  // modal is conditionally rendered; the effect is unmounted on close.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !isDeleting) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDeleting, onCancel])

  return (
    <div
      className="blog-editor-confirm-overlay"
      onClick={() => { if (!isDeleting) onCancel() }}
    >
      <div
        className="blog-editor-confirm-card"
        // Clicks on the card itself shouldn't bubble up and trigger the
        // overlay's cancel handler.
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-delete-title"
      >
        <h2 id="blog-delete-title">Delete this post?</h2>
        <p>
          <strong>{title}</strong> will be permanently removed from disk. This cannot be undone.
        </p>
        {errorMessage && (
          <p className="blog-editor-confirm-error">{errorMessage}</p>
        )}
        <div className="blog-editor-confirm-actions">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="blog-editor-confirm-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Returns true if any user-editable field differs from the snapshot
// (for a loaded or saved post) or is non-empty (for a never-saved draft).
//
// The snapshot is captured at the moments the form matches disk: on
// load (mirrors the loaded post) and on successful save (mirrors the
// just-written form). Any other state change (typing, chip add/remove,
// slug edit) leaves the snapshot alone, so dirty flips to true as soon
// as the user touches anything after a save.
function isDirty(form, snapshot) {
  if (snapshot === null) {
    return (
      form.title.trim() !== '' ||
      form.body.trim() !== '' ||
      form.excerpt.trim() !== '' ||
      form.tags.length > 0 ||
      !!form.heroImage
    )
  }
  return (
    form.title !== snapshot.title ||
    form.slug !== snapshot.slug ||
    form.date !== snapshot.date ||
    form.excerpt !== snapshot.excerpt ||
    form.body !== snapshot.body ||
    (form.heroImage || '') !== (snapshot.heroImage || '') ||
    (form.heroImageAlt || '') !== (snapshot.heroImageAlt || '') ||
    !sameArray(form.tags, snapshot.tags)
  )
}

// Build a snapshot object from either a loaded post or the current form.
// Same shape both ways so isDirty can compare uniformly.
function makeSnapshot(src) {
  return {
    title: src.title,
    slug: src.slug,
    date: src.date,
    excerpt: src.excerpt,
    tags: [...src.tags],
    heroImage: src.heroImage || '',
    heroImageAlt: src.heroImageAlt || '',
    body: src.body,
  }
}

function sameArray(a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

// Wraps a labelled form input. Pure visual sugar.
function Field({ label, children }) {
  return (
    <div className="blog-editor-field">
      <label>{label}</label>
      {children}
    </div>
  )
}

// HeroImageField renders the current hero (if any) as a thumbnail with a
// remove button, plus an "Upload hero" trigger and an alt-text field.
// Uploads use the same uploadImage helper as inline body images, so the
// asset lands in the same per-slug folder.
function HeroImageField({ heroImage, heroImageAlt, onChange, onUpload }) {
  const inputRef = useRef(null)
  const onPick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = await onUpload(file)
    if (url) onChange({ heroImage: url })
  }
  return (
    <div className="blog-editor-hero">
      {heroImage ? (
        <div className="blog-editor-hero-current">
          <img src={heroImage} alt={heroImageAlt || ''} />
          <button
            type="button"
            className="blog-editor-hero-remove"
            onClick={() => onChange({ heroImage: '', heroImageAlt: '' })}
            aria-label="Remove hero image"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="blog-editor-upload-btn"
          onClick={() => inputRef.current?.click()}
        >
          ✎ Upload hero
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onPick}
      />
      <input
        className="blog-editor-hero-alt"
        type="text"
        placeholder="Hero alt text (for screen readers and og:image)"
        value={heroImageAlt}
        onChange={(e) => onChange({ heroImageAlt: e.target.value })}
        disabled={!heroImage}
      />
    </div>
  )
}

// TagsField is the chip input with autocomplete. Renders existing tags
// as chips, an inline input for typing new ones, and a suggestion
// dropdown that filters ALL_TAGS by the current input value.
function TagsField({ tags, onChange }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  // Suggestions: existing tags not already added, filtered by prefix.
  const suggestions = useMemo(() => {
    const v = value.trim().toLowerCase()
    return ALL_TAGS
      .filter((t) => !tags.includes(t))
      .filter((t) => v === '' || t.includes(v))
      .slice(0, 8)
  }, [value, tags])

  const commit = (raw) => {
    const next = titleToSlug(raw)
    if (!next) return
    if (tags.includes(next)) {
      setValue('')
      return
    }
    onChange([...tags, next])
    setValue('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit(value)
    } else if (e.key === ',') {
      e.preventDefault()
      commit(value)
    } else if (e.key === 'Backspace' && value === '' && tags.length > 0) {
      onChange(tags.slice(0, -1))
    } else if (e.key === 'Escape') {
      setFocused(false)
    }
  }

  const removeChip = (tag) => {
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div className="blog-editor-tags">
      {tags.map((tag) => (
        <span key={tag} className="blog-editor-chip">
          #{tag}
          <button type="button" onClick={() => removeChip(tag)} aria-label={`Remove tag ${tag}`}>×</button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        // Delay so a click on a suggestion item fires before the
        // dropdown unmounts. 150ms is the conventional wait for this
        // pattern.
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Add a tag, then Enter"
      />
      {focused && suggestions.length > 0 && (
        <div className="blog-editor-tags-suggest" role="listbox">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              role="option"
              onClick={() => {
                commit(tag)
                inputRef.current?.focus()
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// SlugChangePanel renders when the slug field doesn't match the loaded
// post's slug. User picks "save as new" or "move (delete original)" and
// clicks Confirm to lock the choice in. Until confirmed, the save
// buttons are disabled.
function SlugChangePanel({ oldSlug, newSlug, choice, setChoice, confirmed, setConfirmed }) {
  if (confirmed) {
    const summary = choice === 'move'
      ? <>Moving from <code>{oldSlug}</code> to <code>{newSlug}</code>. The original file will be deleted on save.</>
      : <>Saving as a new post at <code>{newSlug}</code>. <code>{oldSlug}</code> stays on disk.</>
    return (
      <div className="blog-editor-slug-panel">
        <p className="blog-editor-slug-panel-title">Slug change ready</p>
        <p>
          {summary}
          <button type="button" onClick={() => setConfirmed(false)}>Change</button>
        </p>
      </div>
    )
  }
  return (
    <div className="blog-editor-slug-panel">
      <p className="blog-editor-slug-panel-title">Slug changed</p>
      <p>
        From <code>{oldSlug}</code> to <code>{newSlug}</code>. How should this be saved?
      </p>
      <div className="blog-editor-slug-options">
        <label>
          <input
            type="radio"
            name="slug-choice"
            value="new"
            checked={choice === 'new'}
            onChange={() => setChoice('new')}
          />
          <span>Save as a new post (keep <code>{oldSlug}</code> alive on disk)</span>
        </label>
        <label>
          <input
            type="radio"
            name="slug-choice"
            value="move"
            checked={choice === 'move'}
            onChange={() => setChoice('move')}
          />
          <span>Move from <code>{oldSlug}</code> (delete the original after writing the new file)</span>
        </label>
      </div>
      <button
        type="button"
        className="blog-editor-slug-confirm"
        onClick={() => setConfirmed(true)}
      >
        Confirm choice
      </button>
    </div>
  )
}

// ResizeImageModal lets the user adjust a single image's width OR
// height (preserving the aspect ratio by leaving the other axis to the
// browser's natural `height: auto`). Changes propagate live to the
// body markdown via the onLiveChange callback, so the preview pane
// reflects the new size on every input. Cancel restores the snapshot.
function ResizeImageModal({ target, onLiveChange, onCancel, onApply }) {
  // Seed working state from the existing {attrs}, if any.
  const initial = useMemo(() => parseInitialAttrs(target.attrs), [target.attrs])
  const [dimension, setDimension] = useState(initial.dimension)
  const [value, setValue] = useState(initial.value)
  const [unit, setUnit] = useState(initial.unit)
  const applyRef = useRef(null)

  // Push the new markdown to the parent on every state change. The
  // parent runs the regex over the current body to find and replace.
  useEffect(() => {
    const md = buildImageMarkdown(target, dimension, value, unit)
    onLiveChange(md)
    // onLiveChange is recreated on every parent render but closes over
    // the latest setForm; intentionally omitted from deps to avoid
    // re-running on parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, dimension, value, unit])

  // Esc cancels. Focus the Apply button on open (safe default since
  // changes apply live; Enter just commits whatever's already showing).
  useEffect(() => {
    const id = requestAnimationFrame(() => applyRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const disabled = dimension === 'none'
  const previewMd = buildImageMarkdown(target, dimension, value, unit)

  return (
    <div className="blog-editor-confirm-overlay" onClick={onCancel}>
      <div
        className="blog-editor-resize-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resize-title"
      >
        <h2 id="resize-title">Resize image</h2>
        <div className="blog-editor-resize-thumb">
          <img src={target.src} alt={target.alt || ''} />
        </div>

        <div className="blog-editor-resize-row">
          <span className="blog-editor-resize-label">Dimension</span>
          <label>
            <input
              type="radio"
              name="resize-dim"
              checked={dimension === 'width'}
              onChange={() => setDimension('width')}
            />
            <span>Width</span>
          </label>
          <label>
            <input
              type="radio"
              name="resize-dim"
              checked={dimension === 'height'}
              onChange={() => setDimension('height')}
            />
            <span>Height</span>
          </label>
          <label>
            <input
              type="radio"
              name="resize-dim"
              checked={dimension === 'none'}
              onChange={() => setDimension('none')}
            />
            <span>Original</span>
          </label>
        </div>

        <div className="blog-editor-resize-row">
          <span className="blog-editor-resize-label">Value</span>
          <input
            type="number"
            min="1"
            value={value}
            onChange={(e) => setValue(Math.max(0, parseFloat(e.target.value) || 0))}
            disabled={disabled}
            className="blog-editor-resize-value"
          />
          <label>
            <input
              type="radio"
              name="resize-unit"
              checked={unit === 'px'}
              onChange={() => setUnit('px')}
              disabled={disabled}
            />
            <span>px</span>
          </label>
          <label>
            <input
              type="radio"
              name="resize-unit"
              checked={unit === '%'}
              onChange={() => setUnit('%')}
              disabled={disabled}
            />
            <span>%</span>
          </label>
        </div>

        <p className="blog-editor-resize-note">
          Only one dimension is set so the other axis stays auto and the aspect ratio is preserved.
        </p>
        <pre className="blog-editor-resize-md">{previewMd}</pre>

        <div className="blog-editor-confirm-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button
            ref={applyRef}
            type="button"
            onClick={onApply}
            className="blog-editor-resize-apply"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

// SaveStatus shows the inline message next to the action buttons.
function SaveStatus({ status }) {
  if (status.kind === 'idle') return null
  if (status.kind === 'saving') {
    return <span className="blog-editor-status-msg">Saving…</span>
  }
  if (status.kind === 'saved') {
    return <span className="blog-editor-status-msg blog-editor-status-msg--success">Saved ✓</span>
  }
  return (
    <span className="blog-editor-status-msg blog-editor-status-msg--error">
      {status.message}
    </span>
  )
}
