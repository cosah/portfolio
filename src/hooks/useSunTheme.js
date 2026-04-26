import { useEffect } from 'react'

const CACHE_KEY = 'sun-theme'
const CACHE_TTL = 15 * 60 * 1000

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { theme, ts } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_TTL) return theme
  } catch {}
  return null
}

function setCache(theme) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ theme, ts: Date.now() }))
  } catch {}
}

async function getCoords() {
  const r = await fetch('https://ipapi.co/json/')
  const d = await r.json()
  if (!d.latitude || !d.longitude) throw new Error('no coords')
  return { lat: d.latitude, lng: d.longitude }
}

async function isDaytime(lat, lng) {
  const today = new Date().toISOString().slice(0, 10)
  const r = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=${today}`
  )
  const d = await r.json()
  if (d.status !== 'OK') throw new Error('sunrise api error')
  const now = Date.now()
  const sunrise = new Date(d.results.sunrise).getTime()
  const sunset = new Date(d.results.sunset).getTime()
  return now >= sunrise && now < sunset
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function useSunTheme() {
  useEffect(() => {
    // Apply cached theme immediately to reduce flash
    const cached = getCached()
    if (cached) applyTheme(cached)

    let cancelled = false
    ;(async () => {
      try {
        const { lat, lng } = await getCoords()
        if (cancelled) return
        const day = await isDaytime(lat, lng)
        if (cancelled) return
        const theme = day ? 'light' : 'dark'
        applyTheme(theme)
        setCache(theme)
      } catch {
        // Silently fail — cached or no attribute = light mode (default)
      }
    })()

    return () => { cancelled = true }
  }, [])
}
