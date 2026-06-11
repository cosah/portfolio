// SectionLabel is the small monospace eyebrow that sits above each major
// section heading in case studies ("01 · The problem"). It pairs with the
// TableOfContents component, which uses the same numbering, so users can
// connect the two visually.

export default function SectionLabel({ num, children }) {
  return (
    <p className="section-id">
      {/* Zero-pad single-digit numbers. num != null deliberately checks
          for both null and undefined while letting 0 through, since 0
          is a valid section number (intro). */}
      {num != null && <span className="num">{String(num).padStart(2, '0')}</span>}
      {num != null ? ' · ' : ''}
      {children}
    </p>
  )
}
