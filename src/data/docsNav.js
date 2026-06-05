export const DOCS_NAV = [
  {
    section: 'Introduction',
    items: [
      { path: '', title: 'Overview' },
      { path: 'getting-started', title: 'Getting Started' },
    ],
  },
  {
    section: 'Architecture',
    items: [
      { path: 'project-structure', title: 'Project Structure' },
      { path: 'routing', title: 'Routing' },
      { path: 'build-deploy', title: 'Build & Deploy' },
    ],
  },
  {
    section: 'Design System',
    items: [
      { path: 'design/colors', title: 'Color & Tokens' },
      { path: 'design/typography', title: 'Typography' },
      { path: 'design/layout', title: 'Layout & Spacing' },
    ],
  },
  {
    section: 'Patterns',
    items: [
      { path: 'patterns/seo-meta', title: 'SEO & Meta Tags' },
      { path: 'patterns/analytics', title: 'Analytics' },
      { path: 'patterns/accessibility', title: 'Accessibility' },
    ],
  },
  {
    section: 'Data',
    items: [
      { path: 'data/case-studies', title: 'CASE_STUDIES Schema' },
    ],
  },
  {
    section: 'Components',
    items: [
      { path: 'components', title: 'Overview' },
      { path: 'components/navbar', title: 'Navbar' },
      { path: 'components/progress-bar', title: 'ProgressBar' },
      { path: 'components/table-of-contents', title: 'TableOfContents' },
      { path: 'components/case-study-hero', title: 'CaseStudyHero' },
      { path: 'components/case-study-footer', title: 'CaseStudyFooter' },
      { path: 'components/section-label', title: 'SectionLabel' },
      { path: 'components/image-slot', title: 'ImageSlot' },
      { path: 'components/image-grid', title: 'ImageGrid' },
      { path: 'components/grid-frames', title: 'GridFrames' },
      { path: 'components/scroll-figure', title: 'ScrollFigure' },
      { path: 'components/video-section', title: 'VideoSection' },
      { path: 'components/lightbox', title: 'Lightbox' },
      { path: 'components/board-carousel', title: 'BoardCarousel' },
      { path: 'components/phone-carousel', title: 'PhoneCarousel' },
      { path: 'components/research-carousel', title: 'ResearchCarousel' },
      { path: 'components/demo-rail', title: 'DemoRail' },
      { path: 'components/before-after-pair', title: 'BeforeAfterPair' },
      { path: 'components/callout', title: 'Callout' },
      { path: 'components/decision-card', title: 'DecisionCard' },
      { path: 'components/finding-block', title: 'FindingBlock' },
      { path: 'components/pull-quote', title: 'PullQuote' },
      { path: 'components/stat-row', title: 'StatRow' },
      { path: 'components/contrib-grid', title: 'ContribGrid' },
    ],
  },
]

export const DOCS_FLAT = DOCS_NAV.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.section }))
)

export function findDocsPage(subPath) {
  return DOCS_FLAT.find((p) => p.path === subPath)
}
