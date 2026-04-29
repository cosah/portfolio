export default function GridFrames({ items, cols = 4, aspect = '9x16' }) {
  const colsClass = cols === 3 ? 'cols-3' : cols === 2 ? 'cols-2' : ''
  return (
    <div className={`grid-frames ${colsClass}`.trim()}>
      {items.map(({ ix, name, src, alt, label, desc, contain }, i) => (
        <div key={i} className="item">
          <div
            className={`frame aspect-${aspect}${contain ? ' contain' : ''}`}
            role={src ? 'img' : undefined}
            aria-label={src ? (alt || name || label || '') : undefined}
          >
            {src ? (
              <img src={src} alt={alt || name || label || ''} />
            ) : (
              <span aria-hidden="true">{label || name}</span>
            )}
          </div>
          {(ix || name) && (
            <p className="label">
              {ix && <span className="ix">{ix}</span>}
              {name && <span className="name">{name}</span>}
            </p>
          )}
          {desc && <p className="desc">{desc}</p>}
        </div>
      ))}
    </div>
  )
}
