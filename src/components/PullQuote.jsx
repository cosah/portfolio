export default function PullQuote({ cite, children }) {
  return (
    <blockquote className="pull-quote">
      <p>{children}</p>
      {cite && <cite>{cite}</cite>}
    </blockquote>
  )
}
