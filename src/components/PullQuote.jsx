export default function PullQuote({ id, who, context, ref, cite, children }) {
  return (
    <div className="quote-block">
      <div className="meta">
        {id && <span className="id">{id}</span>}
        {who && <span>{who}</span>}
        {context && <span>{context}</span>}
        {!who && !id && cite && <span>{cite}</span>}
      </div>
      <blockquote>{children}</blockquote>
      <div className="marker">
        {ref && <span className="ref">{ref}</span>}
      </div>
    </div>
  )
}
