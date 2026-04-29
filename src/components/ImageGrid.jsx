export default function ImageGrid({ columns = 4, children }) {
  const cls = columns === 3 ? 'cols-3' : columns === 2 ? 'cols-2' : ''
  return <div className={`grid-frames ${cls}`.trim()}>{children}</div>
}
