import Navbar from '../components/Navbar'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import ImageSlot from '../components/ImageSlot'
import StatRow from '../components/StatRow'
import FindingBlock from '../components/FindingBlock'
import CaseStudyFooter from '../components/CaseStudyFooter'

const THEME = {
  '--color-accent': '#1E3D2F',
  '--color-accent-soft': '#D6EBE0',
  '--color-accent-night': '#6BA3C8',
}

const META = [
  { label: 'Role', value: 'Presentation Lead, Accessibility Tester' },
  { label: 'Page Ownership', value: 'Site 4: Consent Verification Registration' },
  { label: 'Team', value: '4 members (SI 338)' },
  { label: 'Timeline', value: 'Fall 2025, 4 weeks' },
  { label: 'Client', value: 'Michigan Courts System' },
  { label: 'Tools', value: 'WAVE, axe DevTools, VoiceOver, Lighthouse' },
]

const STATS = [
  { number: '1 in 4', label: 'Americans are living with some form of disability' },
  { number: '7', label: 'pages evaluated across the Michigan Courts site' },
  { number: 'WCAG 2.1 AA', label: 'the conformance standard Michigan has formally adopted' },
]

const TOOLS = ['WAVE', 'axe DevTools', 'VoiceOver (desktop + mobile)', 'Lighthouse', 'Nu HTML Checker', 'WebAIM Contrast Checker', 'Keyboard navigation', 'Browser Inspect']

const PERSONAS = [
  {
    name: 'Monica',
    role: 'Screen reader user, vision loss',
    description: 'Navigates via VoiceOver. Encountered redundant alt text on homepage images, logo button that reloads the page unexpectedly, and navigation links that read as \'images\' rather than links in the form controls rotor.',
  },
  {
    name: 'Tammi',
    role: 'Hard of hearing, hearing aids paired to phone',
    description: 'Relies on captions for audio-video content. The For Filers in Trial Courts page has video resources with a complete absence of captions or transcripts, effectively locking Tammi out of that content entirely.',
  },
  {
    name: 'Marcus',
    role: 'Blue-yellow colorblind',
    description: 'The Interactive Court Data Dashboard uses color-coded data visualizations with contrast ratios far below the 3:1 minimum for non-text elements. The dashboard\'s data is inaccessible to Marcus without an accessible table alternative surfaced prominently.',
  },
  {
    name: 'Jean',
    role: 'Cerebral palsy, joystick and speech-to-text',
    description: 'Depends on visible focus indicators to track position during keyboard navigation. On the Consent Verification Registration page, the focus ring is too low-contrast to follow reliably, and checkboxes have no visible focus state at all.',
  },
]

const CONTRIBUTIONS = [
  { phase: 'Plan', work: 'Contributed to team planning during initial check-ins; helped scope the page assignment matrix across team members; researched screen reader controls and keyboard navigation patterns before testing began' },
  { phase: 'Test', work: 'Conducted full WCAG 2.1 AA audit of Site 4 (Consent Verification Registration): automated testing via WAVE and axe DevTools, manual keyboard navigation on desktop and mobile, and a detailed conformance checklist across all criteria categories' },
  { phase: 'Cross-test', work: 'Contributed additional WCAG checklist evaluations across sites 1 and 2 to supplement the full team\'s coverage' },
  { phase: 'Synthesize', work: 'Translated Site 4 checklist results into the structured per-page audit report section, including conformance ratings, error categorization, and the targeted 5-item remediation plan' },
  { phase: 'Present', work: 'Served as Presentation Lead for the team: structured the deck architecture (test coverage, methods, persona-driven findings, recommendations), designed the presentation approach, and led delivery of the persona introduction and Site 4 findings sections to the Michigan Courts client audience' },
  { phase: 'Report', work: 'Contributed to final written report: created the team\'s shared report document, drafted the Site 4 section, and contributed to the comprehensive remediation plan section covering all four priority tiers' },
]

export default function CourtsAudit({ onHome }) {
  return (
    <div className="case-study-page" style={THEME}>
      <Navbar onHome={onHome} label="SI 338 · WCAG 2.1 AA Audit" />

      <CaseStudyHero
        title="Michigan Courts System Accessibility Audit"
        subtitle="A WCAG 2.1 AA compliance audit of the Michigan Courts website, evaluating seven pages for barriers faced by users with disabilities and delivering a prioritized remediation roadmap to a real government client."
        meta={META}
      />

      <section>
        <SectionLabel>The Problem</SectionLabel>
        <h2>Evaluating a public legal resource against the accessibility standard Michigan has adopted</h2>
        <p>The Michigan Courts System website serves a wide range of users: attorneys filing motions, journalists tracking court decisions, and members of the public navigating legal processes with varying degrees of familiarity. It hosts court rules, hearing schedules, filing portals, and data dashboards, often as the primary point of contact between citizens and the court system.</p>
        <p>We audited seven distinct pages across the Michigan Courts site to document where it conforms, where it falls short, and what the path to full compliance looks like.</p>
        <p>Accessibility on a legal information site carries real weight. Barriers that prevent a screen reader user from navigating a form, or a keyboard user from identifying which element is focused, have consequences beyond inconvenience. Getting the baseline right matters for this kind of site.</p>
        <StatRow stats={STATS} />
      </section>

      <section>
        <SectionLabel>Discovery</SectionLabel>
        <h2>Three testing methods, seven pages, and one consistent pattern</h2>
        <p>Our team audited seven pages of the Michigan Courts site using a layered testing approach. We started with automated tools for broad coverage, moved to manual keyboard-only navigation for interaction fidelity, and ended with VoiceOver screen reader testing on both desktop and mobile for the most nuanced findings. No single tool catches everything, and the combination was intentional.</p>
        <div className="tool-row">
          {TOOLS.map(tool => (
            <span key={tool} className="tool-tag">{tool}</span>
          ))}
        </div>
        <p>Pages covered included the Homepage, For Filers in Trial Courts, the Interactive Court Data Dashboard, Consent Verification Registration, Court Communications, Michigan Court Rules, and Problem-Solving Courts. Each team member owned one or more pages for automated and manual testing; Cassidy led all screen reader testing across the full site.</p>
        <ImageSlot label="Screenshot">Team project tracker: page assignments, task checklist, and WCAG conformance summary across all 7 sites</ImageSlot>
        <p>The pattern that emerged across all seven pages was consistent. The site had good bones in some areas (page titles, consistent navigation structure, readable zoom behavior) but failed repeatedly on contrast, semantic structure, and keyboard interaction. These weren't isolated bugs. They were architectural patterns repeated across the entire site.</p>
        <h3>Four failure categories that showed up everywhere</h3>
        <FindingBlock label="Color contrast">
          Contrast below WCAG minimums across multiple pages, ranging from marginal misses to near-zero ratios. Most severe on the Interactive Court Data Dashboard.
        </FindingBlock>
        <FindingBlock label="Missing or broken semantic structure">
          Most pages were missing proper landmark elements (&lt;main&gt;, &lt;header&gt;, &lt;footer&gt;). Heading levels were skipped, making screen reader navigation disorienting. "Skip to main content" links were present on most pages but nonfunctional: not keyboard-activatable, and pointing to sections that didn't exist.
        </FindingBlock>
        <FindingBlock label="Unlabeled interactive elements">
          Empty buttons and icons with no accessible names across every page. SVG graphics missing title and description elements. Form fields missing programmatic label associations.
        </FindingBlock>
        <FindingBlock label="Focus indicator failures">
          Keyboard users had no reliable way to track which element was active. No consistent visible focus state across the site.
        </FindingBlock>
      </section>

      <section>
        <SectionLabel>Strategy</SectionLabel>
        <h2>Framing findings for a government client, not a design team</h2>
        <p>Our deliverable was a written audit report and a 15-minute live presentation to the Michigan Courts client team. As Presentation Lead, I was responsible for deciding how to structure that 15 minutes. The audience wasn't designers or engineers; it was a government team that needed to understand the scope of the problem and what to prioritize.</p>
        <p>I made two structural decisions early. First, the presentation would be organized around personas rather than WCAG criteria numbers. Citing WCAG 1.4.3 to a client audience is opaque. Showing how a specific user with blue-yellow colorblindness can't read the data dashboard is concrete. Second, I insisted on grounding each finding in the specific page and user context where we found it, not just listing error counts.</p>
        <p>The audit report organized the findings into a four-tier remediation roadmap: immediate action (navigation and focus), short-term action (screen reader compatibility), medium-term action (form accessibility and link labeling), and long-term action (mobile responsiveness and user preference support). This framing gave the client a clear sense of urgency and sequence, not just a dump of problems.</p>
        <ImageSlot label="Screenshot">Team presentation slides: cover, agenda, personas, per-page findings, and recommendations</ImageSlot>
      </section>

      <section>
        <SectionLabel>User Research</SectionLabel>
        <h2>Four personas built to ground technical findings in human reality</h2>
        <p>I developed the four accessibility personas used in the presentation, each designed to represent a distinct disability context and a specific failure mode we had documented. Using personas let us connect abstract WCAG criteria to real-world consequences for real types of users.</p>
        <div className="persona-grid">
          {PERSONAS.map(({ name, role, description }) => (
            <div key={name} className="persona-card">
              <div className="persona-name">{name}</div>
              <div className="persona-role">{role}</div>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Page Deep Dive</SectionLabel>
        <h2>Site 4: the most accessible page on the site, and what it still got wrong</h2>
        <p>I owned the WCAG 2.1 AA audit of Site 4, the Consent Verification Registration page. This was the supply-side critical page: it's the form a user fills out to register for access to confidential court data. If a user can't complete this form, they can't proceed. And unlike the rest of the site, this page was built carefully.</p>
        <h3>What was working</h3>
        <p>The Consent Verification Registration page was the strongest-performing page in the audit by a significant margin. WAVE detected no meaningful errors. The report even flagged it explicitly: "Nice job here!" That's not a phrase you expect in a WCAG audit report. The reasons it worked were structural: form labels were programmatically associated with their fields, logical heading order was maintained from h1 through h3, required field status was announced by the screen reader, text examples within form fields were read aloud, and checkbox states were clearly communicated on state change.</p>
        <Callout label="The Outlier Finding" stat="0">
          <p>Meaningful WAVE errors detected on Site 4, the Consent Verification Registration page. While every other page in the audit had between 9 and 80+ errors flagged by automated tools, this page had zero. The contrast passed, the structure was sound, and the screen reader experience was genuinely good. This was worth understanding, not just noting.</p>
        </Callout>
        <h3>What it got wrong anyway</h3>
        <p>Even the best page had issues the automated tools didn't catch, which was itself an important finding: automated testing alone is not sufficient. Axe flagged two structural errors that WAVE missed. The ARIA "required" attribute was applied to parent container divs rather than the input elements themselves, which is a semantic misuse that could confuse some assistive technologies even if the visual form works correctly. And the three address sub-fields (City, State, Zip) had no programmatic labels, meaning a screen reader user couldn't identify what each field was for without inferring from context.</p>
        <p>Manual keyboard testing revealed two more failures invisible to automated tools. The "skip to main content" link was visually present but could only be activated with a mouse click, not a keyboard. And the focus indicator, while technically present, was too low-contrast to track reliably across links, and was entirely absent on checkboxes and radio buttons.</p>
        <ImageSlot label="Screenshot">Site 4 WCAG checklist: conformance ratings across navigation, screen reader, keyboard, and form handling criteria</ImageSlot>
        <h3>The remediation plan</h3>
        <p>Five targeted fixes would bring this page to full AA conformance. Replace div containers around grouped content with semantic section tags. Add the word "required" next to the asterisk marking required fields, so the requirement is communicated in text, not just visually. Add explicit labels to the City, State, and Zip fields. Move the aria-required attribute from parent divs to the input elements directly. And restyle the focus indicator with higher contrast and a visible outline for checkboxes and radio buttons.</p>
        <p>These weren't dramatic changes. The page's foundation was solid. The fixes were precise and surgically targeted, which made this page the easiest remediation in the report.</p>
      </section>

      <section>
        <SectionLabel>Findings Across All 7 Pages</SectionLabel>
        <h2>Four recommendations that applied site-wide</h2>
        <p>After synthesizing findings across all seven pages, the team identified four remediation priorities that were universal, either failing or partially failing on every page tested. These became the centerpiece of our client presentation.</p>
        <DecisionCard number={1} title="Add descriptive alt text to all images and buttons" rationale="Screen reader users have no visual fallback. 'image' as an alt text is not neutral. It actively misleads. Descriptive alt text is the baseline of web accessibility, and it was failing site-wide.">
          <p>Every page had some form of alt text failure: generic "image" labels, missing alt attributes on SVG icons, functional buttons with no accessible name. The homepage alone had 79 empty buttons. This was the single most pervasive issue across the site and the most straightforward to fix: functional icons need descriptive text, and decorative images need to be hidden from the accessibility tree.</p>
        </DecisionCard>
        <DecisionCard number={2} title="Add captions or transcripts to all audio-video content" rationale="Multimedia without captions excludes an entire disability population. This isn't a nuanced conformance question; it's a binary fail against a clearly defined criterion.">
          <p>The For Filers in Trial Courts page hosts video resources with zero captions or transcripts. A hard-of-hearing user has no access to that content. WCAG 1.2.2 requires captions for all prerecorded synchronized media. This wasn't a partial failure; it was a complete absence of compliance on any video content on the site.</p>
        </DecisionCard>
        <DecisionCard number={3} title="Fix contrast ratios across text, icons, and data visualizations" rationale="Contrast is the most-failed WCAG criterion across the web. It's also the most measurable: there's a number, there's a threshold, and you either meet it or you don't. Low contrast doesn't just affect people with visual impairments. It affects everyone reading in bright light or on a small screen.">
          <p>Text-to-background contrast ratios as low as 1:1 were found across multiple pages. WCAG AA requires 4.5:1 for normal text and 3:1 for large text and non-text elements. The Interactive Court Data Dashboard had 79 contrast errors. The data visualizations used color coding that was functionally meaningless for users with color-vision deficiencies.</p>
        </DecisionCard>
        <DecisionCard number={4} title="Add visible focus state highlighting to all keyboard-navigable elements" rationale="Focus visibility is the keyboard user's cursor. Without it, keyboard navigation becomes guesswork. Any interactive element that can receive focus must be visibly identifiable as focused. This was failing everywhere.">
          <p>Across all seven pages, keyboard users frequently couldn't tell where they were. Focus rings were absent, too low-contrast to see, or inconsistently applied across element types. The tab order on several pages required cycling through dozens of navigation elements before reaching meaningful content.</p>
        </DecisionCard>
      </section>

      <section>
        <SectionLabel>My Contributions</SectionLabel>
        <h2>What I owned across each phase</h2>
        <ContribGrid items={CONTRIBUTIONS} />
      </section>

      <CaseStudyFooter>Anthony Shephard · University of Michigan · 2025</CaseStudyFooter>
    </div>
  )
}
