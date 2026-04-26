export default function ImageSlot({ label, children, src, alt, phone }) {
  if (src) {
    return (
      <div className={`image-slot image-slot--filled${phone ? ' image-slot--phone' : ''}`}>
        {label && <span className="slot-label">{label}</span>}
        <img src={src} alt={alt || label || ''} className="slot-image" />
      </div>
    )
  }
  return (
    <div className="image-slot">
      {label && <span className="slot-label">{label}</span>}
      {children}
    </div>
  )
}
