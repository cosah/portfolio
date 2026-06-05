# Anthony Shephard — Portfolio

A personal UX / product portfolio. Five case studies from the University of Michigan, built with React + Vite and deployed to GitHub Pages.

📖 **[Read the full technical docs →](https://cosah.github.io/portfolio/#/docs)**

The docs cover architecture, routing, the design system, every reusable component, and the patterns (SEO, analytics, accessibility) that hold the site together. They are a sibling route to the portfolio and exist primarily for anyone reviewing this repo.

---

## What's inside

- **Five case studies** spanning research-led UX, product strategy, project management, iOS design, and a WCAG audit
- **Self-audited accessibility** — WCAG 2.1 AA, 11 findings resolved across two passes (see [`/audit`](https://cosah.github.io/portfolio/#/audit))
- **Per-route SEO** — `document.title`, `<meta name="description">`, Open Graph, Twitter Cards, and `robots` all update dynamically per route, with static fallbacks in `index.html` for crawlers that don't run JavaScript
- **Hash routing in ~30 lines** — no router library; deep links work on any static host without redirect rules
- **GA4 analytics** — manual `page_view` events fired per route change, with auto page-view disabled to avoid double-counting

### Case studies

| Project | Role | Highlight |
|---|---|---|
| **University of Michigan Seed Library** | Researcher & client liaison · BSI UX Capstone | Redesigned a campus seed distribution system from a 4.3% completion rate to a connected physical-digital ecosystem; 355 participants across four research methods. *UMSI Expo 26 BSI UX Pathway Award.* |
| **Mintify × Michigan Justice For All** | Project Manager · 10-person team | Led the redesign of Michigan debt court forms for a real government client. Three pods across research, analysis, and design over 15 weeks. |
| **Roamio** | Product Designer | Zero-to-one product design for a Gen Z travel marketplace. Owned customer discovery from scratch: 5 sessions, 10 hypotheses, and a research pivot that changed the product. |
| **The Diag** | Designer · Advanced UX Design | A native iOS event discovery app for U-M, built end-to-end from competitive analysis to usability-tested hi-fi prototype. |
| **Michigan Courts Accessibility Audit** | Web Development & Accessibility | WCAG 2.1 AA audit of 7 Michigan Courts pages, delivered to a real government client. |

---

## Local development

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/cosah/portfolio.git
cd portfolio
npm install
npm run dev
```

Vite serves on `http://localhost:5173` by default. If the port is occupied it auto-increments (`5174`, `5175`, …).

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite hot-reload dev server |
| `npm run build` | Produces optimized static bundle in `dist/` |
| `npm run preview` | Serves the production build locally for smoke-testing |
| `npm run lint` | ESLint over `src/` |

### Deploy

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`. Because routing is hash-based, GitHub Pages serves a single `index.html` for every URL and the client handles the rest — no 404 shim or rewrite rules required.

---

## Project structure

```
portfolio/
├── public/                  # Static assets served verbatim from /
│   ├── favicon.*
│   ├── share-default.png    # Default OG share image
│   └── *-demo.mp4           # Video demos
├── src/
│   ├── assets/              # Images / SVGs imported by JS (hashed by Vite)
│   ├── components/          # Reusable React components (23 of them)
│   ├── pages/               # One file per route
│   ├── data/                # Static content (caseStudies, docsNav)
│   ├── css/                 # Global CSS modules
│   ├── App.jsx              # Route registry + meta-tag/analytics wiring
│   └── main.jsx             # React mount point
├── index.html               # Single HTML entry; static fallback meta tags
├── vite.config.js
└── package.json
```

**Components vs pages.** `src/components/` holds reusable building blocks. `src/pages/` holds top-level route components, one per registered route.

**Assets.** Files imported by JS live in `src/assets/` (Vite hashes the filename for cache-busting). Files referenced by URL string (videos, favicons, OG image) live in `public/`.

---

## Routes

| Route | Page | Notes |
|---|---|---|
| `#/` | Home | Case-study grid |
| `#/seed-library` | Seed Library | Case study |
| `#/mintify` | Mintify | Case study |
| `#/roamio` | Roamio | Case study |
| `#/the-diag` | The Diag | Case study |
| `#/courts-audit` | Courts Audit | Case study |
| `#/about` | About | Hidden from nav until copy is finalized |
| `#/resume` | Resume | Embedded PDF |
| `#/docs` | **Docs** | This documentation |
| `#/audit` | Accessibility Audit | Internal · `noindex` |
| `#/todo` | Todo | Internal · `noindex` |
| `#/layout-demo` | Layout Demo | Internal · `noindex` |

---

## Tech stack

- **[React](https://react.dev/) 19** — no router library
- **[Vite](https://vitejs.dev/) 5** — dev server, build, asset pipeline
- **Plain CSS** — custom properties (no Tailwind, no CSS-in-JS)
- **[Fraunces](https://fonts.google.com/specimen/Fraunces)** (serif), **[Inter](https://rsms.me/inter/)** (sans), **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** (mono)
- **Google Analytics 4** via `gtag.js`
- **GitHub Pages** for hosting

---

## Documentation

The full technical documentation lives at [`#/docs`](https://cosah.github.io/portfolio/#/docs). It covers:

- **[Overview](https://cosah.github.io/portfolio/#/docs)** — what's in the docs, tech stack, how to read them
- **[Getting Started](https://cosah.github.io/portfolio/#/docs/getting-started)** — clone, install, run
- **Architecture**
  - **[Project Structure](https://cosah.github.io/portfolio/#/docs/project-structure)** — where things live and why
  - **[Routing](https://cosah.github.io/portfolio/#/docs/routing)** — the hash-routing implementation
  - **[Build & Deploy](https://cosah.github.io/portfolio/#/docs/build-deploy)** — Vite output and GitHub Pages
- **Design System**
  - **[Color & Tokens](https://cosah.github.io/portfolio/#/docs/design/colors)** — every CSS custom property
  - **[Typography](https://cosah.github.io/portfolio/#/docs/design/typography)** — three font families
  - **[Layout & Spacing](https://cosah.github.io/portfolio/#/docs/design/layout)** — the symmetric content column
- **Patterns**
  - **[SEO & Meta Tags](https://cosah.github.io/portfolio/#/docs/patterns/seo-meta)** — per-route Open Graph, Twitter, robots
  - **[Analytics](https://cosah.github.io/portfolio/#/docs/patterns/analytics)** — manual `page_view` per route
  - **[Accessibility](https://cosah.github.io/portfolio/#/docs/patterns/accessibility)** — WCAG patterns from the audit
- **Data**
  - **[`CASE_STUDIES` Schema](https://cosah.github.io/portfolio/#/docs/data/case-studies)** — the canonical content model
- **Components** — props, types, and usage for every reusable component:
  - Layout & navigation: Navbar, ProgressBar, TableOfContents, CaseStudyHero, CaseStudyFooter, SectionLabel
  - Content & media: ImageSlot, ImageGrid, GridFrames, ScrollFigure, VideoSection, Lightbox
  - Carousels: BoardCarousel, PhoneCarousel, ResearchCarousel, DemoRail
  - Comparisons & highlights: BeforeAfterPair, Callout, DecisionCard, FindingBlock, PullQuote, StatRow, ContribGrid

---

## Internal pages

Three routes are unlisted in production navigation but accessible if you know the URL:

- **[`/audit`](https://cosah.github.io/portfolio/#/audit)** — WCAG 2.1 AA self-audit. 11 findings, all resolved.
- **[`/todo`](https://cosah.github.io/portfolio/#/todo)** — Open work across content, accessibility, performance, and engineering.
- **[`/layout-demo`](https://cosah.github.io/portfolio/#/layout-demo)** — Visualization of the symmetric content-column system.

All three are marked `noindex, nofollow` for search engines.

---

## Contact

- 🌐 [Portfolio](https://cosah.github.io/portfolio/)
- 💼 [LinkedIn](https://www.linkedin.com/in/anthony-shephard/)
- ✉️ [antshep@umich.edu](mailto:antshep@umich.edu)

---

## License

Personal portfolio — code is shared for reference and review. Case-study content, images, and project artifacts are property of the named clients and collaborators. Please don't redistribute the case-study assets.
