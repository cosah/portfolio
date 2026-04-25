export default function VideoSection({ title, description, mp4, mov }) {
  return (
    <div className="video-section">
      <h3>{title}</h3>
      <p>{description}</p>
      <video
        controls
        playsInline
        style={{ width: '100%', maxWidth: '360px', borderRadius: '8px', margin: '0 auto', display: 'block' }}
      >
        {mp4 && <source src={mp4} type="video/mp4" />}
        {mov && <source src={mov} type="video/quicktime" />}
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
