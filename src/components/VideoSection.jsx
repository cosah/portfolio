export default function VideoSection({ title, description, mp4, mov, maxWidth = '360px' }) {
  return (
    <div className="video-section">
      {title && <h3>{title}</h3>}
      {description && <p className="desc">{description}</p>}
      <video controls playsInline style={{ maxWidth, margin: '0 auto' }}>
        {mp4 && <source src={mp4} type="video/mp4" />}
        {mov && <source src={mov} type="video/quicktime" />}
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
