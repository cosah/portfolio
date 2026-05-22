import seedHero from '../assets/seed-expo-poster.png'
import mintifyHero from '../assets/mintify-hero-poster.png'
import roamioHero from '../assets/roamio-homepage.png'
import diagHero from '../assets/diag-hero.png'

export const CASE_STUDIES = [
  {
    id: 'seed-library',
    title: 'University of Michigan Seed Library',
    eyebrow: 'BSI UX Capstone · UX Research & Design',
    subtitle:
      'Redesigning a campus seed distribution system from a 4% completion rate to a connected physical-digital ecosystem, tested with 355 participants across four research methods.',
    tags: ['UX Research', 'Client Liaison', 'Figma', 'Fall 2025 – Winter 2026'],
    award: 'BSI UX Pathway Award',
    heroImage: seedHero,
  },
  {
    id: 'mintify',
    title: 'Mintify × Michigan Justice For All',
    eyebrow: 'Mintify Consulting · Project Manager',
    subtitle:
      'Led a 10-person student consulting team to redesign Michigan debt court forms for a real government client, coordinating three pods across research, analysis, and design over 15 weeks.',
    tags: ['Project Management', 'Client Relations', 'Form Redesign', 'Fall 2025'],
    heroImage: mintifyHero,
  },
  {
    id: 'roamio',
    title: 'Roamio',
    eyebrow: 'Product Design · Customer Discovery',
    subtitle:
      'A travel marketplace connecting Gen Z travelers with verified local agents. Owned customer discovery research from scratch: 5 sessions, 10 hypotheses, and a research pivot that changed the product.',
    tags: ['Product Research', 'Customer Discovery', 'Figma Make', 'Spring 2026'],
    heroImage: roamioHero,
  },
  {
    id: 'the-diag',
    title: 'The Diag',
    eyebrow: 'Advanced UX Design · iOS App Design',
    subtitle:
      'A native iOS event discovery app for the University of Michigan, built end-to-end from competitive analysis to usability-tested hi-fi prototype, with full ownership of the Create Event feature.',
    tags: ['Product Strategy', 'UX Design', 'Usability Testing', 'Fall 2025'],
    heroImage: diagHero,
    heroImageSize: '80% auto',
    heroImagePosition: '100% center',
  },
  {
    id: 'courts-audit',
    title: 'Michigan Courts Accessibility Audit',
    eyebrow: 'Web Development & Accessibility · WCAG 2.1 AA Audit',
    subtitle:
      'A WCAG 2.1 AA compliance audit of 7 Michigan Courts pages delivered to a real government client, with full ownership of Site 4 and Presentation Lead for the client-facing findings deck.',
    tags: ['Accessibility', 'WCAG 2.1 AA', 'Government Client', 'Fall 2025'],
  },
]
