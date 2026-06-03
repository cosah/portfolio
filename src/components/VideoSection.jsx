export default function VideoSection({
  title,
  description,
  mp4,
  mov,
  maxWidth = '360px',
  cropPct = 0,
  aspectRatio,
  responsiveHeight = false,
}) {
  const isCropped = cropPct > 0
  const scale = isCropped ? 1 / (1 - 2 * cropPct) : 1

  const sources = (
    <>
      {mp4 && <source src={mp4} type="video/mp4" />}
      {mov && <source src={mov} type="video/quicktime" />}
      Your browser does not support the video tag.
    </>
  )

  return (
    <div className="video-section">
      {title && <h3>{title}</h3>}
      {description && <p className="desc">{description}</p>}
      {isCropped ? (
        <div
          className="video-frame video-frame--crop"
          style={{ maxWidth, margin: '0 auto', aspectRatio }}
        >
          <video
            controls
            playsInline
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          >
            {sources}
          </video>
        </div>
      ) : (
        <video
          controls
          playsInline
          className={responsiveHeight ? 'video-responsive' : undefined}
          style={{ maxWidth, margin: '0 auto' }}
        >
          {sources}
        </video>
      )}
    </div>
  )
}
