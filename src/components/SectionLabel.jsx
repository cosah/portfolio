export default function SectionLabel({ num, children }) {
  return (
    <p className="section-id">
      {num != null && <span className="num">{String(num).padStart(2, '0')}</span>}
      {num != null ? ' · ' : ''}
      {children}
    </p>
  )
}
