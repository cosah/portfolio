import { useEffect } from 'react'

export default function useScrollReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll('.case-study-page section')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('will-reveal')
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
    )

    sections.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top > window.innerHeight * 0.9) {
        el.classList.add('will-reveal')
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])
}
