import Navbar from '../components/Navbar'
import imgPlantListing from '../assets/seed-plant-listing.png'
import imgPlantDetail from '../assets/seed-plant-detail.png'
import imgEvents from '../assets/seed-events-page.png'
import imgHomepage from '../assets/seed-homepage.png'
import imgPersona1 from '../assets/seed-persona-2.png'
import imgPersona2 from '../assets/seed-persona-1.png'
import imgEvalBoard from '../assets/seed-eval-board.png'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import ImageGrid from '../components/ImageGrid'
import ImageSlot from '../components/ImageSlot'
import StatRow from '../components/StatRow'
import CaseStudyFooter from '../components/CaseStudyFooter'

const THEME = {
  '--color-accent': '#00274C',
  '--color-accent-soft': '#FFF3CC',
}

const META = [
  { label: 'Role', value: 'UX Researcher, Designer, Client Liaison' },
  { label: 'Ownership', value: 'Research & Design Requirements Report' },
  { label: 'Team', value: '4 members (SI 487 Capstone)' },
  { label: 'Timeline', value: 'Fall 2025 – Winter 2026, 2 semesters' },
  { label: 'Client', value: 'University of Michigan Library' },
  { label: 'Tools', value: 'Figma, Google Analytics, Survey Design, Usability Testing' },
]

const STATS = [
  { number: '4.3%', label: 'of users completed the intended physical flow in field observation' },
  { number: '85%', label: 'of surveyed students had never heard of the Seed Library' },
  { number: '0 / 7', label: 'usability participants could identify which seed they received' },
]

const CONTRIBUTIONS = [
  { phase: 'Client', work: 'Served as primary client liaison during the research phase, aligning research methods and design requirements with the Seed Library\'s mission, sustainability goals, and implementation constraints (including the preference for Google Sites)' },
  { phase: 'Research Plan', work: 'Designed the mixed-methods research strategy: structured four methods (field study, usability testing, survey, Google Analytics) around three research goals, ensuring each goal was covered by multiple methods and each method mapped to specific questions' },
  { phase: 'Field Study', work: 'Contributed to the four-session field study in Shapiro Library (185 observations), logging user interactions against a rainbow spreadsheet of intended and unintended steps' },
  { phase: 'Usability', work: 'Co-conducted moderated usability testing sessions with the pre-design physical and digital flow (7 participants), documenting completion rates, confusion points, and user sentiment' },
  { phase: 'Synthesis', work: 'Led the synthesis of all research findings through affinity diagramming. Translated findings into two personas with storyboards, a user journey map, a user flow diagram documenting intended and error paths, and the four design requirements that anchored the design phase' },
  { phase: 'Requirements', work: 'Authored the UX Research and Design Requirements Report: the foundational document that defined the problem space, presented the evidence, and established the testable requirements every design decision was evaluated against' },
  { phase: 'Design', work: 'Co-designed across physical and digital touchpoints: participated in ideation and Crazy 8\'s sketching, contributed to the design system (color-coded capsule mapping, typography, component library), and designed lo-fi through hi-fi screens across the four key pages alongside the full team' },
  { phase: 'Evaluation', work: 'Contributed to the three-phase usability evaluation (14 participants total across paper prototype and full-system rounds), comparing pre-design and post-design metrics' },
]

export default function SeedLibrary({ onHome }) {
  return (
    <div className="case-study-page" style={THEME}>
      <Navbar onHome={onHome} label="BSI UX Capstone · UX Research & Design" />

      <CaseStudyHero
        eyebrow="BSI UX Capstone · Case Study"
        title="UM Seed Library"
        subtitle="Redesigning the physical and digital experience of a campus seed distribution system, from a gumball machine with a 4% completion rate to a connected ecosystem tested with 355 participants across four research methods. Winner of the BSI UX Pathway Award at the 2026 UMSI Exposition."
        meta={META}
      />

      <section className="wide">
        <ImageGrid columns={4}>
          <ImageSlot label="Plant Listing" src={imgPlantListing} alt="Plant Listing page" />
          <ImageSlot label="Plant Detail" src={imgPlantDetail} alt="Plant Detail page" />
          <ImageSlot label="Events" src={imgEvents} alt="Events page" />
          <ImageSlot label="Homepage" src={imgHomepage} alt="Homepage" />
        </ImageGrid>
      </section>

      <section>
        <SectionLabel>The Problem</SectionLabel>
        <h2>A sustainability resource that nearly everyone walks past</h2>
        <p>The University of Michigan Seed Library is a campus initiative that offers free seeds to students, staff, and community members through a novel distribution method: gumball machines placed in campus libraries. Users turn a knob, receive a capsule with seeds inside, and are meant to continue online for growing instructions and community programming. The program supports sustainability education, connects people to gardening, and aims to build a circular seed-sharing community.</p>
        <p>The concept was compelling. The execution had gaps. The physical flow required users to interact with multiple machines, transfer seeds between containers, and infer sequencing from spatial proximity. The digital platform offered information but did not connect back to the physical experience. And 85% of the campus community had never heard of the program at all.</p>
        <p>As a two-semester capstone project (SI 487), our four-person team partnered with the Seed Library to understand where the experience was breaking down and design solutions across both physical and digital touchpoints. The project spanned three phases, research, design, and evaluation, with a real client expecting actionable recommendations they could implement.</p>
        <StatRow stats={STATS} />
      </section>

      <section>
        <SectionLabel>Discovery</SectionLabel>
        <h2>What 355 participants across four research methods revealed</h2>
        <p>I owned the UX Research and Design Requirements Report, which meant designing the research plan, ensuring methodological alignment with the client's goals, and translating findings into the requirements that would drive every design decision. I also served as the primary client liaison throughout the research phase, making sure our methods addressed what the Seed Library team actually needed: not just a usability audit, but an understanding of how their system fit into the broader campus experience.</p>
        <p>The research approach was deliberately mixed. Each method targeted a specific gap in our understanding, and I structured the plan so findings from one method could be cross-referenced with others. Four methods, 355 total participants: a field study (185 observations across four sessions), moderated usability testing (7 participants), a campus-wide survey (53 responses), and a Google Analytics review of the existing website (110 site visitors).</p>
        <ImageSlot label="Figma Export">Physical machine setup: envelope dispenser (left), gumball capsule machine (center), frog receptacle (right)</ImageSlot>
        <h3>The field study established the baseline</h3>
        <p>We ran four two-hour observation sessions in the Shapiro Library lobby, logging every user interaction against a rainbow spreadsheet of intended and unintended steps. The data told a clear story: 44.8% of passersby approached the machine (strong visual draw), but only 4.32% completed the full intended flow. The drop-off points were consistent. Users got stuck at the seed transfer step, confused by the multi-machine sequencing, and almost no one scanned the QR code to continue digitally.</p>
        <h3>Usability testing exposed the identification crisis</h3>
        <p>All seven usability participants required facilitator intervention at some point during the flow. More critically, zero out of seven could identify which seed they had received. They searched labels, shook capsules, and asked the facilitator directly. The physical system gave them seeds but no way to know what they were holding. This was confirmed by the analytics: only 3 of 110 site visitors reached the specific plant page for the seeds that were actually in the machines.</p>
        <h3>The survey quantified the awareness gap</h3>
        <p>Among 53 respondents (81% undergraduate, 7% graduate, 12% community members), 84.9% had never heard of the Seed Library. Yet when presented with the concept, 60% expressed interest in community participation and 59% wanted themed community sessions. The interest existed. The pathways to that interest were missing.</p>
        <ImageSlot label="Figma Export">Affinity diagram: synthesized findings from all four research methods, coded by theme</ImageSlot>
      </section>

      <section>
        <SectionLabel>Strategy</SectionLabel>
        <h2>Translating research into requirements the client could act on</h2>
        <p>The client had told us early on that they preferred incremental implementation, with low-cost physical changes prioritized first. They also wanted to keep the digital experience on Google Sites rather than moving to a custom-built platform. These constraints shaped how I framed the design requirements: every requirement needed to be achievable within the tools the client already had, while still addressing the fundamental breakdowns we had documented.</p>
        <p>In my conversations with the client, I confirmed that our research priorities aligned with their mission. The Seed Library's goals extended beyond seed distribution into sustainability education and community building. This meant the design requirements couldn't just fix the usability failures; they had to surface the community features that our research showed were genuinely desired but buried beneath the friction of the current experience.</p>
        <Callout label="The Core Insight" stat="96%">
          <p>Ninety-six percent of observed user flows were incomplete. The system's most persistent failure was not any single interaction, but the accumulation of small uncertainties: what is this machine? Which part do I use first? What seed did I get? Where do I go next? Each unanswered question increased the likelihood of abandonment.</p>
        </Callout>
        <p>I synthesized the research into seven design requirements, split across physical and digital, that anchored every subsequent design decision. Each requirement traced directly to a documented failure mode, making them testable in the evaluation phase.</p>
        <h3>Physical Requirements</h3>
        <DecisionCard number={1} title="Improve seed identification in the physical experience" rationale="Seed identification is the bridge between the physical and digital experience. Without it, every downstream interaction (finding care instructions, returning seeds, engaging with community features) is compromised.">
          <p>Users needed to understand what they received without removing the sense of randomness that made the gumball machine appealing. In the original system, 0/7 usability participants and only 3/110 website visitors could identify their seed. The identification gap was the single most consequential failure across the entire experience.</p>
        </DecisionCard>
        <DecisionCard number={2} title="Simplify how users receive and carry seeds" rationale="Cognitive load compounds with each additional machine. Minimizing the number of objects and unfamiliar interactions reduces sequencing errors and keeps users in the flow rather than forcing them to troubleshoot.">
          <p>The original flow required users to interact with an envelope dispenser, a gumball machine, and a frog receptacle in a specific sequence, transferring loose seeds between containers. Field observation showed dramatic drop-offs at the seed transfer step, and the envelope machine caused the most confusion in usability testing, with participants attempting to return envelopes to the same slot or assuming seeds were dispensed from it.</p>
        </DecisionCard>
        <DecisionCard number={3} title="Clearly communicate the overall system flow" rationale="A system that depends on users discovering the correct sequence through experimentation will lose the majority of them. Visual sequencing with numbered steps and action-oriented language replaces inference with instruction.">
          <p>Only 4.32% of observed users completed the full intended sequence, and those who did often relied on trial and error rather than comprehension. The physical instructions were text-heavy and assumed users would infer sequencing from spatial proximity. Users needed to know what to do, in what order, and when the interaction was complete.</p>
        </DecisionCard>
        <DecisionCard number={4} title="Address breakdowns in seed return behavior" rationale="A sustainability program that cannot sustain its own supply chain has a product problem, not just a UX problem. Return behavior must be designed into the flow, not assumed.">
          <p>The Seed Library's circular model depends on users returning harvested seeds. Our field observations showed that the return step was among the least completed actions, with capsules taken, discarded, or returned to the wrong location. Clearer instructions and a more visible return process were needed to reinforce the circular reuse loop.</p>
        </DecisionCard>
        <h3>Digital Requirements</h3>
        <DecisionCard number={5} title="Improve seed identification within the digital experience" rationale="The QR code creates an expectation of specificity. Users who scan it expect to land on their seed's page, not a homepage. Meeting that expectation is what turns a broken transition into a seamless one.">
          <p>Google Analytics confirmed the physical-to-digital disconnect: only 3 of 107 unique visitors reached the plant page for the seeds actually in the machines. One in three visitors arrived through direct web search rather than the QR code, meaning the QR pathway lacked sufficient visibility. The digital touchpoint needed to immediately resolve the identification question, not bury it in a generalized information site.</p>
        </DecisionCard>
        <DecisionCard number={6} title="Align the digital experience with beginner expectations" rationale="Nearly half the audience self-identifies as beginners. A digital experience designed for experts that beginners must navigate is a digital experience designed for no one.">
          <p>In usability testing, users expected the QR code to immediately surface relevant care information in a format accessible to someone with no gardening experience. Instead, they encountered dense content that required searching and scrolling. Survey data confirmed this: 49% identified as curious beginners, and 78.8% wanted plant care guidance as their primary digital content. The hierarchy needed to be flipped, with actionable guidance first and reference information second.</p>
        </DecisionCard>
        <DecisionCard number={7} title="Surface opportunities for community engagement" rationale="The gap between expressed interest (60%) and actual discovery was not a demand problem. It was a visibility problem. Engagement opportunities that exist only on a page users never reach serve no one.">
          <p>Survey data showed 60% of users were interested in community participation and 59% wanted themed community sessions. Google Analytics showed 30% of site visitors navigated to the Events page, demonstrating genuine interest. But these features were almost entirely undiscovered during usability testing. Community programming needed to be surfaced across multiple touchpoints rather than isolated on a single page.</p>
        </DecisionCard>
        <ImageSlot label="Figma Export">User flow diagram: intended path (yellow/blue) with observed error states and deviations (gray)</ImageSlot>
      </section>

      <section>
        <SectionLabel>The Product</SectionLabel>
        <h2>A connected system across physical and digital touchpoints</h2>
        <p>The team's work addressed both sides of the experience. On the physical side, we simplified the machine interaction and introduced a color-coded identification system. On the digital side, we designed four key pages for both mobile and desktop: a Plant Listing page (the QR entry point), a Plant Detail page template, an Events page, and a Homepage for users arriving outside the QR flow.</p>
        <h3>Physical: Simplified to Two Objects</h3>
        <p>The original flow required three separate machines and multiple transfer steps. We eliminated the envelope dispenser entirely, replacing it with a small paper envelope designed to fit inside the existing capsules. Each capsule color now maps to a specific plant, and a paper slip inside confirms the plant name and includes a QR code linking directly to that plant's detail page. The interaction went from "interact with three machines and figure out the sequence" to "turn the knob, open the capsule, read the slip."</p>
        <h3>Digital: Four Pages, One Clear Flow</h3>
        <p>The Plant Listing page serves as the primary QR entry point, organizing seeds by library location with filters for type, growing requirements, and capsule color. Each plant card links to a Plant Detail page with numbered care instructions, difficulty ratings, specs, and a student testimonial section. The Events page surfaces community programming with filterable topic tags and attendance indicators. The Homepage introduces the Seed Library's mission and locations for users discovering the program outside the QR flow.</p>
      </section>

      <section className="wide">
        <ImageGrid columns={4}>
          <ImageSlot label="Plant Listing" src={imgPlantListing} alt="Plant Listing: location-based seed catalog with color-coded cards" />
          <ImageSlot label="Plant Detail" src={imgPlantDetail} alt="Plant Detail: care instructions, difficulty rating, specs cards" />
          <ImageSlot label="Events" src={imgEvents} alt="Events: filterable community programming with attendance indicators" />
          <ImageSlot label="Homepage" src={imgHomepage} alt="Homepage: mission, seed locations, and upcoming events" />
        </ImageGrid>
      </section>

      <section>
        <SectionLabel>Research Deep Dive</SectionLabel>
        <h2>Designing the research plan that shaped every decision downstream</h2>
        <p>Owning the UX Research and Design Requirements Report meant more than running studies and writing findings. It meant deciding which questions to ask, which methods would answer them, and how to structure the output so the design team could act on it immediately. This was the document the entire project built on, and every design decision traces back to a finding in it.</p>
        <h3>Structuring research around three goals</h3>
        <p>I organized the research plan around three goals, each tied to a specific research question. Discovery: how do users currently find the Seed Library, and what prevents awareness? Engagement: what makes users interact with and return to the system? Usability: where are the friction points in the physical, digital, and transitional flows? Each method was mapped to at least one of these goals, and no goal relied on a single method.</p>
        <ImageSlot label="Figma Export">Research method-to-goal alignment matrix: field study, usability testing, survey, and Google Analytics mapped to discovery, engagement, and usability goals</ImageSlot>
        <h3>Aligning with the client's mission</h3>
        <p>Early in the project, I led the alignment conversations with the Seed Library team to understand what they were actually looking for. Two things became clear. First, the client wanted actionable recommendations, not just a list of problems. They were already aware that the system had friction; they needed to know what to change and in what order. Second, they cared deeply about the sustainability mission. Any design solution that didn't connect back to community engagement, circular seed-sharing, and environmental education would miss the point, even if it solved the usability problems.</p>
        <p>This shaped how I framed the design requirements. Rather than organizing them purely around error rates and task completion, I structured the requirements to address both the usability failures and the mission-aligned opportunities the research had uncovered. The community programming that 60% of surveyed users wanted was not a "nice to have." It was a core part of what the Seed Library existed to do, and the current system was hiding it.</p>
        <h3>From findings to requirements</h3>
        <p>The synthesis process used affinity diagramming to group findings from all four methods by touchpoint in the user journey. This produced the journey map, the user flow diagram (documenting both intended paths and observed error states), two personas with storyboards, and ultimately the four design requirements. The requirements were structured to be testable: each one mapped to a specific failure mode we had observed, which meant the evaluation phase could measure whether the redesign actually addressed it.</p>
        <ImageGrid columns={2}>
          <ImageSlot label="Persona 1" src={imgPersona1} alt="Britt — experienced gardener seeking community connection" />
          <ImageSlot label="Persona 2" src={imgPersona2} alt="Casey — curious beginner looking for a low-effort hobby" />
        </ImageGrid>
      </section>

      <section>
        <SectionLabel>Testing & Iteration</SectionLabel>
        <h2>Three testing phases, 14 participants, and a 100% improvement in seed identification</h2>
        <p>The team tested across three iterative phases: a paper prototype "Wizard of Oz" test (n=6), followed by two rounds of full physical and digital testing (n=4 each). Each phase refined the system based on observed failures, with findings fed back into both physical and digital components between rounds.</p>
        <p>The before-and-after comparison against the pre-design usability testing told the clearest story. Seed identification went from 0% to 100%. Task completion for obtaining seeds went from requiring prompting 43% of the time to 0%. Users found the care information, navigated the digital pages, and discovered the community features that had been invisible in the original system.</p>
        <DecisionCard number={1} title="Color-Coded Capsules with Paper Slip Confirmation" rationale="Seed identification was the single highest-friction point in the entire system. A single identification method is a single point of failure. Redundancy across physical (slip), visual (color), and digital (QR) channels ensures beginners always have a path forward.">
          <p>The original system gave users no way to identify their seed. The redesign mapped each capsule color to one plant and included a paper slip with the plant name and a QR code. In post-design testing, 100% of participants identified their seed, using the paper slip (100%), the website (87.5%), or the capsule color (37.5%). Redundancy across three identification channels meant every participant succeeded through at least one path.</p>
        </DecisionCard>
        <DecisionCard number={2} title="Eliminated the Envelope Machine Entirely" rationale="Every additional component in a physical flow multiplies the number of places a user can get lost. Reducing the machine count from three to one addressed the sequencing confusion at its source rather than papering over it with better instructions.">
          <p>Rather than improving signage on the three-machine setup, the team eliminated the envelope dispenser and designed a paper envelope to fit inside the existing capsules. The interaction went from three objects to two (capsule and frog receptacle), and the need to transfer seeds between containers was removed. Users no longer had to figure out which machine to use first.</p>
        </DecisionCard>
        <DecisionCard number={3} title="Plant Detail Page Structured Around Beginner Needs" rationale="49% of surveyed users identified as curious beginners. Information that serves experts but overwhelms beginners should be accessible but not foregrounded. Lead with what beginners need; let experienced users drill deeper.">
          <p>Usability testing showed that users immediately sought actionable care guidance after identifying their seed, not botanical reference information. The Plant Detail page was restructured to lead with six numbered care steps, followed by difficulty ratings, growing specs in scannable card format, and student testimonials. In the hi-fi revision, care instructions were moved into collapsible sections using progressive disclosure to reduce scroll length.</p>
        </DecisionCard>
        <DecisionCard number={4} title="Community Features Distributed Across the System" rationale="Features that users want but cannot find are functionally nonexistent. Distributing community touchpoints across the experience builds familiarity through repeated exposure rather than requiring users to seek out a dedicated page.">
          <p>Despite 60% of surveyed users expressing interest in community participation, events were almost entirely undiscovered in the original system. Rather than concentrating everything on a single Events page, the redesign surfaced community programming across plant pages, the homepage, and navigation. Attendance indicators ("34 attending | 5 seats left") combined social proof with scarcity to drive registration.</p>
        </DecisionCard>
        <DecisionCard number={5} title="Location-Based Seed Organization" rationale="Location is the natural entry point for a physical-first experience. Organizing around it connects the digital catalog directly to the real-world context where users encounter the system.">
          <p>With machines in three campus libraries (Shapiro, Hatcher, Leinweber), the plant catalog was organized by building location rather than alphabetically or by plant type. This served users in both directions: someone who found a machine could immediately see what's available at that location, and someone browsing digitally could identify which building to visit. Combined search and filter tools supported both goal-directed and exploratory browsing.</p>
        </DecisionCard>
      </section>

      <section className="wide">
        <div style={{ margin: '48px 0' }}>
          <SectionLabel>Try It</SectionLabel>
          <h2 style={{ marginBottom: '8px' }}>Interactive Prototype</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Click through the final desktop prototype below. Start on the Plant Listing page (the QR entry point) and explore the full site.</p>
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
      </section>

      <section>
        <SectionLabel>Results</SectionLabel>
        <h2>Before and after the redesign</h2>
        <p>The evaluation phase compared pre-design usability testing (7 participants on the original system) with post-design testing (8 participants on the redesigned system). The most significant change was seed identification: a task that was completely impossible in the original system became universally successful in the redesign.</p>
        <ImageSlot label="Evaluation Phase Data" src={imgEvalBoard} alt="Evaluation phase data: before and after comparison" />
        <p>Obtaining seeds required prompting for 43% of participants before the redesign and 0% after. Seed identification went from a 0% success rate (every participant failed) to 100% (every participant succeeded through at least one identification channel). Seed caretaking task completion improved from 85.7% to 100%. The exploration task, which could not be measured on the original system because community features were undiscoverable, achieved 87.5% completion in the redesigned system.</p>
        <Callout label="2026 UMSI Exposition" stat="BSI UX Pathway Award">
          <p>This project was selected as the BSI UX Pathway Award winner at the 2026 UMSI Student Project Exposition, judged by a panel of UMSI alumni and industry experts. The award recognizes excellence in user experience research and design, clear execution, and feasible, valuable recommendations to the client organization.</p>
        </Callout>
      </section>

      <section className="wide">
        <ImageGrid columns={3}>
          <ImageSlot label="Photo">Physical prototype: gumball machine with step diagram</ImageSlot>
          <ImageSlot label="Photo">Paper envelope inside color-coded capsule</ImageSlot>
          <ImageSlot label="Photo">Fortune-style paper slip with plant name and QR</ImageSlot>
        </ImageGrid>
      </section>

      <section>
        <SectionLabel>My Contributions</SectionLabel>
        <h2>What I owned across each phase</h2>
        <ContribGrid items={CONTRIBUTIONS} />
      </section>

      <section>
        <SectionLabel>Reflection</SectionLabel>
        <h2>What I'd do differently as the PM</h2>
        <p>The redesign solved the problems it set out to solve. Seed identification went from impossible to universal. Task completion rates improved across every metric. Community features moved from invisible to discoverable. But the project also surfaced a deeper tension that the team navigated differently than I would have.</p>
        <h3>The sustainability tradeoff I'd revisit</h3>
        <p>The gumball machine was the most engaging part of the experience. Field observation confirmed it: nearly half of all passersby stopped and interacted with it. The team decided to keep it as the core distribution method, and I understand why. The tactile novelty is a genuine asset for a program that needs to attract first-time users.</p>
        <p>But I advocated for a different physical implementation. The capsule system relies on single-use plastic that our own research showed users were not returning despite signage. Only 4.32% of observed users completed the return step. That means the vast majority of capsules leave the library and do not come back. For a program whose mission centers on sustainability and circular reuse, the distribution method was working against the values it was meant to promote.</p>
        <p>I pushed for exploring plantable packaging: seed-embedded paper pulp or compressed cotton that could be colored for the identification system and stamped with a QR code. The seeds could be planted directly in the packaging itself, eliminating the "what do I do with this capsule" question entirely while closing the loop on the sustainability mission. The team overruled this in favor of the gumball machine's interaction appeal, and I think that was the wrong call.</p>
        <p>A crank-operated card dispenser, similar to old trading card or sticker machines, could preserve the tactile "turn and receive" moment without requiring round plastic objects. It would dispense flat seed packets or plantable cards, support batch production, and eliminate the return-step failure entirely because there would be nothing to return. The distribution method would be the product, not a container for the product.</p>
        <h3>Three things I'd change with a PM's authority</h3>
        <p>First, I would have defined quantitative success thresholds before the evaluation phase, not just "did it improve?" but "what completion rate constitutes a shippable experience?" The team relied on directional improvement, which is useful but doesn't tell you whether the system is ready for unattended deployment in real library environments.</p>
        <p>Second, I would have pushed harder for a second round of field observation after the redesign, not just moderated usability testing. Moderated tests tell you whether users can complete tasks when prompted. Field observation tells you whether they do, on their own, when no one is watching. The original field study was one of the most valuable data sources in the project, and the evaluation phase would have been stronger with a matching post-redesign observation session.</p>
        <p>Third, I would have scoped a supply-side metric: seed return rates tracked over time. The entire Seed Library model depends on circular participation, but we never measured whether the redesign improved the behavior that makes the system sustainable. A PM should track the metric that determines whether the product can sustain itself, not just whether it's usable in the moment.</p>
        <h3>If the Project Continued</h3>
        <p>The immediate next step would be real-world deployment testing in actual library environments with no facilitator present, tracking completion rates, return behavior, and event participation over time. Beyond that, the digital experience should be validated in Google Sites before assuming the Figma prototype translates cleanly; the client's platform constraints are real, and the gap between what Figma can show and what Google Sites can build is nontrivial. If the client eventually moves to a custom-built site, the Figma file includes dev specs and annotations that can serve as a direct handoff to development.</p>
      </section>

      <CaseStudyFooter>Anthony Shephard · University of Michigan · 2026</CaseStudyFooter>
    </div>
  )
}
