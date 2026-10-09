import seedHero from '../assets/seed-expo-poster.png'
import seedSiteThumb from '../assets/projects/seed-library-site.jpg'
import mintifyHero from '../assets/mintify-hero-poster.png'
import roamioHero from '../assets/roamio-homepage.png'
import diagHero from '../assets/diag-hero.png'

// Case studies. Array order drives the Navbar dropdown and the prev/next
// links in CaseStudyFooter. The home page list is sorted by `sortDate`
// instead, and mixes these in with src/data/projects.js.
//
// Home card fields:
//   - term: shown after the eyebrow ("Fall 2025").
//   - sortDate: 'YYYY-MM' the work ended. Home sorts newest first. Ties
//     keep array order.
//   - links: card buttons, left to right. The first is the primary (filled)
//     button and also where the thumbnail links. A working site goes first,
//     a prototype goes after the case study.
//   - cardImage: optional thumbnail override. Defaults to heroImage, which
//     stays the og:image and preload target.
//   - cardImagePosition / cardImageFit: optional object-position /
//     object-fit for the thumbnail.
//   - cardText: optional type-only thumbnail for case studies without a
//     usable image.
export const CASE_STUDIES = [
  {
    id: 'seed-library',
    title: 'University of Michigan Seed Library',
    eyebrow: 'BSI UX Capstone · Research, Design & Build',
    term: 'Fall 2025 – Summer 2026',
    sortDate: '2026-09',
    subtitle:
      'Redesigning a campus seed distribution system from a 4% completion rate to a connected physical-digital ecosystem, tested with 355 participants across four research methods. After the capstone, I built the site in Next.js with a CMS the library staff can edit.',
    tags: ['Mixed-Methods Research', 'Client Liaison', 'Figma', 'Next.js', 'Directus CMS'],
    award: 'UMSI Expo 26 BSI UX Pathway Award',
    heroImage: seedHero,
    cardImage: seedSiteThumb,
    links: [
      { label: 'Open site', href: 'https://seed-library-eight.vercel.app/' },
      { label: 'Read the case study', href: '/seed-library' },
    ],
  },
  {
    id: 'mintify',
    title: 'Mintify × Michigan Justice For All',
    eyebrow: 'Mintify Consulting · Project Manager',
    term: 'Fall 2025',
    sortDate: '2025-12',
    subtitle:
      'Led a 10-person student consulting team to redesign Michigan debt court forms for a real government client, coordinating three pods across research, analysis, and design over 15 weeks.',
    tags: ['10-Person Team', 'Client Relations', 'Form Redesign'],
    heroImage: mintifyHero,
    links: [
      { label: 'Read the case study', href: '/mintify' },
    ],
  },
  {
    id: 'roamio',
    title: 'Roamio',
    eyebrow: 'Product Design · Customer Discovery',
    term: 'Winter 2026',
    sortDate: '2026-04',
    subtitle:
      'Led the ideation, design, and strategy of a travel marketplace connecting travelers with verified local agents. Owned customer discovery research from scratch: 5 sessions, 10 hypotheses, and a research pivot that changed the product.',
    tags: ['Hypothesis Testing', 'Two-Sided Marketplace', 'Figma Make'],
    heroImage: roamioHero,
    links: [
      { label: 'Read the case study', href: '/roamio' },
      { label: 'Open prototype', href: 'https://www.figma.com/make/8aDzPLod12FLVoPWeNwNGD/Travel-Package-Service-Prototype?fullscreen=1' },
    ],
  },
  {
    id: 'the-diag',
    title: 'The Diag',
    eyebrow: 'Advanced UX Design · iOS App Design',
    term: 'Fall 2025',
    sortDate: '2025-12',
    subtitle:
      'A native iOS event discovery app for the University of Michigan, built end-to-end from competitive analysis to usability-tested hi-fi prototype, with full ownership of the Create Event feature.',
    tags: ['Product Strategy', 'Hi-Fi Prototyping', 'Usability Testing'],
    heroImage: diagHero,
    links: [
      { label: 'Read the case study', href: '/the-diag' },
      { label: 'Open prototype', href: 'https://www.figma.com/proto/GPrbf3nseOkGdO0t5HjXn4/SI-407-Group-Project?node-id=419-11643&starting-point-node-id=419-11643&scaling=scale-down&page-id=377-4356' },
    ],
  },
  {
    id: 'courts-audit',
    title: 'Michigan Courts Accessibility Audit',
    eyebrow: 'Web Development & Accessibility · WCAG 2.1 AA Audit',
    term: 'Fall 2025',
    sortDate: '2025-12',
    subtitle:
      'A WCAG 2.1 AA compliance audit of 7 Michigan Courts pages delivered to a real government client, with full ownership of Site 4 and Presentation Lead for the client-facing findings deck.',
    tags: ['Manual Testing', 'Assistive Tech', 'Government Client'],
    cardText: { big: 'WCAG 2.1 AA', small: '7 pages audited · Michigan Courts' },
    links: [
      { label: 'Read the case study', href: '/courts-audit' },
    ],
  },
]
