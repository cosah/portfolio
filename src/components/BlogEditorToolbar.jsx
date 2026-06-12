// BlogEditorToolbar renders a row of markdown formatting buttons above
// the body textarea. Each button operates on the textarea's current
// selection (wraps / prefixes / inserts) and restores the cursor or
// selection to a sensible spot afterward.
//
// Keyboard shortcuts (cmd+b, cmd+i, cmd+k for bold / italic / link)
// are attached by BlogEditor via a keydown listener on the textarea
// using the same `apply` action set exposed here.

import { useEffect, useRef, useState } from 'react'

// Each action describes how to transform the textarea given its current
// selection. Most are "wrap selection in prefix/suffix"; a few are
// line-level (prefix the start of every selected line).
//
// Returning `{ before, after, selStart, selEnd }`:
//   before / after — string segments to write back into the textarea
//                    (replacing the selected range)
//   selStart       — new cursor or selection-start position
//   selEnd         — new cursor or selection-end position
//
// All positions are relative to the start of the produced before+after.
function wrap(text, prefix, suffix = prefix) {
  // Empty selection: drop a placeholder pair, place cursor between.
  if (!text) {
    return { value: prefix + suffix, selStart: prefix.length, selEnd: prefix.length }
  }
  const value = prefix + text + suffix
  return { value, selStart: prefix.length, selEnd: prefix.length + text.length }
}

// Prefix every line in `text` with `prefix`. Used by quote / list buttons.
function prefixLines(text, prefix) {
  if (!text) {
    return { value: prefix, selStart: prefix.length, selEnd: prefix.length }
  }
  const value = text
    .split('\n')
    .map((line) => prefix + line)
    .join('\n')
  return { value, selStart: 0, selEnd: value.length }
}

// The set of formatting actions. Each `key` matches the `data-action`
// on the corresponding button so keyboard shortcuts can target by name.
const ACTIONS = {
  bold: (sel) => wrap(sel, '**'),
  italic: (sel) => wrap(sel, '*'),
  heading: (sel) => {
    // Cycle the line's heading level: none -> ## -> ### -> none.
    // Operates on the whole first-line of the selection.
    const m = sel.match(/^(#{2,3})\s/)
    if (m && m[1] === '##') return { value: sel.replace(/^##\s/, '### '), selStart: 0, selEnd: sel.length + 1 }
    if (m && m[1] === '###') return { value: sel.replace(/^###\s/, ''), selStart: 0, selEnd: sel.length - 4 }
    return { value: '## ' + sel, selStart: 3, selEnd: 3 + sel.length }
  },
  code: (sel) => wrap(sel, '`'),
  codeblock: (sel) => {
    const inner = sel || 'code'
    const value = '```\n' + inner + '\n```'
    return { value, selStart: 4, selEnd: 4 + inner.length }
  },
  quote: (sel) => prefixLines(sel || 'quoted text', '> '),
  ul: (sel) => prefixLines(sel || 'item', '- '),
  ol: (sel) => {
    if (!sel) return { value: '1. item', selStart: 3, selEnd: 7 }
    const lines = sel.split('\n')
    const value = lines.map((line, i) => `${i + 1}. ${line}`).join('\n')
    return { value, selStart: 0, selEnd: value.length }
  },
}

// Operate on the textarea by reading its current selection, asking the
// action for replacement text + cursor positions, then writing those
// back. Returns the absolute cursor positions in the new full text so
// the caller can restore them.
function applyAction(textarea, action) {
  const fullValue = textarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const sel = fullValue.slice(start, end)
  const result = action(sel)
  const newFull = fullValue.slice(0, start) + result.value + fullValue.slice(end)
  return {
    newValue: newFull,
    cursorStart: start + result.selStart,
    cursorEnd: start + result.selEnd,
  }
}

// Single-source apply hook used by both the buttons and the keyboard
// shortcuts in BlogEditor. Exported as a helper.
export function applyToolbarAction(actionName, textarea, onChange) {
  const action = ACTIONS[actionName]
  if (!action || !textarea) return
  const { newValue, cursorStart, cursorEnd } = applyAction(textarea, action)
  onChange(newValue)
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(cursorStart, cursorEnd)
  })
}

// Wrap a selection in an HTML span carrying a site-token class. The
// color toolbar inserts these so authors can highlight a word or phrase
// in info / good / warn without leaving markdown.
function applyColor(textarea, onChange, accent) {
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const sel = textarea.value.slice(start, end) || 'text'
  const prefix = `<span class="blog-accent-${accent}">`
  const suffix = '</span>'
  const inner = sel
  const replacement = prefix + inner + suffix
  const newFull = textarea.value.slice(0, start) + replacement + textarea.value.slice(end)
  onChange(newFull)
  const innerStart = start + prefix.length
  const innerEnd = innerStart + inner.length
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(innerStart, innerEnd)
  })
}

// Insert a link at the cursor: `[selection or 'text'](url)` with the
// URL portion selected so the user can paste over it immediately.
function applyLink(textarea, onChange, url) {
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const sel = textarea.value.slice(start, end) || 'text'
  const replacement = `[${sel}](${url || 'https://'})`
  const newFull = textarea.value.slice(0, start) + replacement + textarea.value.slice(end)
  onChange(newFull)
  // Select the URL portion (or place cursor at the end of it) so the
  // user can immediately paste.
  const urlStart = start + sel.length + 3 // [sel](
  const urlEnd = urlStart + (url || 'https://').length
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(urlStart, urlEnd)
  })
}

export default function BlogEditorToolbar({ textareaRef, onChange, onUploadImage }) {
  // Color popover anchored to the color button. null when closed.
  const [colorOpen, setColorOpen] = useState(false)
  // Link prompt: when non-null, renders an inline input below the toolbar.
  const [linkOpen, setLinkOpen] = useState(false)
  const linkInputRef = useRef(null)
  const colorBtnRef = useRef(null)
  // Hidden file input for the image button; same pattern as the body
  // toolbar in BlogEditor.
  const imageInputRef = useRef(null)

  // Close popovers on Esc and on outside clicks.
  useEffect(() => {
    if (!colorOpen && !linkOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setColorOpen(false)
        setLinkOpen(false)
      }
    }
    const onClickOutside = (e) => {
      if (
        colorOpen &&
        colorBtnRef.current &&
        !colorBtnRef.current.parentElement?.contains(e.target)
      ) {
        setColorOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [colorOpen, linkOpen])

  // Auto-focus the link input when it opens.
  useEffect(() => {
    if (linkOpen) {
      requestAnimationFrame(() => linkInputRef.current?.focus())
    }
  }, [linkOpen])

  const ta = () => textareaRef.current
  const dispatch = (name) => applyToolbarAction(name, ta(), onChange)

  const onLinkSubmit = (e) => {
    e.preventDefault()
    const url = linkInputRef.current?.value || 'https://'
    applyLink(ta(), onChange, url)
    setLinkOpen(false)
  }

  const onColorPick = (accent) => {
    applyColor(ta(), onChange, accent)
    setColorOpen(false)
  }

  const onImagePick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !onUploadImage) return
    await onUploadImage(file)
  }

  return (
    <div className="blog-editor-toolbar">
      <div className="blog-editor-toolbar-row">
        <ToolbarButton title="Bold (⌘B)" onClick={() => dispatch('bold')}>B</ToolbarButton>
        <ToolbarButton title="Italic (⌘I)" onClick={() => dispatch('italic')} italic>I</ToolbarButton>
        <ToolbarButton title="Heading" onClick={() => dispatch('heading')}>H</ToolbarButton>
        <ToolbarButton title="Link (⌘K)" onClick={() => setLinkOpen((v) => !v)}>↗</ToolbarButton>
        <ToolbarButton title="Inline code" onClick={() => dispatch('code')} mono>{'`'}</ToolbarButton>
        <ToolbarButton title="Code block" onClick={() => dispatch('codeblock')} mono>{'{ }'}</ToolbarButton>
        <ToolbarButton title="Blockquote" onClick={() => dispatch('quote')}>{'"'}</ToolbarButton>
        <ToolbarButton title="Bulleted list" onClick={() => dispatch('ul')}>•</ToolbarButton>
        <ToolbarButton title="Numbered list" onClick={() => dispatch('ol')}>1.</ToolbarButton>
        <ToolbarButton title="Image upload" onClick={() => imageInputRef.current?.click()}>🖼</ToolbarButton>
        <span className="blog-editor-toolbar-color-wrap">
          <ToolbarButton
            ref={colorBtnRef}
            title="Text color (HTML span with site accent)"
            onClick={() => setColorOpen((v) => !v)}
          >
            ●
          </ToolbarButton>
          {colorOpen && (
            <div className="blog-editor-color-popover" role="menu">
              <button
                type="button"
                className="blog-editor-color-swatch blog-editor-color-swatch--info"
                onClick={() => onColorPick('info')}
                aria-label="Info (blue)"
              />
              <button
                type="button"
                className="blog-editor-color-swatch blog-editor-color-swatch--good"
                onClick={() => onColorPick('good')}
                aria-label="Good (yellow)"
              />
              <button
                type="button"
                className="blog-editor-color-swatch blog-editor-color-swatch--warn"
                onClick={() => onColorPick('warn')}
                aria-label="Warn (orange)"
              />
            </div>
          )}
        </span>
      </div>
      {linkOpen && (
        <form className="blog-editor-link-row" onSubmit={onLinkSubmit}>
          <input
            ref={linkInputRef}
            type="url"
            placeholder="URL (https://...)"
            defaultValue="https://"
          />
          <button type="submit">Insert link</button>
          <button type="button" onClick={() => setLinkOpen(false)}>Cancel</button>
        </form>
      )}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onImagePick}
      />
    </div>
  )
}

// Small button used for every toolbar action. React 19 lets refs flow
// through as regular props, no forwardRef ceremony required.
function ToolbarButton({ title, onClick, children, italic, mono, ref }) {
  return (
    <button
      ref={ref}
      type="button"
      className={`blog-editor-toolbar-btn${italic ? ' is-italic' : ''}${mono ? ' is-mono' : ''}`}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  )
}
