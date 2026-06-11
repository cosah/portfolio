// PullQuote renders a participant quote with optional attribution metadata.
// Used in research sections to surface what users actually said. Uses a
// semantic <blockquote> element so screen readers announce it as a quote.

export default function PullQuote({ id, who, context, ref, cite, children }) {
  return (
    <div className="quote-block">
      <div className="meta">
        {id && <span className="id">{id}</span>}
        {who && <span>{who}</span>}
        {context && <span>{context}</span>}
        {/* Fallback: if neither who nor id was provided, show the cite
            string instead so the quote isn't anonymous. */}
        {!who && !id && cite && <span>{cite}</span>}
      </div>
      {/* Semantic <blockquote> for the quote text itself. CSS styles it
          with the large indented appearance, but the element type is
          what matters for screen readers and document outlines. */}
      <blockquote>{children}</blockquote>
      <div className="marker">
        {ref && <span className="ref">{ref}</span>}
      </div>
    </div>
  )
}
