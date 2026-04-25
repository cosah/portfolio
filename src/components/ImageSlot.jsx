export default function ImageSlot({ label, children }) {
  return (
    <div className="image-slot">
      {label && <span className="slot-label">{label}</span>}
      {children}
    </div>
  )
}
