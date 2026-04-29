import Navbar from '../components/Navbar'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import GridFrames from '../components/GridFrames'
import ImageSlot from '../components/ImageSlot'
import BeforeAfterPair from '../components/BeforeAfterPair'
import ResearchCarousel from '../components/ResearchCarousel'
import StatRow from '../components/StatRow'
import VideoSection from '../components/VideoSection'
import PullQuote from '../components/PullQuote'
import TableOfContents from '../components/TableOfContents'
import CaseStudyFooter from '../components/CaseStudyFooter'

import imgResearchIdeation  from '../assets/SI 311 Project Team Echo Ideation.png'
import imgResearchLeanCanvas from '../assets/SI 311 Project Team Echo Lean Canvas.png'
import imgResearchVPC        from '../assets/SI 311 Project Team Echo Value Proposition Canvas.png'
import imgResearchJourney    from '../assets/SI 311 Project Team Echo User Journey Map.png'
import imgResearchBPv1       from '../assets/SI 311 Project Team Echo Service Blueprint v1.png'
import imgResearchBPv2       from '../assets/SI 311 Project Team Echo Service Blueprint v2.png'

const RESEARCH_SLIDES = [
  { src: imgResearchIdeation,  label: 'Research synthesis & ideation' },
  { src: imgResearchLeanCanvas, label: 'Lean canvas' },
  { src: imgResearchVPC,        label: 'Value proposition canvas' },
  { src: imgResearchJourney,    label: 'User journey map' },
  { src: imgResearchBPv1,       label: 'Service blueprint v1' },
  { src: imgResearchBPv2,       label: 'Service blueprint v2' },
]

const META = [
  { label: 'Project', value: 'Roamio' },
  { label: 'Course', value: 'SI 311' },
  { label: 'Role', value: 'Researcher, Strategy' },
  { label: 'Owned', value: 'Customer Discovery' },
  { label: 'Team', value: '4 (Team Echo)' },
  { label: 'Duration', value: '15 weeks' },
  { label: 'Year', value: 'Spring 2026' },
]

const STATS = [
  { label: 'Apps per trip', value: '5+', delta: 'typical Gen Z planning stack', tone: 'warn' },
  { label: 'Want local immersion', value: '72%', delta: 'Gen Z travelers', tone: 'good' },
  { label: 'Tools combining curation + booking', value: '0', delta: 'in current market', tone: 'info' },
]

const PILLARS = [
  { ix: '4.1', name: 'Homepage', label: 'Every Local Knows Something You Don\'t' },
  { ix: '4.2', name: 'Explore', label: 'Gamified World Map' },
  { ix: '4.3', name: 'Package Detail', label: 'Agent Profile + Teased Secrets' },
  { ix: '4.4', name: 'My Trip', label: 'Secrets Unlocked' },
]

const SECTIONS = [
  { num: 1, label: 'The problem', id: 'sec-1' },
  { num: 2, label: 'Discovery', id: 'sec-2' },
  { num: 3, label: 'Strategy', id: 'sec-3' },
  { num: 4, label: 'Final composition', id: 'sec-4' },
  { num: 5, label: 'Research deep dive', id: 'sec-5' },
  { num: 6, label: 'Validation', id: 'sec-6' },
  { num: 7, label: 'Iteration', id: 'sec-7' },
  { num: 8, label: 'Try it', id: 'sec-8' },
  { num: 9, label: 'Walkthrough', id: 'sec-9' },
  { num: 10, label: 'Contributions', id: 'sec-10' },
  { num: 11, label: 'Reflection', id: 'sec-11' },
]

const HYPOTHESES = [
  { id: 'D1', text: 'Travelers prefer human-curated local recs over algorithmic alternatives. 5/5 rejected AI recs. Average 4.2/5 on "local agent more appealing than algorithm."', signal: 'validated', signalText: 'Validated' },
  { id: 'D2', text: 'Gamified map increases engagement over list browsing. 2/5 strongly engaged; map ranked #4 of 6 features. Curated itinerary ranked #1.', signal: 'partial', signalText: 'Partial' },
  { id: 'D3', text: 'Travelers are frustrated by fragmented planning tools and want a centralized flow. Strong signal for group planners; weaker for solo and resort travelers.', signal: 'partial', signalText: 'Partial' },
  { id: 'D4', text: 'Travelers actively seek hidden, gatekept local spots and feel underserved. 4/5 actively seek. Concept resonated; execution of the reveal needed work.', signal: 'validated', signalText: 'Validated' },
  { id: 'D5', text: 'Identity-linked reviews are more trusted than anonymous reviews. 3/5 preferred named. P3 prefers anonymous (Reddit). Split signal across participant types.', signal: 'partial', signalText: 'Partial' },
  { id: 'V1', text: 'Gen Z will pay for curated packages; price sensitivity tied to scope. WTP confirmed ($50–200 itinerary, $2K+ full package) but only when pricing is transparent.', signal: 'conditional', signalText: 'Conditional' },
  { id: 'V2', text: 'Target segment is large enough and travels frequently enough. 4/5 travel 2+ times per year. Directional confirmation only; a larger sample is needed.', signal: 'partial', signalText: 'Directional' },
  { id: 'V3', text: 'Local experts willing to create packages at a 25–50% commission. Not testable with demand-side participants. A supply-side research sprint is the next critical step.', signal: 'partial', signalText: 'Untested' },
  { id: 'V4', text: 'Travelers would choose Roamio over free alternatives. "With flexibility, I would." Rigidity of bundles was the primary adoption blocker.', signal: 'partial', signalText: 'Partial' },
  { id: 'V5', text: 'Referral discount drives organic acquisition. 4/5 very or somewhat likely to refer with a discount. Strongest viability signal in the dataset.', signal: 'validated', signalText: 'Validated' },
]

const CONTRIBUTIONS = [
  { phase: 'Problem', work: 'Contributed to problem framing and competitive landscape analysis. Helped define the customer persona: Gen Z and Millennial independent travelers frustrated by fragmented, untrustworthy planning tools.' },
  { phase: 'Strategy', work: 'Co-owned the Journey and Blueprint deliverable for P2. Contributed to the Lean Business Canvas and helped define the two-sided marketplace structure connecting travelers to local agents.' },
  { phase: 'Research Design', work: 'Authored the customer discovery interview guide, covering warm-up, grand tour, and two deep-focus modules. Co-designed the usability test plan and hypothesis coverage map. Designed and deployed the post-session survey.' },
  { phase: 'Interviews', work: 'Facilitated and notetook for P1 (Adventure Traveler) and P2 (Group/Social Traveler). P1\'s checkout session produced the transparency insight that drove the most important post-test iterations.' },
  { phase: 'Synthesis', work: 'Coded all findings against the ten-hypothesis framework (D1-D5, V1-V5). Contributed to the affinity diagram and severity-scoring of usability issues.' },
  { phase: 'Validation', work: 'Owned the "What We Learned," "Validation and Product-Market Fit," and "What\'s Next" sections of the Demo Day final pitch. Presented research findings and hypothesis scorecard April 19, 2026.' },
  { phase: 'Prioritization', work: 'Translated usability findings into a severity-ranked backlog: itemized checkout (P0), package customization (P0), rich media reveals (P1), agent profiles (P1), activity tags (P2).' },
]

export default function Roamio({ onHome }) {
  return (
    <div className="case-study-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="roamio" />

      <CaseStudyHero
        kicker="Case Study · Customer Discovery · Spring 2026"
        title="The market wants what Roamio promises."
        titleEmphasis="Information design turned out to be a business model problem."
        subtitle="A travel marketplace connecting Gen Z and Millennial travelers with verified local agents who curate trip packages featuring insider secrets, built from scratch in 15 weeks as part of a zero-to-one product design course."
        meta={META}
        corners={{ tl: '+ 00.00', tr: '21:9 · HERO', bl: 'ROAMIO · TEAM ECHO', br: 'SPRING 2026 · SI 311' }}
        heroLabel="Roamio, final composition"
      />

      <div className="case-study-layout">
        <aside className="toc-rail">
          <TableOfContents sections={SECTIONS} />
        </aside>

        <main id="main-content">

        <div className="section" id="sec-1">
          <SectionLabel num={1}>The problem</SectionLabel>
          <h2>Planning a trip today means juggling five apps and trusting strangers on the internet.</h2>
          <div className="body-text">
            <p>Gen Z and Millennial travelers want authentic, locally informed experiences. What they get instead is a research spiral: Reddit threads, TikTok saves, Google Maps lists, travel blogs, booking platforms, and group chats, all running in parallel, all pointing to different places, none of them trustworthy enough to book without second-guessing.</p>
            <p>The core tension is a trust problem. 42% of Gen Z booked a guided tour last year, and 72% say they want to immerse themselves in local culture. But no platform gives them a named, accountable person whose expertise they can evaluate. Anonymous reviews have no skin in the game. AI-generated itineraries are indistinguishable from each other. And tools that surface local knowledge don't connect to booking.</p>
          </div>
          <StatRow stats={STATS} />
        </div>

        <div className="section" id="sec-2">
          <SectionLabel num={2}>Discovery</SectionLabel>
          <h2>Why existing tools fail, and what travelers actually want instead.</h2>
          <div className="body-text">
            <p>SI 311 is a zero-to-one product design course built around five sequential phases. Team Echo's research phase ran across phases three and four, spanning customer discovery interviews, moderated usability tests, and a post-session survey.</p>
            <p>I designed the customer discovery interview guide and co-designed the usability test plan. The interview guide had three modules: warm-up (travel profile and recent trip), a grand tour question (step-by-step planning walkthrough), and two deep focus areas (local recommendations and planning tools). This was deliberate: we wanted participants to surface their real behavior before we introduced Roamio, so their reactions weren't colored by what they thought we wanted to hear.</p>
            <p>The team ran five sessions in total, each pairing a discovery interview with a usability test and a survey. I facilitated and notetook two of the five.</p>
          </div>
          <ResearchCarousel slides={RESEARCH_SLIDES} lightbox />
          <div className="body-text">
            <p>The competitive landscape was revealing: Airbnb Experiences offered a marketplace but no curation. Viator handled tour logistics but not insider knowledge. Reddit and TikTok surfaced authentic local content but had no booking. ToursByLocals offered private tours but no hidden-gem mechanic. Nobody combined a named local expert, insider recommendations, and centralized booking in one place.</p>
          </div>
        </div>

        <div className="section" id="sec-3">
          <SectionLabel num={3}>Strategy</SectionLabel>
          <h2>A two-sided marketplace built on the premise that the local agent is the product.</h2>
          <div className="body-text">
            <p>Roamio is a two-sided marketplace: travelers pay for curated packages with insider secrets, local agents create and sell those packages, and Roamio takes a 15–25% platform commission. Revenue streams include package commissions, premium add-ons, and a la carte secrets.</p>
          </div>
          <ImageSlot id="3.1" caption="Lean Business Canvas: problem, solution, key metrics, UVP, channels, customer segments, revenue streams, cost structure." />
          <div className="body-text">
            <p>The team grounded the strategy in ten testable hypotheses across two dimensions: desirability (D1–D5) and viability (V1–V5). Each interview question, usability task, and survey item mapped to at least one hypothesis. Going into testing, the most critical question was D1: would travelers actually prefer a named human expert over algorithmic alternatives? The entire value proposition depended on the answer being yes.</p>
          </div>
        </div>

        <div className="section" id="sec-4">
          <SectionLabel num={4}>Final composition</SectionLabel>
          <h2>Four screens, one complete journey from discovery to unlocked secrets.</h2>
          <GridFrames items={PILLARS} cols={4} aspect="9x16" />
          <h3>Homepage and value proposition</h3>
          <div className="body-text">
            <p>The homepage opens with "Every Local Knows Something You Don't" and immediately surfaces three pillars: Verified Local Agents, Secrets Revealed, Insider Access. A "How It Works" section explains the tease-then-reveal mechanic.</p>
          </div>
          <h3>Explore: gamified world map</h3>
          <div className="body-text">
            <p>An interactive world map where regions light up as users discover them. Destinations are surfaced through map exploration rather than search, encouraging wandering rather than querying. P5 called it their favorite feature in the prototype.</p>
          </div>
          <h3>Package detail and agent profile</h3>
          <div className="body-text">
            <p>Each package shows the agent by name, where they're from, their credentials, and a preview of the secrets included. The full list of insider spots remains locked until booking, creating curiosity and purchase motivation.</p>
          </div>
          <h3>My Trip: secrets unlocked</h3>
          <div className="body-text">
            <p>The post-booking dashboard is the payoff. Confirmed travelers see the full list of insider spots, a message from the local agent with personal context, and a curated guide they keep forever. The reveal should feel like a gift, not a receipt.</p>
          </div>
        </div>

        <div className="section" id="sec-5">
          <SectionLabel num={5}>Research deep dive</SectionLabel>
          <h2>The interview that changed the checkout.</h2>
          <div className="body-text">
            <p>I facilitated two of the five research sessions. P1 and P2 produced some of the most consequential data in the project, and the insight from P1's checkout reaction became the product's central post-test pivot.</p>
          </div>
          <h3>P1: the adventure traveler</h3>
          <div className="body-text">
            <p>P1 was an experienced adventure traveler who allocates two to four weeks per year to travel. He described himself as "intrepid," willing to take risks. During the discovery interview, he was measured about Roamio: open to local curation, but not convinced the platform was necessary given his own ability to filter information. His attitude going into the usability test was informed skepticism.</p>
            <p>Everything changed at the checkout screen. He looked at the package price, found it "reasonable," then asked whether flights were included. When I confirmed they weren't, his reaction was immediate and unambiguous.</p>
          </div>

          <PullQuote
            id="P1 · usability test"
            who="Adventure Traveler"
            context="immediately after learning flights were not included"
            ref="REF Q.5.1"
          >
            "Then too expensive. All too expensive. Is it flights, hotels, meals? If it's just hotel and the guide, not worth it."
          </PullQuote>

          <div className="body-text">
            <p>Within thirty seconds, P1 had gone from willing to pay to completely unwilling, and the reason had nothing to do with the price itself. It was the absence of an itemized breakdown. He couldn't evaluate value because he couldn't see what he was buying.</p>
          </div>

          <h3>The pattern across sessions</h3>
          <div className="body-text">
            <p>I brought this finding into the team's synthesis session, and it aligned with what was surfacing across the other three sessions. P2 couldn't find hotel information on the package detail page. P3 said outright that she "would not book if I didn't know what I was booking." The pattern was unmistakable.</p>
          </div>

          <Callout
            tone="info"
            stat="4"
            label="The core insight"
            title="All four critical issues traced back to one root cause: information opacity before booking."
          >
            <p>The blind booking mechanic, the missing checkout breakdown, the lack of customization, and the text-only secret reveal were all downstream of the same product problem. The price wasn't the blocker. The information vacuum around the price was.</p>
          </Callout>

          <h3>Translating the finding into priorities</h3>
          <div className="body-text">
            <p>I synthesized these findings into a prioritized action list, framed by severity and adoption impact. Two issues earned P0: itemized breakdown with hotel details, and package customization so travelers could choose hotels, dates, and buy secrets separately. A third earned P1: enriching the secret reveal with maps, photos, and pins.</p>
          </div>
        </div>

        <div className="section" id="sec-6">
          <SectionLabel num={6}>Validation</SectionLabel>
          <h2>What five participants revealed across ten hypotheses.</h2>
          <div className="body-text">
            <p>All findings were coded against the ten hypotheses defined before any research began. Each participant contributed across three methods. The scorecard below reflects the triangulated signal.</p>
          </div>

          <div className="hypothesis-grid">
            <div className="hypothesis-row header">
              <div className="hyp-id header-label">ID</div>
              <div className="hyp-text header-label">Hypothesis</div>
              <div className="hyp-signal header-label">Signal</div>
            </div>
            {HYPOTHESES.map(({ id, text, signal, signalText }) => (
              <div key={id} className="hypothesis-row">
                <div className="hyp-id">{id}</div>
                <div className="hyp-text">{text}</div>
                <div className={`hyp-signal ${signal}`}>{signalText}</div>
              </div>
            ))}
          </div>

          <div className="body-text">
            <p>The strongest signal was D1: human curation over algorithmic recs. Every participant, unprompted, articulated some version of the same preference. The most important conditional finding was V1: willingness to pay is real, but it is gated behind transparency. Travelers know what they want to pay once they understand what they're getting. The product's job is to close that information gap before checkout.</p>
          </div>
        </div>

        <div className="section" id="sec-7">
          <SectionLabel num={7}>Iteration</SectionLabel>
          <h2>Five product changes that came directly from testing.</h2>
          <div className="body-text">
            <p>The research synthesis produced a prioritized backlog of design changes, each a direct response to observed user behavior. The pivotal change was the checkout: the moment that triggered P1's hard reversal in the previous section, and the moment that, once redesigned, removed the friction that nearly every participant ran into.</p>
          </div>

          <BeforeAfterPair
            aspect="9x16"
            before={{
              label: 'FIG. 7.1 · V1, Pre-test checkout',
              tag: 'P1 reversed in 30s',
              placeholder: 'V1: package price only, no line items, included/excluded items unclear',
              annotations: [
                'Single price with no breakdown of agent fee, hotel, or activities.',
                'Inclusions and exclusions (e.g., flights) not surfaced until asked.',
                'Travelers cannot evaluate value before committing.',
              ],
            }}
            after={{
              label: 'FIG. 7.2 · V2, Revised checkout',
              tag: 'design for ship',
              placeholder: 'V2: itemized line items, hotel selector, exclusions explicit, customization options',
              annotations: [
                'Complete line-item breakdown: agent fee, hotel, activities.',
                'Exclusions (flights, meals) called out explicitly above the total.',
                'Hotel selector and a la carte secrets enable package customization.',
              ],
            }}
          />

          <div className="body-text">
            <p>Beyond the checkout, four further changes shipped before Demo Day, each tracing back to a specific observed behavior across the five sessions.</p>
          </div>

          <DecisionCard number={1} title="Package customization: a la carte secrets and hotel choice" rationale="Flexibility unlocks conversion. Forcing travelers into fixed bundles creates the impression of a product that wasn't designed for them.">
            <p>Multiple participants wanted to buy secrets without the full package, or swap to a preferred hotel. The revision introduced customization options: select hotel, adjust dates, purchase secrets standalone.</p>
          </DecisionCard>
          <DecisionCard number={2} title="Rich media secret reveals" rationale="The reveal is the product's most memorable moment. If it underwhelms, the entire purchase feels like a mistake.">
            <p>The prototype's reveal was text-only. P2 wanted maps, photos, and pin drops. The revision introduced rich media reveals: photos, location pins, and context notes alongside each secret.</p>
          </DecisionCard>
          <DecisionCard number={3} title="Richer agent profiles" rationale="Trust in a named local expert requires enough information to actually judge them.">
            <p>P1 wanted a photo and bio for the agent. P2 noted that interest alignment mattered more than identity alone. The revision added agent profile photos, bios, local context, and activity tags so travelers could assess whether a specific agent's taste matched their own.</p>
          </DecisionCard>
          <DecisionCard number={4} title="Activity tags for interest matching" rationale="When travelers find packages that match before they click, they spend more time evaluating rather than scanning and leaving.">
            <p>Participants with different travel styles had different implicit filters. Activity tags surface the right packages faster.</p>
          </DecisionCard>
        </div>

        <div className="section" id="sec-8">
          <SectionLabel num={8}>Try it</SectionLabel>
          <h2>Interactive prototype.</h2>
          <div className="body-text" style={{ marginBottom: '24px' }}>
            <p>The final Roamio prototype was built in Figma Make. Open it in a new tab to click through the homepage, world map, package detail, checkout, and the secrets-unlocked dashboard.</p>
          </div>
          <div className="prototype-link-wrapper">
            <div className="prototype-link-tagline">Every Local Knows Something You Don't</div>
            <a
              href="https://www.figma.com/make/8aDzPLod12FLVoPWeNwNGD/Travel-Package-Service-Prototype?fullscreen=1"
              target="_blank"
              rel="noopener noreferrer"
              className="prototype-link-btn"
            >
              Open the prototype →
            </a>
            <p className="prototype-note">Figma Make prototype, opens in a new tab.</p>
          </div>
        </div>

        <div className="section" id="sec-9">
          <SectionLabel num={9}>Walkthrough</SectionLabel>
          <h2>Demo Day video tour.</h2>
          <VideoSection
            description="A guided tour of the final Roamio prototype presented at SI 311 Demo Day, April 2026."
            mp4="roamio-demo.mp4"
            mov="roamio-demo.mov"
          />
        </div>

        <div className="section" id="sec-10">
          <SectionLabel num={10}>My contributions</SectionLabel>
          <h2>What I owned across each phase.</h2>
          <ContribGrid items={CONTRIBUTIONS} />
        </div>

        <div className="section" id="sec-11">
          <SectionLabel num={11}>Reflection</SectionLabel>
          <h2>What I'd do differently as the PM.</h2>
          <div className="body-text">
            <p>The biggest product lesson was about the gap between a compelling concept and a trustworthy product. The market wants what Roamio promises. But information design turned out to be a business model problem: when travelers couldn't see what they were buying, they didn't buy.</p>
            <p>In a product role, I would have pushed for transparency as a first-class feature from the beginning rather than a post-test fix. Define what information a traveler needs to feel confident at checkout before designing the checkout, not after testing it.</p>
            <p>Three specific changes. First, I would have interviewed supply-side participants (local agents and tour operators). All our research was demand-side. V3 (commission willingness) was marked "not testable" throughout, and that's a critical assumption to leave unexamined for an entire semester. Second, I would have defined quantitative success thresholds before testing: what task completion rate would validate each hypothesis, what Likert score would qualify as "high enough to ship." Third, I would have run a second round of usability testing on the revised prototype before Demo Day. We iterated based on findings and shipped five changes, but never verified those changes worked.</p>
          </div>
          <h3>If Roamio continued</h3>
          <div className="body-text">
            <p>The immediate next steps are supply-side validation: recruit and interview local agents in two or three candidate pilot cities to test the commission model. The agent onboarding flow is the product that makes all the other product work. Without a usable creation experience, there are no packages to browse, no secrets to unlock, and no marketplace. The local agent is the product. Everything else is infrastructure.</p>
          </div>
        </div>

        </main>
      </div>

      <CaseStudyFooter slug="roamio · si-311" />
    </div>
  )
}
