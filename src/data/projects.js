// Builds that aren't case studies. The home page merges these with
// CASE_STUDIES and sorts everything by `sortDate`, newest first. Fields
// match the case study card fields documented in caseStudies.js.
//
//   - links: `href` starting with "/" is an internal route (SPA navigation
//     via App.jsx's click interceptor), anything else opens in a new tab.
//     `preview: true` opens the thumbnail in the Lightbox instead.
//   - panel: the thumbnail is a render of a physical screen, so it's shown
//     whole on black rather than cropped like a browser screenshot.
//   - preview: Lightbox caption for projects with no public URL. The e-ink
//     calendar's live deployment serves a real calendar, so the card only
//     ever shows a render made from the sample fixture data.

import notetubeThumb from '../assets/projects/notetube.jpg'
import pathwaysThumb from '../assets/projects/pathways.jpg'
import einkThumb from '../assets/projects/eink-mondrian.png'

export const PROJECTS = [
  {
    id: 'notetube',
    title: 'NoteTube',
    eyebrow: 'Web app · Personal project',
    term: 'Oct 2026',
    sortDate: '2026-10',
    description:
      'A note-taking app for learning from YouTube. Watch a lecture or tutorial on one side and write rich-text notes on the other, with one-key timestamps that jump the video back to that moment. Notes save in the browser per video and export to Markdown, Word, PDF, or Google Docs.',
    tags: ['React', 'TypeScript', 'TipTap', 'YouTube IFrame API', 'WCAG 2.2 AA'],
    thumb: notetubeThumb,
    links: [
      { label: 'Open app', href: 'https://notetube-teal.vercel.app/' },
    ],
  },
  {
    id: 'pathways',
    title: 'Pathways',
    eyebrow: 'Web app · Concept',
    term: 'Jun 2026',
    sortDate: '2026-06',
    description:
      'A degree planner concept, designed as a new tab for a university course guide. Students pick a school, degree, and pathway, then lay out courses term by term on a drag-and-drop board that draws prerequisite arrows and flags conflicts. Auto-plan builds a full schedule from a catalog of 13,385 courses. This is an independent concept, not an official university tool.',
    tags: ['Next.js', 'TypeScript', 'Postgres', 'Prisma', 'Tailwind'],
    thumb: pathwaysThumb,
    links: [
      { label: 'Open app', href: 'https://pathways-cyan.vercel.app/' },
    ],
  },
  {
    id: 'eink-calendar',
    title: 'E-ink wall calendar',
    eyebrow: 'Hardware · Personal project',
    term: 'Aug – Sep 2026',
    sortDate: '2026-09',
    description:
      'A three-day wall calendar on a 7.3-inch, six-color E Ink panel. A Next.js server merges my calendars, renders the layout with Satori, and reduces it to the panel\'s six inks. The ESP32 board wakes, downloads the new frame, and goes back to sleep. Shown here with sample events in the Mondrian layout, the default of four designs.',
    tags: ['ESP32', 'E Ink Spectra 6', 'Next.js', 'Satori', 'Arduino C++'],
    thumb: einkThumb,
    thumbAlt: 'Sample three-day calendar in a Mondrian layout, with red, blue, yellow, and white event blocks on black',
    panel: true,
    preview: { label: 'Sample render · Mondrian layout · 800 × 480, six inks' },
    links: [
      { label: 'View sample render', preview: true },
      { label: 'Code', href: 'https://github.com/cosah/eink-calendar' },
    ],
  },
]
