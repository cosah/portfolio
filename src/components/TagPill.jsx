// TagPill is the reusable tag chip used on blog index cards, post pages,
// the editor preview, and the sidebar. Each tag deterministically maps to
// one of five accent colors so the same tag is the same color everywhere
// on the site, which makes scanning lists of tag pills much easier.

// Accent CSS variables defined in variables.css. The three site-wide
// accents give just enough variety to differentiate tags at a glance
// without expanding the design palette. Tags sharing a color is OK,
// the # prefix and the text itself carry the identity.
const ACCENTS = ['info', 'good', 'warn']

// Hash a string into one of the accent indexes. djb2-style: small,
// deterministic, fine for color bucketing (we don't need a secure hash).
// The same tag string always gets the same bucket, so colors are stable
// across page navigations and rebuilds.
function hashAccent(tag) {
  let h = 5381
  for (let i = 0; i < tag.length; i++) {
    h = ((h << 5) + h + tag.charCodeAt(i)) | 0
  }
  return ACCENTS[Math.abs(h) % ACCENTS.length]
}

export default function TagPill({ tag, active = false, onClick, small = false }) {
  const accent = hashAccent(tag)
  const className = [
    'tag-pill',
    `tag-pill--${accent}`,
    active ? 'is-active' : '',
    small ? 'tag-pill--small' : '',
  ].filter(Boolean).join(' ')

  // Interactive vs static: when an onClick is supplied we render a real
  // <button> so keyboard users can activate it. When it's a display-only
  // pill (sidebar, editor preview), we render a <span> with no semantics.
  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        aria-pressed={active}
      >
        <span aria-hidden="true">#</span>{tag}
      </button>
    )
  }
  return (
    <span className={className}>
      <span aria-hidden="true">#</span>{tag}
    </span>
  )
}
