// Standalone progress bar component. Not currently used as the main reading
// indicator (Navbar has its own inline version with a11y attributes), but
// kept around as a self-contained example of the scroll-tracking pattern.

import { useState, useEffect } from 'react'

export default function ProgressBar() {
  // Progress as a percentage from 0 to 100. The bar's width style is bound
  // to this number, so the UI updates whenever state changes.
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY
      // Total scrollable distance is the document height minus the viewport.
      // If the document doesn't overflow the viewport, scrollable distance
      // is 0 and the bar stays at 0%.
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    // passive: true is a perf hint to the browser that this listener
    // won't call preventDefault, so the browser can scroll without waiting.
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return <div className="progress-bar" style={{ width: `${progress}%` }} />
}
