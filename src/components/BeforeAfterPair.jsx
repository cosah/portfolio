function Panel({ kind, label, tag, src, alt, placeholder, annotations, aspect }) {
  return (
    <div className={`panel ${kind}`}>
      <div className="label-bar">
        <span>{label}</span>
        {tag && <span className="tag">{tag}</span>}
      </div>
      <div
        className={`frame aspect-${aspect}`}
        role={src ? 'img' : undefined}
        aria-label={src ? (alt || label) : undefined}
      >
        {src ? (
          <img src={src} alt={alt || label} />
        ) : (
          <span aria-hidden="true">[ {placeholder} ]</span>
        )}
      </div>
      {annotations && annotations.length > 0 && (
        <div className="annotations">
          {annotations.map((text, i) => (
            <div key={i} className="ann">
              <span className="ann-num">{String.fromCharCode(97 + i)}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BeforeAfterPair({ before, after, aspect = '9x16' }) {
  return (
    <div className="ba-section">
      <div className="ba-pair">
        <Panel kind="before" aspect={aspect} {...before} />
        <Panel kind="after" aspect={aspect} {...after} />
      </div>
    </div>
  )
}
