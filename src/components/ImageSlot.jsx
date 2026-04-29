export default function ImageSlot({
  id,
  caption,
  label,
  children,
  src,
  alt,
  aspect = '16x9',
  contain,
  phone,
}) {
  const aspectClass = phone ? 'aspect-9x16' : `aspect-${aspect}`
  const captionText = caption || label

  return (
    <figure className="figure">
      {(id || captionText) && (
        <figcaption className="figure-meta">
          {id && <span className="id">FIG. {id}</span>}
          <span>{captionText}</span>
        </figcaption>
      )}
      <div
        className={`figure-frame ${aspectClass}${contain ? ' contain' : ''}${src ? '' : ' placeholder'}`}
        role={src ? 'img' : undefined}
        aria-label={src ? (alt || captionText || '') : undefined}
      >
        {src ? (
          <img src={src} alt={alt || captionText || ''} />
        ) : (
          <span aria-hidden="true">[ {children || captionText || 'figure'} ]</span>
        )}
      </div>
    </figure>
  )
}
