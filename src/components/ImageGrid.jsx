export default function ImageGrid({ columns = 4, children }) {
  return (
    <div
      className="image-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  )
}
