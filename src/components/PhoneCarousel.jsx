import { useState, useEffect } from 'react'

export default function PhoneCarousel({ screens }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    screens.forEach(s => {
      const img = new Image()
      img.src = s.src
    })
  }, [screens])
  const prev = () => setIndex(i => (i - 1 + screens.length) % screens.length)
  const next = () => setIndex(i => (i + 1) % screens.length)

  return (
    <div className="phone-carousel">
      <div className="phone-frame" onClick={next} style={{ cursor: 'pointer' }}>
        <img
          src={screens[index].src}
          alt={screens[index].label}
          className="phone-screen"
        />
      </div>
      <div className="phone-carousel-nav">
        <button className="carousel-arrow" onClick={prev} aria-label="Previous screen">←</button>
        <div className="carousel-dots">
          {screens.map((s, i) => (
            <button
              key={i}
              className={`carousel-dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={s.label}
            />
          ))}
        </div>
        <button className="carousel-arrow" onClick={next} aria-label="Next screen">→</button>
      </div>
      <p className="phone-carousel-label">{screens[index].label}</p>
    </div>
  )
}
