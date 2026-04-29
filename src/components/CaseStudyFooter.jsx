export default function CaseStudyFooter({ children, slug }) {
  return (
    <footer className="doc-footer">
      <span className="end-marker">end of document · {slug || 'case-study'}</span>
      <span>{children || 'anthony.shephard · 2026'}</span>
    </footer>
  )
}
