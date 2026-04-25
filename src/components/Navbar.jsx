import ProgressBar from './ProgressBar'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Navbar({ onHome, label }) {
  useScrollReveal()

  return (
    <>
    <ProgressBar />
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-back" onClick={onHome}>
          ← All Work
        </button>
        {label && <span className="navbar-label">{label}</span>}
        <div className="navbar-links">
          <a
            className="navbar-link"
            href="https://www.linkedin.com/in/anthony-shephard/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="navbar-link"
            href="mailto:antshep@umich.edu"
          >
            Email
          </a>
        </div>
      </div>
    </nav>
    </>
  )
}
