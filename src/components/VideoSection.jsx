// VideoSection wraps every embedded video on the site. Supports optional
// CSS-only cropping (zooming past the video's visible edges without re-
// encoding the file) and responsive height behavior that caps to 50vh on
// large screens so a vertical phone demo doesn't dominate the viewport.

export default function VideoSection({
  title,
  description,
  mp4,
  mov,
  maxWidth = '360px',
  // cropPct between 0 and 0.5. A value of 0.1 means crop 10 percent off
  // each edge using CSS transform scale. Useful for hiding device chrome
  // captured in the source recording.
  cropPct = 0,
  // CSS aspect-ratio for the crop frame. Only relevant when cropPct > 0.
  aspectRatio,
  // When true, the video height caps to 100vh on mobile, 50vh on screens
  // above 1100px. Width auto-adjusts to maintain aspect ratio.
  responsiveHeight = false,
}) {
  const isCropped = cropPct > 0
  // Compute the scale factor needed so that the cropped area still fills
  // the frame. If we crop 10% off each side, the remaining content is 80%
  // of the original. Scaling by 1/0.8 = 1.25 brings it back to full size.
  const scale = isCropped ? 1 / (1 - 2 * cropPct) : 1

  // Source elements live inside the <video> tag. The browser picks the
  // first source with a supported type. Quicktime (.mov) fallback is for
  // older iOS recordings. The text after the sources is shown if no
  // codec is supported (extremely rare in 2026).
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
        // Cropped variant: an outer frame establishes the visible bounds
        // and overflow:hidden, while the inner video is scaled so its
        // visible edges sit just outside the frame. This crops without
        // re-encoding the file.
        <div
          className="video-frame video-frame--crop"
          style={{ maxWidth, margin: '0 auto', aspectRatio }}
        >
          <video
            controls
            // playsInline prevents iOS Safari from auto-fullscreening on
            // playback, which would otherwise hijack the page.
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
          // The responsive class triggers the CSS media-query-based height
          // cap. The unset variant just uses the natural sizing.
          className={responsiveHeight ? 'video-responsive' : undefined}
          style={{ maxWidth, margin: '0 auto' }}
        >
          {sources}
        </video>
      )}
    </div>
  )
}
