// ImageGrid is a thin layout wrapper: an N-column grid you can drop any
// children into (typically ImageSlot or other figure components). Unlike
// GridFrames (which is data-driven), this composes by children, so it's
// useful when the items in the grid have different shapes or props.

export default function ImageGrid({ columns = 4, children }) {
  // Translate the columns prop into a CSS class modifier. Default 4
  // columns needs no extra class. The CSS for .grid-frames sets the
  // default; .cols-3 and .cols-2 override the grid-template-columns rule.
  const cls = columns === 3 ? 'cols-3' : columns === 2 ? 'cols-2' : ''
  return <div className={`grid-frames ${cls}`.trim()}>{children}</div>
}
