import { useState } from 'react'
import Navbar from '../components/Navbar'

const SPECS = [
  { k: 'Location', v: '[Ann Arbor, MI]' },
  { k: 'Time zone', v: '[EST · UTC−5]' },
  { k: 'Status', v: '[Final semester · grad Apr 2026]' },
  { k: 'Looking for', v: '[PM / UX roles, Bay Area or remote]' },
  { k: 'Right now', v: '[whatever you\'re obsessed with]' },
  { k: 'Coffee', v: '[order]' },
]

const NOW = [
  { tag: 'BOOK', label: 'Reading', value: '[Title · Author]', note: '[one-line take]' },
  { tag: 'SCREEN', label: 'Watching', value: '[Show or film]', note: '[one-line take]' },
  { tag: 'AUDIO', label: 'On loop', value: '[Album · Artist]', note: '[one-line take]' },
  { tag: 'SHIP', label: 'Building', value: '[Side project]', note: '[what it does]' },
]

const HOT_TAKES = [
  { num: '01', title: '[Hot take #1]', heat: 3, body: '[Your reasoning. Two-ish sentences.]' },
  { num: '02', title: '[Hot take #2]', heat: 4, body: '[Your reasoning. Two-ish sentences.]' },
  { num: '03', title: '[Hot take #3]', heat: 5, body: '[The one that will get you in trouble.]' },
  { num: '04', title: '[Mild take, but I\'ll defend it]', heat: 2, body: '[Your reasoning. Two-ish sentences.]' },
]

const FIELD = [
  { caption: '[Place / moment 01]' },
  { caption: '[Place / moment 02]' },
  { caption: '[Place / moment 03]' },
  { caption: '[Place / moment 04]' },
  { caption: '[Place / moment 05]' },
  { caption: '[Place / moment 06]' },
]

const LOADOUT = [
  { slot: 'Laptop', item: '[MacBook Pro · M-series]' },
  { slot: 'Phone', item: '[iPhone]' },
  { slot: 'Design', item: 'Figma · FigJam' },
  { slot: 'Code', item: '[VS Code · Claude Code]' },
  { slot: 'Notes', item: '[notion / obsidian / ...]' },
  { slot: 'Audio', item: '[headphones]' },
  { slot: 'Camera', item: '[the one in your pocket]' },
  { slot: 'Backpack', item: '[brand · model]' },
]

const ORIGINS = [
  { ix: 'A', tilt: -4 },
  { ix: 'B', tilt: 3 },
  { ix: 'C', tilt: -2 },
]

export default function About({ onHome }) {
  const [openTake, setOpenTake] = useState(-1)

  return (
    <div className="about-page case-study-page">
      <a href="#about-main" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="about" />

      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-text">
            <p className="about-eyebrow">Dossier · off the clock</p>
            <h1 className="about-title">
              [Anthony Shephard],<br />
              <em>[a one-line tagline about who you are]</em>
            </h1>
            <p className="about-lead">
              [Two or three sentences about who you are when you're not building portfolios. Show some range. The curiosity, the hobbies, the things you'd talk about over a beer.]
            </p>
          </div>
          <aside className="about-specs">
            <div className="about-specs-head">↳ SPECS</div>
            {SPECS.map(({ k, v }) => (
              <div key={k} className="about-specs-row">
                <span>{k.toLowerCase()}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <main id="about-main" className="about-main">
        {/* CURRENTLY */}
        <section className="about-section">
          <header className="about-section-head">
            <span className="about-section-num">01</span>
            <h2>Currently</h2>
            <span className="about-section-meta">updated [date]</span>
          </header>
          <div className="now-grid">
            {NOW.map(({ tag, label, value, note }) => (
              <article key={label} className="now-card">
                <div className="now-tag">{tag}</div>
                <div className="now-label">{label}</div>
                <div className="now-value">{value}</div>
                <div className="now-img placeholder">[cover image]</div>
                <p className="now-note">{note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ORIGINS */}
        <section className="about-section">
          <header className="about-section-head">
            <span className="about-section-num">02</span>
            <h2>Origins</h2>
            <span className="about-section-meta">the long way around</span>
          </header>
          <div className="origins-grid">
            <div className="origins-text">
              <p>[Where you grew up. The thing about where you grew up that shaped you. The detour you took.]</p>
              <p>[The first thing you remember being obsessed with. The next thing. The thing that brought you here.]</p>
              <p>[The version of you that would surprise everyone in this room.]</p>
            </div>
            <div className="origins-collage" aria-hidden="true">
              {ORIGINS.map(({ ix, tilt }, i) => (
                <div
                  key={ix}
                  className={`origin-card origin-card--${i + 1} placeholder`}
                  style={{ '--tilt': `${tilt}deg` }}
                >
                  [img {ix}]
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOT TAKES */}
        <section className="about-section">
          <header className="about-section-head">
            <span className="about-section-num">03</span>
            <h2>Hot takes</h2>
            <span className="about-section-meta">click to expand</span>
          </header>
          <div className="takes-list">
            {HOT_TAKES.map((t, i) => (
              <button
                key={t.num}
                type="button"
                className={`take${openTake === i ? ' is-open' : ''}`}
                onClick={() => setOpenTake(openTake === i ? -1 : i)}
                aria-expanded={openTake === i}
              >
                <span className="take-num">{t.num}</span>
                <span className="take-head">
                  <span className="take-title">{t.title}</span>
                  <span className="take-heat" aria-label={`heat ${t.heat} of 5`}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className={`heat-pip${j < t.heat ? ' on' : ''}`} />
                    ))}
                  </span>
                </span>
                <p className="take-body">{t.body}</p>
              </button>
            ))}
          </div>
        </section>

        {/* FIELD NOTES */}
        <section className="about-section">
          <header className="about-section-head">
            <span className="about-section-num">04</span>
            <h2>Field notes</h2>
            <span className="about-section-meta">photos, mostly food</span>
          </header>
          <div className="field-grid">
            {FIELD.map((f, i) => (
              <figure key={i} className={`field-card field-card--${(i % 5) + 1}`}>
                <div className="field-img placeholder">[img {String(i + 1).padStart(2, '0')}]</div>
                <figcaption>{f.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* LOADOUT */}
        <section className="about-section">
          <header className="about-section-head">
            <span className="about-section-num">05</span>
            <h2>Loadout</h2>
            <span className="about-section-meta">daily drivers</span>
          </header>
          <div className="loadout-grid">
            {LOADOUT.map(({ slot, item }) => (
              <div key={slot} className="loadout-row">
                <span className="loadout-slot">{slot.toLowerCase()}</span>
                <span className="loadout-dot" aria-hidden="true" />
                <span className="loadout-item">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* OUTRO */}
        <section className="about-section about-outro">
          <p className="outro-line">
            <span>{'>'} say hi → </span>
            <a href="mailto:antshep@umich.edu">antshep@umich.edu</a>
            <span className="outro-cursor" aria-hidden="true">█</span>
          </p>
          <p className="outro-tag">end of dossier</p>
        </section>
      </main>
    </div>
  )
}
