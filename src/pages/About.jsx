// About is the personal page: hero + specs panel, then sections for
// Currently / Origins / Hot Takes / Field Notes / Loadout, ending with
// a small outro. Most of the file is the data arrays that drive each
// section. The component itself is a thin renderer over them.

import { useState } from 'react'
import Navbar from '../components/Navbar'
import nowBook from '../assets/about/now-book-contact.jpg'
import nowScreen from '../assets/about/now-screen-lasso.png'
import nowAudio from '../assets/about/now-audio.png'
import nowShip from '../assets/about/now-ship-mindsemerge.png'
import originCat from '../assets/about/origin/cat-crop.jpg'
import originGarden from '../assets/about/origin/garden-crop.jpg'
import originTeach from '../assets/about/origin/teach-crop.jpg'
import fieldHockey from '../assets/about/field-notes/hockey.jpg'
import fieldBirria from '../assets/about/field-notes/birria.jpg'
import fieldOrzo from '../assets/about/field-notes/orzo.jpg'
import fieldGrad from '../assets/about/field-notes/grad.jpg'
import fieldTigers from '../assets/about/field-notes/tigers.jpg'
import fieldCutlet from '../assets/about/field-notes/cutlet.jpg'

// Hero-specs panel data. k is the row label, v is the value displayed
// in bold. Keep both short; the layout is a tight two-column rhythm.
const SPECS = [
  { k: 'Location', v: 'Ann Arbor, MI' },
  { k: 'Time zone', v: 'EST · UTC−5' },
  { k: 'Status', v: 'UMSI MSI student · grad May 2027' },
  { k: 'Interning', v: 'MindsEmerge · Product Design & Development' },
  { k: 'Looking for', v: 'PM / UX roles · willing to relocate or remote' },
  { k: 'Right now', v: 'Claude' },
  { k: 'Coffee', v: 'Americano, black' },
]

// NOW drives the "Currently" section: four cards for what's being read,
// watched, listened to, and built right now. Each card has an optional
// href that makes the title clickable (used for the WCBN station link).
// Update by editing this array; the cards re-render automatically.
const NOW = [
  {
    tag: 'BOOK',
    label: 'Reading',
    title: 'Contact',
    byline: 'Carl Sagan',
    img: nowBook,
    note: "It's Sagan's only novel, about a radio astronomer who picks up a signal from Vega and a world that has to decide what to do with it.",
  },
  {
    tag: 'SCREEN',
    label: 'Just finished',
    title: 'Ted Lasso',
    byline: 'the newest season',
    img: nowScreen,
    note: "I just finished the newest season, and Ted is my Halloween costume this year.",
  },
  {
    tag: 'AUDIO',
    label: 'On loop',
    title: 'WCBN-FM',
    byline: 'Ann Arbor',
    href: 'https://wcbn.org/',
    img: nowAudio,
    note: "Their DJs always know what I'd play next, and I trust them to show me what I wouldn't.",
  },
  {
    tag: 'SHIP',
    label: 'Building',
    title: 'MindsEmerge',
    byline: 'product design & development intern',
    href: 'https://www.mindsemerge.com/',
    img: nowShip,
    note: "I'm interning on product design and development at an Ann Arbor startup that puts AI inside a maple-wood alphabet set, so young kids learn to read through screen-free play.",
  },
]

// HOT_TAKES drive the click-to-expand accordions in section 03. heat is
// 1 to 5 and renders as filled pips next to the title (visual spice meter).
// Spread the heat across slots for visual variety: see Docs for the
// 3 / 4 / 5 / 2 pattern reasoning.
const HOT_TAKES = [
  {
    num: '01',
    heat: 3,
    title: 'Anyone with vision and will can ship a product now',
    body: "AI tools mean anyone can design, build, and test a product now. The only barrier left is vision and will.",
  },
  {
    num: '02',
    heat: 4,
    title: 'Figma is a glorified design-system outliner now',
    body: "Designers can build and test front-end directly with tools like Claude Code. The work we used Figma for has moved into the IDE, and what's left for Figma is mostly design-system maintenance.",
  },
  {
    num: '03',
    heat: 5,
    title: 'Designer-dev unicorns are the new baseline',
    body: "The tools that used to make this hard are basically free now. There's no excuse not to ship code anymore, and the opportunities will go to whoever's willing to do it.",
  },
  {
    num: '04',
    heat: 2,
    title: 'Liquid Glass killed dark mode for me',
    body: "Liquid Glass has real accessibility issues. My personal beef is pettier. I used to run my phone in dark mode and now it looks bad.",
  },
]

// FIELD is the photo collage. Each photo gets a different CSS aspect
// ratio cycled through (4/5, 4/3, 1/1, 3/4, 16/9, 4/5) for a magazine-
// like spread. The order in this array maps directly to those slot
// aspects, so swap a photo only if its native aspect matches.
const FIELD = [
  {
    src: fieldHockey,
    alt: 'Anthony cheering with arms raised at a Michigan hockey game, wearing a yellow Michigan-print jacket',
    caption: 'M hockey at Yost',
  },
  // The three food photos are the first image of the latest three posts on
  // instagram.com/not_anthonybourdain (as of Oct 2026), placed by shape:
  // the wide plate in the 4:3 slot, the near-square one in 1:1, the tall
  // one in 4:5.
  {
    src: fieldBirria,
    alt: 'A plate of birria tacos with lime wedges and a cup of consommé for dipping',
    caption: 'Birria tacos and horchata',
  },
  {
    src: fieldOrzo,
    alt: 'A crispy-skinned chicken thigh on shiitake Parmesan orzo, topped with torn basil',
    caption: 'Chicken thighs, shiitake orzo',
  },
  {
    src: fieldGrad,
    alt: 'Anthony in cap and gown at his graduation in Michigan Stadium with the scoreboard visible',
    caption: 'Big House, May 2026',
  },
  {
    src: fieldTigers,
    alt: 'Anthony and a friend at a Tigers game at Comerica Park, Detroit skyline behind',
    caption: 'Tigers at Comerica',
  },
  {
    src: fieldCutlet,
    alt: 'Spaghetti in a creamy tomato sauce with a sliced breaded cutlet and shaved Parmesan on top',
    caption: 'Tomato cream pasta, breaded cutlet',
  },
]

// LOADOUT lists daily-driver tools. Each row has a slot label and one
// or more items. Each item has a name and optional href that turns it
// into a clickable manufacturer link with the small arrow affordance.
const LOADOUT = [
  { slot: 'Laptop', items: [{ name: 'MacBook Air M1', href: 'https://support.apple.com/en-us/111883' }] },
  { slot: 'Phone', items: [{ name: 'iPhone 16 Pro Max', href: 'https://www.apple.com/iphone-16-pro/' }] },
  {
    slot: 'Design',
    items: [
      { name: 'Figma', href: 'https://www.figma.com/' },
      { name: 'FigJam', href: 'https://www.figma.com/figjam/' },
    ],
  },
  {
    slot: 'Code',
    items: [
      { name: 'VS Code', href: 'https://code.visualstudio.com/' },
      { name: 'Claude Code', href: 'https://claude.com/product/claude-code' },
    ],
  },
  { slot: 'Notes', items: [{ name: 'Notability', href: 'https://notability.com/' }] },
  {
    slot: 'Audio',
    items: [
      { name: 'Sennheiser HD 650', href: 'https://www.sennheiser-hearing.com/en-US/p/hd-650/' },
      { name: 'Schiit Vali 3', href: 'https://www.schiit.com/products/vali3' },
    ],
  },
  { slot: 'Camera', items: [{ name: 'iPhone 16 Pro Max', href: 'https://www.apple.com/iphone-16-pro/' }] },
  { slot: 'Backpack', items: [{ name: 'Osprey Quasar 28L', href: 'https://www.rei.com/product/143022/osprey-quasar-pack?redirect-pup=false' }] },
]

// ORIGINS feeds the 3-card photo stack in section 02. The stack starts
// with the first array entry in front and cycles on click via stackOrder
// state (see the component below). Order here = initial front-to-back.
const ORIGINS = [
  {
    ix: 'A',
    src: originGarden,
    alt: 'Anthony at home with several potted succulents and houseplants in front of him',
  },
  {
    ix: 'B',
    src: originCat,
    alt: 'Anthony holding a tabby and white kitten on his shoulder',
  },
  {
    ix: 'C',
    src: originTeach,
    alt: "Anthony presenting at a Robofest event, wearing a name tag that reads 'Anthony Shephard'",
  },
]

export default function About({ onHome }) {
  // Which hot take card is currently expanded. -1 means none.
  // Only one expands at a time, so a single piece of state is enough.
  const [openTake, setOpenTake] = useState(-1)
  // Stack order for the Origins collage. The array tracks which
  // ORIGINS index sits at each position [front, middle-back, other-back].
  // cycleStack rotates the array so the next image moves to front.
  const [stackOrder, setStackOrder] = useState([0, 1, 2])

  // Cycle: [A, B, C] becomes [B, C, A]. Functional setState so we always
  // operate on the latest prev, not a stale closed-over value.
  const cycleStack = () => {
    setStackOrder((prev) => [prev[1], prev[2], prev[0]])
  }

  return (
    <div className="about-page case-study-page">
      <a href="#about-main" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="about" />

      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-text">
            <p className="about-eyebrow">Dossier · off the clock</p>
            <h1 className="about-title">
              Anthony Shephard<br />
              <em>Builder, gardener, pasta perfectionist</em>
            </h1>
            <p className="about-lead">
              I love cooking at home, especially pasta with sauce from scratch. My plants bring me peace. Give me a new piece of tech to learn or a puzzle to solve, and I'll lose hours, sometimes days, in it.
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
            <span className="about-section-meta">updated Oct 2026</span>
          </header>
          <div className="now-grid">
            {NOW.map(({ tag, label, title, byline, href, img, note }) => (
              <article key={label} className="now-card">
                <div className={`now-img${img ? '' : ' placeholder'}`}>
                  {img ? <img src={img} alt="" /> : '[cover image]'}
                </div>
                <div className="now-body">
                  <div className="now-meta">
                    <span className="now-tag">{tag}</span>
                    <span className="now-label">{label}</span>
                  </div>
                  <h3 className="now-title">
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {title}
                      </a>
                    ) : (
                      title
                    )}
                  </h3>
                  {byline && <p className="now-byline">{byline}</p>}
                  <p className="now-note">{note}</p>
                </div>
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
              <p>
                I grew up in Vicksburg, a small town in southwest Michigan. In 2004, Cranbrook recruited me on a scholarship, transplanting me from a rural monoculture into a boarding dormitory of students from all over the world. It rewrote what I thought was possible, and instilled in me a sense of stewardship I still carry. After a few years in the Bay Area figuring myself out, a former classmate asked me back to coach Cranbrook's robotics program. Over the next seven years I coached more than thirty teams to the VEXIQ World Championship as Michigan's state champions, at the campus that feels like home. Now I want to build things that do the same for the next kid.
              </p>
              <p>
                I always wanted to build things, Legos, puzzles, and science kits; anything I could take apart and put back together. I also disappeared into video games. Computer science was where the two met. Design came a little later, the same instinct to build and iterate, but at a larger scale, where the system includes the people using it.
              </p>
            </div>
            <button
              type="button"
              className="origins-collage"
              onClick={cycleStack}
              aria-label="Click to cycle to the next origin photo"
            >
              {ORIGINS.map(({ ix, src, alt }, idx) => {
                const pos = stackOrder.indexOf(idx)
                return (
                  <div
                    key={ix}
                    className={`origin-card origin-card--pos-${pos}`}
                  >
                    <img src={src} alt={alt} />
                  </div>
                )
              })}
            </button>
          </div>
        </section>

        {/* HOT TAKES */}
        <section className="about-section">
          <header className="about-section-head">
            <span className="about-section-num">03</span>
            <h2>Hot takes</h2>
            <span className="about-section-meta">spice level varies</span>
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
                  <span className="take-controls">
                    <span className="take-heat" aria-label={`heat ${t.heat} of 5`}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} className={`heat-pip${j < t.heat ? ' on' : ''}`} />
                      ))}
                    </span>
                    <svg
                      className="take-chevron"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
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
                <div className="field-img">
                  <img src={f.src} alt={f.alt} />
                </div>
                <figcaption>{f.caption}</figcaption>
              </figure>
            ))}
          </div>
          {/* The food photos are a sample. The full cooking log lives on
              Instagram, linked here rather than embedded so the page
              doesn't load Instagram's scripts and trackers. */}
          <a
            className="field-more"
            href="https://www.instagram.com/not_anthonybourdain/"
            target="_blank"
            rel="noopener noreferrer"
          >
            More cooking on Instagram, @not_anthonybourdain <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </section>

        {/* LOADOUT */}
        <section className="about-section">
          <header className="about-section-head">
            <span className="about-section-num">05</span>
            <h2>Loadout</h2>
            <span className="about-section-meta">daily drivers</span>
          </header>
          <div className="loadout-grid">
            {LOADOUT.map(({ slot, items }) => (
              <div key={slot} className="loadout-row">
                <span className="loadout-slot">{slot.toLowerCase()}</span>
                <span className="loadout-dot" aria-hidden="true" />
                <span className="loadout-item">
                  {items.map((it, i) => (
                    <span key={i}>
                      {i > 0 && ' · '}
                      {it.href ? (
                        <a href={it.href} target="_blank" rel="noopener noreferrer">
                          {it.name}
                        </a>
                      ) : (
                        it.name
                      )}
                    </span>
                  ))}
                </span>
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
