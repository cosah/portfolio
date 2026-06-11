// CaseStudyFooter is the small marker at the bottom of each case study.
// Renders as a typewriter "end of document" line on the left and credits
// on the right. Functional rather than navigational, since the navbar
// at the top already handles inter-case-study movement.

export default function CaseStudyFooter({ children, slug }) {
  return (
    <footer className="doc-footer">
      {/* Mirrors the typewriter aesthetic of section labels and TOC items.
          Falls back to 'case-study' if no slug is passed. */}
      <span className="end-marker">end of document · {slug || 'case-study'}</span>
      {/* Optional override via children, else default credit line.
          Examples of children: a custom credits block or a sign-off note. */}
      <span>{children || 'anthony.shephard · 2026'}</span>
    </footer>
  )
}
