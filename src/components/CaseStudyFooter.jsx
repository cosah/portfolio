export default function CaseStudyFooter({ children }) {
  return (
    <footer className="case-study-footer">
      <p>{children || 'Anthony Shephard · University of Michigan · 2025'}</p>
    </footer>
  )
}
