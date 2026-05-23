import Navbar from '../components/Navbar'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import ImageSlot from '../components/ImageSlot'
import StatRow from '../components/StatRow'
import FindingBlock from '../components/FindingBlock'
import TableOfContents from '../components/TableOfContents'
import CaseStudyFooter from '../components/CaseStudyFooter'

const META = [
  { label: 'Project', value: 'MI Courts Audit' },
  { label: 'Course', value: 'SI 338 · Accessibility & Web Dev' },
  { label: 'Role', value: 'Presentation Lead' },
  { label: 'Owned', value: 'Site 4 Audit' },
  { label: 'Team', value: '4 members' },
  { label: 'Duration', value: '4 weeks' },
  { label: 'Year', value: 'Fall 2025' },
]

const STATS = [
  { label: 'Living with disability', value: '1 in 4', delta: 'Americans, baseline audience', tone: 'info' },
  { label: 'Pages evaluated', value: '7', delta: 'across MI Courts site', tone: 'info' },
  { label: 'Conformance standard', value: 'WCAG 2.1 AA', delta: 'formally adopted by Michigan', tone: 'good' },
]

const TOOLS = ['WAVE', 'axe DevTools', 'VoiceOver (desktop + mobile)', 'Lighthouse', 'Nu HTML Checker', 'WebAIM Contrast Checker', 'Keyboard navigation', 'Browser Inspect']

const PERSONAS = [
  {
    name: 'Monica',
    role: 'Screen reader user, vision loss',
    description: 'Navigates via VoiceOver. Encountered redundant alt text on homepage images, a logo button that reloads the page unexpectedly, and navigation links that read as "images" rather than links in the form-controls rotor.',
  },
  {
    name: 'Tammi',
    role: 'Hard of hearing, hearing aids paired to phone',
    description: 'Relies on captions for audio-video content. The For Filers in Trial Courts page hosts video resources with a complete absence of captions or transcripts, locking Tammi out of that content entirely.',
  },
  {
    name: 'Marcus',
    role: 'Blue-yellow colorblind',
    description: 'The Interactive Court Data Dashboard uses color-coded data visualizations with contrast ratios far below the 3:1 minimum for non-text elements. Without an accessible table alternative, the dashboard is inaccessible to Marcus.',
  },
  {
    name: 'Jean',
    role: 'Cerebral palsy, joystick and speech-to-text',
    description: 'Depends on visible focus indicators to track position during keyboard navigation. On the Consent Verification Registration page, the focus ring is too low-contrast to follow reliably, and checkboxes have no visible focus state at all.',
  },
]

const SECTIONS = [
  { num: 1, label: 'The problem', id: 'sec-1' },
  { num: 2, label: 'Discovery', id: 'sec-2' },
  { num: 3, label: 'Strategy', id: 'sec-3' },
  { num: 4, label: 'User research', id: 'sec-4' },
  { num: 5, label: 'Page deep dive', id: 'sec-5' },
  { num: 6, label: 'Site-wide findings', id: 'sec-6' },
  { num: 7, label: 'Contributions', id: 'sec-7' },
]

const CONTRIBUTIONS = [
  { phase: 'Plan', work: 'Contributed to team planning during initial check-ins; helped scope the page assignment matrix; researched screen reader controls and keyboard navigation patterns before testing.' },
  { phase: 'Test', work: 'Conducted full WCAG 2.1 AA audit of Site 4 (Consent Verification Registration): automated testing via WAVE and axe DevTools, manual keyboard navigation on desktop and mobile, and a detailed conformance checklist.' },
  { phase: 'Cross-test', work: 'Contributed additional WCAG checklist evaluations across sites 1 and 2 to supplement the team\'s coverage.' },
  { phase: 'Synthesize', work: 'Translated Site 4 results into the structured per-page audit report section, including conformance ratings, error categorization, and the targeted 5-item remediation plan.' },
  { phase: 'Present', work: 'Presentation Lead: structured the deck (test coverage, methods, persona-driven findings, recommendations), designed the presentation approach, and led delivery of the persona introduction and Site 4 findings sections to the Michigan Courts client audience.' },
  { phase: 'Report', work: 'Created the team\'s shared report document, drafted the Site 4 section, and contributed to the comprehensive remediation plan covering all four priority tiers.' },
]

export default function CourtsAudit({ onHome }) {
  return (
    <div className="case-study-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="courts-audit" />

      <CaseStudyHero
        kicker="Case Study · Web Accessibility · Government Client"
        title="A public legal site,"
        titleEmphasis="audited against the standard Michigan adopted."
        subtitle="A WCAG 2.1 AA compliance audit of the Michigan Courts website, evaluating seven pages for barriers faced by users with disabilities and delivering a prioritized remediation roadmap to a real government client."
        meta={META}
        corners={{ tl: '+ 00.00', tr: '21:9 · HERO', bl: 'MI COURTS · WCAG 2.1 AA', br: 'FALL 2025 · SI 338 · ACCESSIBILITY & WEB DEV' }}
        heroLabel="MI Courts accessibility audit, project banner"
      />

      <div className="case-study-layout">
        <aside className="toc-rail">
          <TableOfContents sections={SECTIONS} />
        </aside>

        <main id="main-content">

        <div className="section" id="sec-1">
          <SectionLabel num={1}>The problem</SectionLabel>
          <h2>Evaluating a public legal resource against an adopted accessibility standard.</h2>
          <div className="body-text">
            <p>The Michigan Courts System website serves a wide range of users: attorneys filing motions, journalists tracking decisions, and members of the public navigating legal processes with varying degrees of familiarity. It hosts court rules, hearing schedules, filing portals, and data dashboards, often as the primary point of contact between citizens and the court system.</p>
            <p>We audited seven distinct pages across the Michigan Courts site to document where it conforms, where it falls short, and what the path to full compliance looks like.</p>
            <p>Accessibility on a legal information site carries real weight. Barriers that prevent a screen reader user from navigating a form, or a keyboard user from identifying which element is focused, have consequences beyond inconvenience.</p>
          </div>
          <StatRow stats={STATS} />
        </div>

        <div className="section" id="sec-2">
          <SectionLabel num={2}>Discovery</SectionLabel>
          <h2>Three testing methods, seven pages, one consistent pattern.</h2>
          <div className="body-text">
            <p>Our team audited seven pages of the Michigan Courts site using a layered testing approach. We started with automated tools for broad coverage, moved to manual keyboard-only navigation for interaction fidelity, and ended with VoiceOver screen reader testing on both desktop and mobile for the most nuanced findings. No single tool catches everything.</p>
          </div>
          <div className="tool-row">
            {TOOLS.map(tool => (
              <span key={tool} className="tool-tag">{tool}</span>
            ))}
          </div>
          <div className="body-text">
            <p>Pages covered: Homepage, For Filers in Trial Courts, Interactive Court Data Dashboard, Consent Verification Registration, Court Communications, Michigan Court Rules, and Problem-Solving Courts. Each team member owned one or more pages for automated and manual testing; Cassidy led screen reader testing across the full site.</p>
          </div>
          <ImageSlot id="2.1" caption="Team project tracker: page assignments, task checklist, and WCAG conformance summary across all 7 sites." />
          <div className="body-text">
            <p>The pattern that emerged was consistent. The site had good bones in some areas (page titles, consistent navigation, readable zoom behavior) but failed repeatedly on contrast, semantic structure, and keyboard interaction. These were not isolated bugs. They were architectural patterns repeated across the entire site.</p>
          </div>

          <h3>Four failure categories that showed up everywhere</h3>
          <FindingBlock label="Color contrast">
            Contrast below WCAG minimums across multiple pages, ranging from marginal misses to near-zero ratios. Most severe on the Interactive Court Data Dashboard.
          </FindingBlock>
          <FindingBlock label="Missing or broken semantic structure">
            Most pages were missing proper landmark elements (&lt;main&gt;, &lt;header&gt;, &lt;footer&gt;). Heading levels were skipped. "Skip to main content" links were present on most pages but nonfunctional: not keyboard-activatable, and pointing to sections that didn't exist.
          </FindingBlock>
          <FindingBlock label="Unlabeled interactive elements">
            Empty buttons and icons with no accessible names across every page. SVG graphics missing title and description elements. Form fields missing programmatic label associations.
          </FindingBlock>
          <FindingBlock label="Focus indicator failures">
            Keyboard users had no reliable way to track which element was active. No consistent visible focus state across the site.
          </FindingBlock>

          <Callout
            stat="79"
            label="Worst single-page result · Interactive Court Data Dashboard"
            title="A public-facing data dashboard with seventy-nine contrast errors."
          >
            <p>The dashboard's color-coded visualizations had ratios as low as 1:1, well below WCAG AA's 3:1 minimum for non-text elements. For users with color-vision deficiencies, the data was effectively unreadable, with no accessible table fallback surfaced anywhere on the page. Across all seven pages this was the single worst result, and it was on a tool meant to make court data more transparent to the public.</p>
          </Callout>
        </div>

        <div className="section" id="sec-3">
          <SectionLabel num={3}>Strategy</SectionLabel>
          <h2>Framing findings for a government client, not a design team.</h2>
          <div className="body-text">
            <p>Our deliverable was a written audit report and a 15-minute live presentation to the Michigan Courts client team. As Presentation Lead, I was responsible for deciding how to structure those 15 minutes. The audience wasn't designers or engineers; it was a government team that needed to understand the scope of the problem and what to prioritize.</p>
            <p>I made two structural decisions early. First, the presentation would be organized around personas rather than WCAG criteria numbers. Citing WCAG 1.4.3 to a client audience is opaque. Showing how a specific user with blue-yellow colorblindness can't read the data dashboard is concrete. Second, I insisted on grounding each finding in the specific page and user context where we found it.</p>
            <p>The audit report organized findings into a four-tier remediation roadmap: immediate (navigation and focus), short-term (screen reader compatibility), medium-term (form accessibility and link labeling), long-term (mobile responsiveness and user-preference support).</p>
          </div>
          <ImageSlot id="3.1" caption="Team presentation slides: cover, agenda, personas, per-page findings, and recommendations." />
        </div>

        <div className="section" id="sec-4">
          <SectionLabel num={4}>User research</SectionLabel>
          <h2>Four personas built to ground technical findings in human reality.</h2>
          <div className="body-text">
            <p>I developed the four accessibility personas used in the presentation, each designed to represent a distinct disability context and a specific failure mode we had documented. Personas connect abstract WCAG criteria to real consequences for real types of users.</p>
          </div>
          <div className="persona-grid">
            {PERSONAS.map(({ name, role, description }) => (
              <div key={name} className="persona-card">
                <div className="name">{name}</div>
                <div className="role">{role}</div>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section" id="sec-5">
          <SectionLabel num={5}>Page deep dive</SectionLabel>
          <h2>Site 4: the most accessible page on the site, and what it still got wrong.</h2>
          <div className="body-text">
            <p>I owned the WCAG 2.1 AA audit of Site 4, the Consent Verification Registration page. This was the supply-side critical page: the form a user fills out to register for access to confidential court data. If a user can't complete this form, they can't proceed. And unlike the rest of the site, this page was built carefully.</p>
          </div>
          <h3>What was working</h3>
          <div className="body-text">
            <p>The Consent Verification Registration page was the strongest-performing page in the audit by a significant margin. WAVE detected no meaningful errors. The report flagged it explicitly: "Nice job here!" That's not a phrase you expect in a WCAG audit report. The reasons were structural: form labels were programmatically associated with their fields, logical heading order was maintained from h1 through h3, required field status was announced by the screen reader, text examples within form fields were read aloud, and checkbox states were clearly communicated on state change.</p>
          </div>

          <Callout
            tone="good"
            stat="0"
            label="The outlier finding · Site 4"
            title="Zero meaningful WAVE errors detected on Site 4."
          >
            <p>While every other page in the audit had between 9 and 80+ errors flagged by automated tools, this page had zero. The contrast passed, the structure was sound, and the screen reader experience was genuinely good. This was worth understanding, not just noting.</p>
          </Callout>

          <h3>What it got wrong anyway</h3>
          <div className="body-text">
            <p>Even the best page had issues the automated tools didn't catch, which was itself an important finding: automated testing alone is not sufficient. Axe flagged two structural errors that WAVE missed. The ARIA "required" attribute was applied to parent container divs rather than the input elements, a semantic misuse that could confuse some assistive technologies. And the three address sub-fields (City, State, Zip) had no programmatic labels, meaning a screen reader user couldn't identify what each field was for without inferring from context.</p>
            <p>Manual keyboard testing revealed two more failures invisible to automated tools. The "skip to main content" link was visually present but could only be activated with a mouse click, not a keyboard. And the focus indicator, while technically present, was too low-contrast to track reliably across links, and was entirely absent on checkboxes and radio buttons.</p>
          </div>
          <ImageSlot id="5.1" caption="Site 4 WCAG checklist: conformance ratings across navigation, screen reader, keyboard, and form handling." />

          <h3>The remediation plan</h3>
          <div className="body-text">
            <p>Five targeted fixes would bring this page to full AA conformance. Replace div containers around grouped content with semantic section tags. Add the word "required" next to the asterisk marking required fields, so the requirement is communicated in text, not just visually. Add explicit labels to the City, State, and Zip fields. Move the aria-required attribute from parent divs to the input elements directly. Restyle the focus indicator with higher contrast and a visible outline for checkboxes and radio buttons.</p>
            <p>These weren't dramatic changes. The page's foundation was solid. The fixes were precise and surgically targeted, which made this page the easiest remediation in the report.</p>
          </div>
        </div>

        <div className="section" id="sec-6">
          <SectionLabel num={6}>Findings across all 7 pages</SectionLabel>
          <h2>Four recommendations that applied site-wide.</h2>
          <div className="body-text">
            <p>After synthesizing findings across all seven pages, the team identified four remediation priorities that were universal, either failing or partially failing on every page tested. These became the centerpiece of our client presentation.</p>
          </div>

          <DecisionCard number={1} title="Add descriptive alt text to all images and buttons" rationale="'Image' as alt text is not neutral. It actively misleads. Descriptive alt text is the baseline of web accessibility, and it was failing site-wide.">
            <p>Every page had some form of alt-text failure: generic "image" labels, missing alt attributes on SVG icons, functional buttons with no accessible name. The homepage alone had 79 empty buttons. This was the single most pervasive issue across the site and the most straightforward to fix.</p>
          </DecisionCard>
          <DecisionCard number={2} title="Add captions or transcripts to all audio-video content" rationale="Multimedia without captions excludes an entire disability population. This isn't a nuanced conformance question; it's a binary fail against a clearly defined criterion.">
            <p>The For Filers in Trial Courts page hosts video resources with zero captions or transcripts. A hard-of-hearing user has no access to that content. WCAG 1.2.2 requires captions for all prerecorded synchronized media. This wasn't a partial failure; it was a complete absence of compliance.</p>
          </DecisionCard>
          <DecisionCard number={3} title="Fix contrast ratios across text, icons, and data visualizations" rationale="Contrast is the most-failed WCAG criterion across the web. It's also the most measurable: there's a number, there's a threshold, and you either meet it or you don't.">
            <p>Text-to-background ratios as low as 1:1 were found across multiple pages. WCAG AA requires 4.5:1 for normal text and 3:1 for large text and non-text elements. The Interactive Court Data Dashboard had 79 contrast errors. The data visualizations used color coding that was functionally meaningless for users with color-vision deficiencies.</p>
          </DecisionCard>
          <DecisionCard number={4} title="Add visible focus state highlighting to all keyboard-navigable elements" rationale="Focus visibility is the keyboard user's cursor. Without it, keyboard navigation becomes guesswork.">
            <p>Across all seven pages, keyboard users frequently couldn't tell where they were. Focus rings were absent, too low-contrast to see, or inconsistently applied across element types. The tab order on several pages required cycling through dozens of navigation elements before reaching meaningful content.</p>
          </DecisionCard>
        </div>

        <div className="section" id="sec-7">
          <SectionLabel num={7}>My contributions</SectionLabel>
          <h2>What I owned across each phase.</h2>
          <ContribGrid items={CONTRIBUTIONS} />
        </div>

        </main>
      </div>

      <CaseStudyFooter slug="courts-audit · si-338" />
    </div>
  )
}
