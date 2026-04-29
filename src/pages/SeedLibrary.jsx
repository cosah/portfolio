import Navbar from '../components/Navbar'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import GridFrames from '../components/GridFrames'
import ImageSlot from '../components/ImageSlot'
import BeforeAfterPair from '../components/BeforeAfterPair'
import StatRow from '../components/StatRow'
import TableOfContents from '../components/TableOfContents'
import CaseStudyFooter from '../components/CaseStudyFooter'

import imgPlantListing from '../assets/seed-plant-listing.png'
import imgPlantDetail from '../assets/seed-plant-detail.png'
import imgEvents from '../assets/seed-events-page.png'
import imgHomepage from '../assets/seed-homepage.png'
import imgPersona1 from '../assets/seed-persona-2.png'
import imgPersona2 from '../assets/seed-persona-1.png'
import imgEvalBoard from '../assets/seed-eval-board.png'

const META = [
  { label: 'Project', value: 'UM Seed Library' },
  { label: 'Course', value: 'SI 487 Capstone' },
  { label: 'Role', value: 'Researcher, Liaison' },
  { label: 'Owned', value: 'Research Report' },
  { label: 'Team', value: '4 members' },
  { label: 'Duration', value: '2 semesters' },
  { label: 'Year', value: '2025–2026' },
]

const STATS = [
  { label: 'Field flow completion', value: '4.3%', delta: 'pre-redesign baseline', tone: 'warn' },
  { label: 'Awareness gap', value: '85%', delta: 'never heard of it', tone: 'warn' },
  { label: 'Seed identification', value: '0 / 7', delta: 'pre-design usability', tone: 'warn' },
]

const METHODS = ['Field Study (n=185)', 'Moderated Usability (n=7)', 'Campus Survey (n=53)', 'Google Analytics (n=110)', 'Affinity Diagramming', 'Persona + Journey Mapping', 'Wizard of Oz Prototyping']

const FINAL_PAGES = [
  { ix: '7.1', name: 'Plant Listing', src: imgPlantListing, alt: 'Plant Listing page', desc: 'QR entry point. Seeds organized by library location, filterable by capsule color.' },
  { ix: '7.2', name: 'Plant Detail', src: imgPlantDetail, alt: 'Plant Detail page', desc: 'Beginner-first care instructions. Difficulty rating, growing specs, student testimonials.' },
  { ix: '7.3', name: 'Events', src: imgEvents, alt: 'Events page', desc: 'Filterable community programming with attendance indicators.' },
  { ix: '7.4', name: 'Homepage', src: imgHomepage, alt: 'Homepage', desc: 'Mission-led entry for users discovering the program outside the QR flow.' },
]

const PERSONAS = [
  { ix: 'P1', name: 'Britt', src: imgPersona1, alt: 'Britt — experienced gardener seeking community connection', desc: 'Experienced gardener seeking community connection.', contain: true },
  { ix: 'P2', name: 'Casey', src: imgPersona2, alt: 'Casey — curious beginner looking for a low-effort hobby', desc: 'Curious beginner looking for a low-effort hobby.', contain: true },
]

const SECTIONS = [
  { num: 1, label: 'The problem', id: 'sec-1' },
  { num: 2, label: 'Methods', id: 'sec-2' },
  { num: 3, label: 'Discovery findings', id: 'sec-3' },
  { num: 4, label: 'Synthesis', id: 'sec-4' },
  { num: 5, label: 'Design requirements', id: 'sec-5' },
  { num: 6, label: 'Strategy', id: 'sec-6' },
  { num: 7, label: 'Final composition', id: 'sec-7' },
  { num: 8, label: 'Pivotal redesign', id: 'sec-8' },
  { num: 9, label: 'Testing', id: 'sec-9' },
  { num: 10, label: 'Try it', id: 'sec-10' },
  { num: 11, label: 'Results', id: 'sec-11' },
  { num: 12, label: 'Contributions', id: 'sec-12' },
  { num: 13, label: 'Reflection', id: 'sec-13' },
]

const CONTRIBUTIONS = [
  { phase: 'Client', work: 'Primary client liaison during research. Aligned methods and design requirements with the Seed Library\'s mission, sustainability goals, and Google Sites platform constraints.' },
  { phase: 'Research Plan', work: 'Designed the mixed-methods research strategy: structured four methods around three research goals so each goal was triangulated by multiple methods.' },
  { phase: 'Field Study', work: 'Contributed to the four-session field study in Shapiro Library (185 observations), logging interactions against a rainbow spreadsheet of intended and unintended steps.' },
  { phase: 'Usability', work: 'Co-conducted moderated usability testing with the pre-design flow (7 participants), documenting completion rates, confusion points, and sentiment.' },
  { phase: 'Synthesis', work: 'Led synthesis through affinity diagramming. Translated findings into two personas, a user journey map, a user flow diagram, and the seven design requirements.' },
  { phase: 'Requirements', work: 'Authored the UX Research and Design Requirements Report: the foundational document that defined the problem space and established the testable requirements every design decision was evaluated against.' },
  { phase: 'Design', work: 'Co-designed across physical and digital touchpoints: ideation, Crazy 8\'s sketching, design system, and lo-fi through hi-fi screens.' },
  { phase: 'Evaluation', work: 'Contributed to the three-phase usability evaluation (14 participants total across paper prototype and full-system rounds), comparing pre- and post-design metrics.' },
]

export default function SeedLibrary({ onHome }) {
  return (
    <div className="case-study-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="seed-library" />

      <CaseStudyHero
        kicker="Case Study · UX Research & Design · BSI UX Pathway Award"
        title="A program nobody knew about,"
        titleEmphasis="redesigned for the people it was built for."
        subtitle="Redesigning the physical and digital experience of a campus seed distribution system, from a gumball machine with a 4% completion rate to a connected ecosystem tested with 355 participants. Winner of the BSI UX Pathway Award at the 2026 UMSI Exposition."
        meta={META}
        corners={{ tl: '+ 00.00', tr: '21:9 · HERO', bl: 'UM SEED LIBRARY', br: '2025–2026 · SI 487' }}
        heroLabel="UM Seed Library, final composition"
      />

      <div className="case-study-layout">
        <aside className="toc-rail">
          <TableOfContents sections={SECTIONS} />
        </aside>

        <main id="main-content">

        <div className="section" id="sec-1">
          <SectionLabel num={1}>The problem</SectionLabel>
          <h2>A sustainability resource that nearly everyone walks past.</h2>
          <div className="body-text">
            <p>The University of Michigan Seed Library is a campus initiative that offers free seeds through a novel distribution method: gumball machines placed in campus libraries. Users turn a knob, receive a capsule with seeds inside, and are meant to continue online for growing instructions and community programming. The program supports sustainability education, connects people to gardening, and aims to build a circular seed-sharing community.</p>
            <p>The concept was compelling. The execution had gaps. The physical flow required users to interact with multiple machines, transfer seeds between containers, and infer sequencing from spatial proximity. The digital platform offered information but did not connect back to the physical experience. And 85% of the campus community had never heard of the program at all.</p>
            <p>As a two-semester capstone (SI 487), our four-person team partnered with the Seed Library to understand where the experience was breaking down and design solutions across both physical and digital touchpoints. The project ran in three phases (research, design, evaluation), with a real client expecting actionable recommendations they could implement.</p>
          </div>
          <StatRow stats={STATS} />
        </div>

        <div className="section" id="sec-2">
          <SectionLabel num={2}>Methods</SectionLabel>
          <h2>How I structured 355 participants across four research methods.</h2>
          <div className="body-text">
            <p>I owned the UX Research and Design Requirements Report, which meant designing the research plan, ensuring methodological alignment with the client's goals, and translating findings into the requirements that would drive every design decision. I also served as primary client liaison throughout the research phase.</p>
            <p>I organized the research plan around three goals, each tied to a specific research question. <strong>Discovery</strong>: how do users currently find the Seed Library, and what prevents awareness? <strong>Engagement</strong>: what makes users interact with and return to the system? <strong>Usability</strong>: where are the friction points in the physical, digital, and transitional flows? Each method was mapped to at least one of these goals, and no goal relied on a single method.</p>
          </div>
          <div className="tool-row">
            {METHODS.map(m => (
              <span key={m} className="tool-tag">{m}</span>
            ))}
          </div>
          <ImageSlot id="2.1" caption="Research method-to-goal alignment matrix: field study, usability testing, survey, and Google Analytics mapped to discovery, engagement, and usability goals." />
          <div className="body-text">
            <p>Early in the project, I led the alignment conversations with the Seed Library team to confirm we were studying what they actually needed. Two priorities emerged: actionable recommendations rather than a list of problems, and continuity with the program's sustainability mission. This shaped how I framed the requirements later.</p>
          </div>
        </div>

        <div className="section" id="sec-3">
          <SectionLabel num={3}>Discovery findings</SectionLabel>
          <h2>What each method revealed.</h2>

          <h3>Field study established the baseline</h3>
          <div className="body-text">
            <p>We ran four two-hour observation sessions in the Shapiro Library lobby, logging every user interaction against a rainbow spreadsheet of intended and unintended steps. The data told a clear story: 44.8% of passersby approached the machine (strong visual draw), but only 4.32% completed the full intended flow. The drop-off points were consistent. Users got stuck at the seed transfer step, confused by the multi-machine sequencing, and almost no one scanned the QR code.</p>
          </div>
          <ImageSlot id="3.1" caption="Physical machine setup as deployed: envelope dispenser (left), gumball capsule machine (center), frog receptacle (right)." />

          <h3>Usability testing exposed the identification crisis</h3>
          <div className="body-text">
            <p>All seven usability participants required facilitator intervention at some point during the flow. More critically, zero out of seven could identify which seed they had received. They searched labels, shook capsules, and asked the facilitator directly. The physical system gave them seeds but no way to know what they were holding. The analytics confirmed it: only 3 of 110 site visitors reached the specific plant page for the seeds in the machines.</p>
          </div>

          <Callout
            stat="0/7"
            label="The identification crisis · pre-design usability"
            title="Zero participants could name the seed they received."
          >
            <p>Across seven moderated sessions, every participant succeeded at obtaining a capsule and failed at the next step: knowing what was inside. Without identification, every downstream interaction (care instructions, return behavior, community programming) was effectively unreachable. The bridge between physical and digital was missing.</p>
          </Callout>

          <h3>The survey quantified the awareness gap</h3>
          <div className="body-text">
            <p>Among 53 respondents (81% undergrad, 7% grad, 12% community), most had never heard of the program. Yet when presented with the concept, 60% expressed interest in community participation and 59% wanted themed community sessions. The interest existed. The pathways to it were missing.</p>
          </div>
        </div>

        <div className="section" id="sec-4">
          <SectionLabel num={4}>Synthesis</SectionLabel>
          <h2>From four research streams to a unified user model.</h2>
          <div className="body-text">
            <p>I led the synthesis through affinity diagramming. The team coded findings from all four methods by touchpoint in the user journey, surfacing patterns that any single method would have missed. The synthesis output was the bridge between research and design: two personas, a user journey map, and a user flow diagram documenting both intended paths and observed error states.</p>
          </div>
          <ImageSlot id="4.1" caption="Affinity diagram: synthesized findings from all four research methods, coded by theme." />

          <h3>Two personas to ground the design conversation</h3>
          <GridFrames items={PERSONAS} cols={2} aspect="4x3" />
          <div className="body-text">
            <p>Britt represents the experienced gardener who arrives motivated and curious about community programming, but is blocked by the lack of return mechanisms and inability to find events. Casey represents the curious beginner whose interest is real but fragile, where any friction in the first interaction will prevent a second.</p>
          </div>

          <ImageSlot id="4.2" caption="User flow diagram: intended path (yellow/blue) overlaid with observed error states and deviations (gray)." />
        </div>

        <div className="section" id="sec-5">
          <SectionLabel num={5}>Design requirements</SectionLabel>
          <h2>Seven testable requirements derived from synthesis.</h2>
          <div className="body-text">
            <p>I structured the requirements to be testable: each one mapped to a specific failure mode the synthesis had documented, so the evaluation phase could measure whether the redesign actually addressed it.</p>
          </div>

          <h3>Physical requirements</h3>
          <DecisionCard number={1} title="Improve seed identification in the physical experience" rationale="Identification is the bridge between physical and digital. Without it, every downstream interaction is compromised.">
            <p>0/7 usability participants and only 3/110 website visitors could identify their seed. The identification gap was the single most consequential failure across the entire experience.</p>
          </DecisionCard>
          <DecisionCard number={2} title="Simplify how users receive and carry seeds" rationale="Cognitive load compounds with each additional machine. Minimizing components reduces sequencing errors and keeps users in the flow.">
            <p>The original flow required users to interact with an envelope dispenser, a gumball machine, and a frog receptacle in a specific sequence, transferring loose seeds between containers. Field observation showed dramatic drop-offs at the seed transfer step.</p>
          </DecisionCard>
          <DecisionCard number={3} title="Communicate the overall system flow" rationale="A system that depends on users discovering the correct sequence through experimentation will lose the majority of them.">
            <p>Only 4.32% of observed users completed the full intended sequence, and those who did often relied on trial and error. The physical instructions were text-heavy and assumed users would infer sequencing from spatial proximity.</p>
          </DecisionCard>
          <DecisionCard number={4} title="Address breakdowns in seed return behavior" rationale="A sustainability program that cannot sustain its own supply chain has a product problem, not just a UX problem.">
            <p>The Seed Library's circular model depends on users returning harvested seeds. Field observations showed the return step was among the least completed actions, with capsules taken, discarded, or returned to the wrong location.</p>
          </DecisionCard>

          <h3>Digital requirements</h3>
          <DecisionCard number={5} title="Improve seed identification within the digital experience" rationale="The QR code creates an expectation of specificity. Users who scan it expect to land on their seed's page, not a homepage.">
            <p>Google Analytics confirmed the disconnect: only 3 of 107 unique visitors reached the plant page for the seeds in the machines. The digital touchpoint needed to immediately resolve the identification question.</p>
          </DecisionCard>
          <DecisionCard number={6} title="Align the digital experience with beginner expectations" rationale="49% of the audience self-identifies as beginners. A digital experience designed for experts that beginners must navigate is a digital experience designed for no one.">
            <p>78.8% of survey respondents wanted plant care guidance as their primary digital content. The hierarchy needed to flip: actionable guidance first, reference information second.</p>
          </DecisionCard>
          <DecisionCard number={7} title="Surface opportunities for community engagement" rationale="The gap between expressed interest (60%) and actual discovery was a visibility problem, not a demand problem.">
            <p>30% of site visitors navigated to the Events page, demonstrating genuine interest. But community features were almost entirely undiscovered during usability testing. They needed to be surfaced across multiple touchpoints rather than isolated on a single page.</p>
          </DecisionCard>
        </div>

        <div className="section" id="sec-6">
          <SectionLabel num={6}>Strategy</SectionLabel>
          <h2>Designing for a low-cost, incremental rollout on Google Sites.</h2>
          <div className="body-text">
            <p>The client preferred incremental implementation, with low-cost physical changes prioritized first, and wanted to keep the digital experience on Google Sites rather than moving to a custom platform. These constraints shaped how the design phase was scoped: every requirement needed to be achievable within the tools the client already had.</p>
          </div>

          <Callout
            stat="96%"
            label="The core insight · field-observed flows"
            title="Ninety-six percent of observed user flows were incomplete."
          >
            <p>The system's most persistent failure was not any single interaction, but the accumulation of small uncertainties: what is this machine? Which part do I use first? What seed did I get? Where do I go next? Each unanswered question increased the likelihood of abandonment. Solving for completion meant solving for compounding doubt, not any single step.</p>
          </Callout>
        </div>

        <div className="section" id="sec-7">
          <SectionLabel num={7}>Final composition</SectionLabel>
          <h2>A connected system across physical and digital touchpoints.</h2>
          <div className="body-text">
            <p>On the physical side, we simplified the machine interaction and introduced a color-coded identification system. On the digital side, we designed four key pages for both mobile and desktop: a Plant Listing page (the QR entry point), a Plant Detail page template, an Events page, and a Homepage for users arriving outside the QR flow.</p>
          </div>
          <GridFrames items={FINAL_PAGES} cols={4} aspect="9x16" />
        </div>

        <div className="section" id="sec-8">
          <SectionLabel num={8}>The pivotal physical redesign</SectionLabel>
          <h2>Three machines became one. Plus a paper slip.</h2>
          <div className="body-text">
            <p>The original flow required three machines and multiple transfer steps. The redesign eliminated the envelope dispenser entirely, replacing it with a small paper envelope designed to fit inside the existing capsules. Each capsule color now maps to a specific plant, and a paper slip inside confirms the plant name and includes a QR code linking directly to that plant's detail page.</p>
          </div>
          <BeforeAfterPair
            aspect="4x3"
            before={{
              label: 'FIG. 8.1 · V1, Original system',
              tag: '4.32% completion',
              placeholder: 'V1: 3 machines, loose seeds, no identification',
              annotations: [
                'Three separate machines required in correct sequence.',
                'Loose seeds transferred between envelope and capsule.',
                'No mechanism to identify the contents of any capsule.',
              ],
            }}
            after={{
              label: 'FIG. 8.2 · V2, Redesigned system',
              tag: 'design for ship',
              placeholder: 'V2: 1 capsule machine + paper slip with QR + return receptacle',
              annotations: [
                'Envelope dispenser eliminated. Two objects total.',
                'Color-coded capsule maps to a single plant species.',
                'Paper slip inside confirms plant name and QR-links to detail page.',
              ],
            }}
          />
        </div>

        <div className="section" id="sec-9">
          <SectionLabel num={9}>Testing & iteration</SectionLabel>
          <h2>Three testing phases, fourteen participants.</h2>
          <div className="body-text">
            <p>The team tested across three iterative phases: a paper-prototype Wizard of Oz test (n=6), followed by two rounds of full physical and digital testing (n=4 each). Each phase refined the system based on observed failures, with findings fed back into both physical and digital components between rounds.</p>
          </div>

          <DecisionCard number={1} title="Color-coded capsules with paper-slip confirmation" rationale="A single identification method is a single point of failure. Redundancy across physical (slip), visual (color), and digital (QR) channels ensures beginners always have a path forward.">
            <p>The redesign mapped each capsule color to one plant and included a paper slip with the plant name and QR code. In post-design testing, 100% of participants identified their seed: paper slip (100%), website (87.5%), capsule color (37.5%). Redundancy across three channels meant every participant succeeded through at least one path.</p>
          </DecisionCard>
          <DecisionCard number={2} title="Eliminated the envelope machine" rationale="Every additional component multiplies the places a user can get lost. Reducing the machine count addressed the sequencing confusion at its source rather than papering over it with better signage.">
            <p>The team eliminated the envelope dispenser and designed a paper envelope to fit inside the existing capsules. The interaction went from three objects to two, and the seed-transfer step was removed entirely.</p>
          </DecisionCard>
          <DecisionCard number={3} title="Plant Detail structured around beginner needs" rationale="49% of surveyed users identified as curious beginners. Information that serves experts but overwhelms beginners should be accessible but not foregrounded.">
            <p>The page leads with six numbered care steps, followed by difficulty ratings, growing specs in scannable cards, and student testimonials. In hi-fi, care instructions moved into collapsible sections to reduce scroll length.</p>
          </DecisionCard>
          <DecisionCard number={4} title="Community features distributed across the system" rationale="Features users want but cannot find are functionally nonexistent. Distributing community touchpoints builds familiarity through repeated exposure.">
            <p>Rather than concentrating everything on a single Events page, the redesign surfaced community programming across plant pages, the homepage, and navigation. Attendance indicators (34 attending · 5 seats left) combined social proof with scarcity to drive registration.</p>
          </DecisionCard>
          <DecisionCard number={5} title="Location-based seed organization" rationale="Location is the natural entry point for a physical-first experience.">
            <p>With machines in three campus libraries (Shapiro, Hatcher, Leinweber), the catalog organizes by building rather than alphabetically. Combined search and filter tools support both goal-directed and exploratory browsing.</p>
          </DecisionCard>
        </div>

        <div className="section" id="sec-10">
          <SectionLabel num={10}>Try it</SectionLabel>
          <h2>Interactive prototype.</h2>
          <div className="body-text" style={{ marginBottom: '24px' }}>
            <p>Click through the final desktop prototype below. Start on the Plant Listing page (the QR entry point) and explore the full site.</p>
          </div>
          <div className="prototype-embed-wrapper">
            <iframe
              width="960"
              height="640"
              src="https://embed.figma.com/proto/TeVqNi1JLvHd8PC1AJoPDK/UM-Seed-Library?node-id=2002-8223&starting-point-node-id=2002-7910&scaling=min-zoom&content-scaling=fixed&embed-host=share"
              allowFullScreen
              title="UM Seed Library prototype"
            />
          </div>
        </div>

        <div className="section" id="sec-11">
          <SectionLabel num={11}>Results</SectionLabel>
          <h2>Before and after the redesign.</h2>
          <div className="body-text">
            <p>The evaluation phase compared pre-design usability testing (7 participants on the original system) with post-design testing (8 participants on the redesigned system). The most significant change was seed identification: a task that was completely impossible in the original system became universally successful in the redesign.</p>
          </div>
          <ImageSlot id="11.1" src={imgEvalBoard} alt="Evaluation phase data: before and after comparison" caption="Evaluation phase data: pre/post comparison across identification, completion, and exploration tasks." aspect="16x9" contain />

          <Callout
            tone="good"
            stat="0→100%"
            label="The turnaround · seed identification"
            title="A task that was impossible in the original system became universally successful in the redesign."
          >
            <p>Obtaining seeds required prompting for 43% of participants before and 0% after. Caretaking completion improved from 85.7% to 100%. The exploration task, unmeasurable on the original system because community features were undiscoverable, achieved 87.5% in the redesign.</p>
          </Callout>

          <Callout
            tone="good"
            stat="★"
            label="2026 UMSI Exposition · BSI UX Pathway Award"
            title="Selected as the BSI UX Pathway Award winner."
          >
            <p>Judged by a panel of UMSI alumni and industry experts, the award recognizes excellence in user experience research and design, clear execution, and feasible, valuable recommendations to the client organization.</p>
          </Callout>
        </div>

        <div className="section" id="sec-12">
          <SectionLabel num={12}>My contributions</SectionLabel>
          <h2>What I owned across each phase.</h2>
          <ContribGrid items={CONTRIBUTIONS} />
        </div>

        <div className="section" id="sec-13">
          <SectionLabel num={13}>Reflection</SectionLabel>
          <h2>What I'd do differently as the PM.</h2>
          <div className="body-text">
            <p>The redesign solved the problems it set out to solve. Seed identification went from impossible to universal. Task completion improved across every metric. Community features moved from invisible to discoverable. But the project surfaced a deeper tension that the team navigated differently than I would have.</p>
          </div>
          <h3>The sustainability tradeoff I'd revisit</h3>
          <div className="body-text">
            <p>The gumball machine was the most engaging part of the experience. Field observation confirmed it: nearly half of all passersby stopped and interacted with it. The team kept it as the core distribution method, and I understand why. The tactile novelty is a genuine asset for a program that needs to attract first-time users.</p>
            <p>But I advocated for a different physical implementation. The capsule system relies on single-use plastic that our own research showed users were not returning despite signage. For a program whose mission centers on sustainability and circular reuse, the distribution method was working against the values it was meant to promote.</p>
            <p>I pushed for plantable packaging: seed-embedded paper pulp or compressed cotton that could be colored for the identification system and stamped with a QR code. The seeds could be planted directly in the packaging, eliminating the "what do I do with this capsule" question entirely while closing the loop on the sustainability mission. The team overruled this in favor of the gumball machine's interaction appeal, and I think that was the wrong call.</p>
          </div>
          <h3>Three things I'd change with a PM's authority</h3>
          <div className="body-text">
            <p>First, I would have defined quantitative success thresholds before the evaluation phase: not just "did it improve" but "what completion rate constitutes a shippable experience." Second, I would have pushed harder for a second round of field observation post-redesign, not just moderated usability testing. Field observation tells you whether users do, on their own, when no one is watching. Third, I would have scoped a supply-side metric: seed return rates tracked over time. A PM should track the metric that determines whether the product can sustain itself, not just whether it's usable in the moment.</p>
          </div>
          <h3>If the project continued</h3>
          <div className="body-text">
            <p>Real-world deployment testing in actual library environments with no facilitator present, tracking completion, return behavior, and event participation over time. Beyond that, the digital experience should be validated in Google Sites before assuming the Figma prototype translates cleanly. The Figma file includes dev specs and annotations to support a direct development handoff if the client eventually moves to a custom site.</p>
          </div>
        </div>

        </main>
      </div>

      <CaseStudyFooter slug="seed-library · si-487" />
    </div>
  )
}
