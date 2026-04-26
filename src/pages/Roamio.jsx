import Navbar from '../components/Navbar'
import imgResearchIdeation  from '../assets/SI 311 Project Team Echo Ideation.png'
import imgResearchLeanCanvas from '../assets/SI 311 Project Team Echo Lean Canvas.png'
import imgResearchVPC        from '../assets/SI 311 Project Team Echo Value Proposition Canvas.png'
import imgResearchJourney    from '../assets/SI 311 Project Team Echo User Journey Map.png'
import imgResearchBPv1       from '../assets/SI 311 Project Team Echo Service Blueprint v1.png'
import imgResearchBPv2       from '../assets/SI 311 Project Team Echo Service Blueprint v2.png'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import ImageGrid from '../components/ImageGrid'
import ImageSlot from '../components/ImageSlot'
import ResearchCarousel from '../components/ResearchCarousel'
import StatRow from '../components/StatRow'
import VideoSection from '../components/VideoSection'
import PullQuote from '../components/PullQuote'
import CaseStudyFooter from '../components/CaseStudyFooter'

const RESEARCH_SLIDES = [
  { src: imgResearchIdeation,  label: 'Research Synthesis & Ideation' },
  { src: imgResearchLeanCanvas, label: 'Lean Canvas' },
  { src: imgResearchVPC,        label: 'Value Proposition Canvas' },
  { src: imgResearchJourney,    label: 'User Journey Map' },
  { src: imgResearchBPv1,       label: 'Service Blueprint v1' },
  { src: imgResearchBPv2,       label: 'Service Blueprint v2' },
]

const THEME = {
  '--color-accent': '#1D3D2F',
  '--color-accent-soft': '#E4EDE9',
}

const META = [
  { label: 'Role', value: 'Product Researcher, Product Strategy' },
  { label: 'Ownership', value: 'Customer Discovery Research' },
  { label: 'Team', value: '4 members (Team Echo, SI 311)' },
  { label: 'Timeline', value: 'Spring 2026, 15 weeks' },
  { label: 'Tools', value: 'Figma Make, Google Forms, Think-Aloud Protocol' },
]

const STATS = [
  { number: '5+', label: 'apps used per trip by the typical Gen Z traveler' },
  { number: '72%', label: 'of Gen Z travelers want local cultural immersion' },
  { number: '0', label: 'existing tools combine local expert curation with centralized booking' },
]

const HYPOTHESES = [
  { id: 'D1', text: 'Travelers prefer human-curated local recs over algorithmic alternatives. 5/5 rejected AI recs. Average 4.2/5 on "local agent more appealing than algorithm."', signal: 'validated', signalText: 'Validated' },
  { id: 'D2', text: 'Gamified map increases engagement over list browsing. 2/5 strongly engaged; map ranked #4 of 6 features in survey. Curated itinerary ranked #1.', signal: 'partial', signalText: 'Partial' },
  { id: 'D3', text: 'Travelers are frustrated by fragmented planning tools and want a centralized flow. Strong signal for group planners; weaker for solo and resort travelers.', signal: 'partial', signalText: 'Partial' },
  { id: 'D4', text: 'Travelers actively seek hidden, gatekept local spots and feel underserved. 4/5 actively seek. Concept resonated; execution of the reveal needed work.', signal: 'validated', signalText: 'Validated' },
  { id: 'D5', text: 'Identity-linked reviews are more trusted than anonymous reviews. 3/5 preferred named. P3 prefers anonymous (Reddit). Split signal across participant types.', signal: 'partial', signalText: 'Partial' },
  { id: 'V1', text: 'Gen Z will pay for curated packages; price sensitivity tied to scope. WTP confirmed ($50-200 itinerary, $2K+ full package) but only when pricing is transparent.', signal: 'conditional', signalText: 'Conditional' },
  { id: 'V2', text: 'Target segment is large enough and travels frequently enough. 4/5 travel 2+ times per year. Directional confirmation only; a larger sample is needed for a real market read.', signal: 'partial', signalText: 'Directional' },
  { id: 'V3', text: 'Local experts willing to create packages at a 25-50% commission. Not testable with demand-side participants. A supply-side research sprint is the critical next validation step.', signal: 'partial', signalText: 'Untested' },
  { id: 'V4', text: 'Travelers would choose Roamio over free alternatives. "With flexibility, I would." Rigidity of bundles was the primary adoption blocker.', signal: 'partial', signalText: 'Partial' },
  { id: 'V5', text: 'Referral discount drives organic acquisition. 4/5 very or somewhat likely to refer with a discount. Strongest viability signal in the dataset.', signal: 'validated', signalText: 'Validated' },
]

const CONTRIBUTIONS = [
  { phase: 'Problem', work: 'Contributed to problem framing and competitive landscape analysis in P1 (Problem Statement). Helped define the customer persona: Gen Z and Millennial independent travelers frustrated by fragmented, untrustworthy planning tools.' },
  { phase: 'Strategy', work: 'Co-owned the Journey and Blueprint deliverable for P2 (Product Vision and Strategy) with Amy. Contributed to the Lean Business Canvas and helped define the two-sided marketplace structure connecting travelers to local agents.' },
  { phase: 'Research Design', work: 'Authored the customer discovery interview guide, covering warm-up, grand tour, and two deep-focus modules. Co-designed the usability test plan and hypothesis coverage map. Designed and deployed the post-session survey (18 questions across Likert scales, feature rankings, willingness to pay, and open-ended feedback).' },
  { phase: 'Interviews', work: 'Served as facilitator and notetaker for P1 (Adventure Traveler) and P2 (Group/Social Traveler). P1\'s checkout session produced the transparency insight that drove the product\'s most important post-test iterations. P2\'s session surfaced the customization and hotel-selection gaps.' },
  { phase: 'Synthesis', work: 'Coded all findings against the ten hypothesis framework (D1-D5, V1-V5). Contributed to the affinity diagram and severity-scoring of usability issues. Synthesized the cross-method finding that information opacity, not price, was the primary conversion blocker.' },
  { phase: 'Validation', work: 'Owned the "What We Learned," "Validation and Product-Market Fit," and "What\'s Next" sections of the Demo Day final pitch. Presented research findings and hypothesis scorecard to the class on April 19, 2026.' },
  { phase: 'Prioritization', work: 'Translated usability findings into a severity-ranked backlog: itemized checkout (P0), package customization (P0), rich media reveals (P1), agent profiles (P1), and activity tags (P2). All five shipped before the final pitch.' },
]

export default function Roamio({ onHome }) {
  return (
    <div className="case-study-page" style={THEME}>
      <Navbar onHome={onHome} label="SI 311 · Zero-to-One Product Design" />

      <CaseStudyHero
        title="Roamio"
        subtitle="A travel marketplace connecting Gen Z and Millennial travelers with verified local agents who curate trip packages featuring insider secrets, built from scratch in 15 weeks as part of a zero-to-one product design course."
        meta={META}
      />

      <section className="wide">
        <ImageGrid columns={4}>
          <ImageSlot label="Figma Export">Homepage: "Every Local Knows Something You Don't"</ImageSlot>
          <ImageSlot label="Figma Export">Explore: Gamified World Map</ImageSlot>
          <ImageSlot label="Figma Export">Package Detail: Agent Profile + Teased Secrets</ImageSlot>
          <ImageSlot label="Figma Export">My Trip: Secrets Unlocked</ImageSlot>
        </ImageGrid>
      </section>

      <section>
        <SectionLabel>The Problem</SectionLabel>
        <h2>Planning a trip today means trusting strangers on the internet and juggling five apps at once</h2>
        <p>Gen Z and Millennial travelers want authentic, locally-informed experiences. What they get instead is a research spiral: Reddit threads, TikTok saves, Google Maps lists, travel blogs, booking platforms, and group chats, all running in parallel, all pointing to different places, none of them trustworthy enough to book without second-guessing.</p>
        <p>The core tension is a trust problem. Forty-two percent of Gen Z booked a guided tour last year, and seventy-two percent say they want to immerse themselves in local culture. But no platform gives them a named, accountable person whose expertise they can evaluate. Anonymous reviews have no skin in the game. AI-generated itineraries are indistinguishable from each other. And the tools that do surface local knowledge, Reddit threads, travel influencer posts, don't connect to booking.</p>
        <p>The result: travelers cobble together their own imperfect research, go somewhere that looked better on TikTok than it was in person, and come home wondering what they missed.</p>
        <StatRow stats={STATS} />
      </section>

      <section>
        <SectionLabel>Discovery</SectionLabel>
        <h2>Why existing tools fail, and what travelers actually want instead</h2>
        <p>SI 311 is a zero-to-one product design course built around five sequential project phases: problem statement, product concept, prototype and iterate, data and learnings, and a final pitch. Team Echo's research phase ran across phases three and four, spanning customer discovery interviews, moderated usability tests, and a post-session survey.</p>
        <p>I designed the customer discovery interview guide and co-designed the usability test plan. The interview guide was structured around three modules: warm-up (travel profile and recent trip), a grand tour question (step-by-step planning walkthrough), and two deep focus areas (local recommendations and planning tools). This structure was deliberate: we wanted participants to surface their real behavior before we introduced Roamio, so their reactions to the prototype weren't colored by what they thought we wanted to hear.</p>
        <p>The team ran five sessions in total, each pairing a customer discovery interview with a moderated usability test and a post-session survey. I facilitated and notetook two of the five sessions, while the rest were run by other team members using the same protocol.</p>
        <ResearchCarousel slides={RESEARCH_SLIDES} lightbox />
        <p>The competitive landscape our research mapped was revealing: Airbnb Experiences offered a marketplace but no curation. Viator handled tour logistics but not insider knowledge. Reddit and TikTok surfaced authentic local content but had no booking. ToursByLocals offered private tours but no hidden-gem mechanic. Nobody combined a named local expert, insider recommendations, and centralized booking in one place.</p>
      </section>

      <section>
        <SectionLabel>Strategy</SectionLabel>
        <h2>A two-sided marketplace built on the premise that the local agent is the product</h2>
        <p>Roamio's business model is structured as a two-sided marketplace: travelers pay for curated packages with insider secrets, local agents create and sell those packages and earn per booking, and Roamio takes a 15 to 25 percent platform commission. Revenue streams include package commissions, premium add-ons (photography, insurance, experience upgrades), and a la carte secrets sold as standalone purchases.</p>
        <ImageSlot label="Figma Export">Lean Business Canvas: problem, solution, key metrics, UVP, channels, customer segments, revenue streams, cost structure</ImageSlot>
        <p>The team grounded the strategy in ten testable hypotheses across two dimensions: desirability (D1 through D5) and viability (V1 through V5). This framework drove every research decision. Each interview question, usability task, and survey item mapped to at least one hypothesis, so findings could be traced directly back to the product bets that mattered. Going into testing, the most critical question was D1: would travelers actually prefer a named human expert over algorithmic alternatives? The entire value proposition depended on the answer being yes.</p>
        <p>Market sizing put the global guided travel and experience market at over $50 billion. We scoped the serviceable market to the $8 billion slice of US-based Gen Z and Millennial experience-seekers, with a realistic year-one capture of $3 to 5 million across pilot launch cities.</p>
      </section>

      <section>
        <SectionLabel>The Product</SectionLabel>
        <h2>Four screens, one complete journey from discovery to unlocked secrets</h2>
        <p>The Roamio prototype, built in Figma Make, covered the full traveler journey across four core experiences.</p>
        <h3>Homepage and Value Proposition</h3>
        <p>The homepage opens with "Every Local Knows Something You Don't" and immediately surfaces three pillars: Verified Local Agents, Secrets Revealed, Insider Access. A "How It Works" section explains the tease-then-reveal mechanic: browse packages from named local agents, book, and unlock the secrets your guide has never published anywhere else.</p>
        <h3>Explore: Gamified World Map</h3>
        <p>An interactive world map where regions light up as users discover them. Destinations are surfaced through map exploration rather than search, encouraging wandering rather than querying. Participants who landed here described it as feeling more like a game than a search bar, and P5 called it their favorite feature in the prototype.</p>
        <h3>Package Detail and Agent Profile</h3>
        <p>Each package shows the agent by name, where they're from, their credentials, and a preview of the secrets included. The full list of insider spots remains locked until booking, creating curiosity and purchase motivation. Packages include a day-by-day itinerary, a trip calendar, and a pricing breakdown.</p>
        <h3>My Trip: Secrets Unlocked</h3>
        <p>The post-booking dashboard is the payoff. Confirmed travelers see the full list of insider spots, a message from the local agent with personal context, and a curated guide they keep forever. The goal was to make the reveal feel like a gift, not just a receipt.</p>
      </section>

      <section className="wide">
        <ImageGrid columns={4}>
          <ImageSlot label="Figma Export">Packages List View</ImageSlot>
          <ImageSlot label="Figma Export">Package Detail with Agent Badge</ImageSlot>
          <ImageSlot label="Figma Export">Checkout Flow</ImageSlot>
          <ImageSlot label="Figma Export">Booked Trip: Secrets Unlocked</ImageSlot>
        </ImageGrid>
      </section>

      <section>
        <SectionLabel>Research Deep Dive</SectionLabel>
        <h2>The interview that changed the checkout</h2>
        <p>I facilitated two of the five research sessions: a combined customer discovery interview and usability test with P1 and P2. These two sessions produced some of the most consequential data in the project, and the insight that emerged from P1's checkout reaction became the product's central post-test pivot.</p>
        <h3>P1: The Adventure Traveler</h3>
        <p>P1 was an experienced adventure traveler who allocates two to four weeks per year to travel, typically a mix of family trips and experiential travel. He described himself as an "intrepid" traveler willing to take risks. During the customer discovery interview, he was measured about Roamio's concept: open to local curation, but not convinced the platform was necessary given his own ability to filter information. His attitude going into the usability test was one of informed skepticism.</p>
        <p>Everything changed at the checkout screen. He looked at the package price, found it "reasonable," then asked whether flights were included. When I confirmed they weren't, his reaction was immediate and unambiguous.</p>
        <PullQuote cite="P1, Adventure Traveler, immediately after learning flights were not included in checkout">
          "Then too expensive. All too expensive. Is it flights, hotels, meals? If it's just hotel and the guide, not worth it."
        </PullQuote>
        <p>Within thirty seconds, P1 had gone from willing to pay to completely unwilling, and the reason had nothing to do with the price itself. It was the absence of an itemized breakdown. He couldn't evaluate value because he couldn't see what he was buying.</p>
        <h3>The Pattern Across Sessions</h3>
        <p>I brought this finding into the team's synthesis session, and it aligned with what was surfacing across the other three sessions. P2 couldn't find hotel information on the package detail page and noted that activities like "cruise" and "wine tasting" were listed as plain text with no detail. P3, interviewed by another team member, said outright that she "would not book if I didn't know what I was booking." The pattern was unmistakable.</p>
        <Callout label="The Core Insight" stat="4">
          <p>All four of the critical issues identified in testing traced back to a single root cause: information opacity before booking. The blind booking mechanic (secrets locked behind full payment), the missing checkout breakdown, the lack of package customization, and the text-only secret reveal were all downstream of the same product problem. The price wasn't the blocker. The information vacuum around the price was.</p>
        </Callout>
        <h3>Translating the Finding into Priorities</h3>
        <p>I synthesized these findings into a prioritized action list for the design team, framed by severity and adoption impact. Two issues earned P0 status: adding an itemized package breakdown with hotel details to the checkout flow, and introducing package customization so travelers could choose hotels, select dates, and buy secrets separately. A third earned P1: enriching the secret reveal with maps, photos, and location pins rather than plain text. The design team implemented all five post-test changes before the Demo Day pitch.</p>
        <ImageGrid columns={2}>
          <ImageSlot label="Figma Export">Pre-Revision: Package Detail (text-only secrets, thin agent badge, no itemized checkout)</ImageSlot>
          <ImageSlot label="Figma Export">Post-Revision: Itemized checkout, hotel selection, rich media reveals, activity tags</ImageSlot>
        </ImageGrid>
      </section>

      <section>
        <SectionLabel>Validation</SectionLabel>
        <h2>What five participants revealed across 10 hypotheses</h2>
        <p>All findings were coded against the ten hypotheses the team defined before any research began. Each participant contributed across three methods: a semi-structured interview, a moderated usability test, and a post-session survey. The scorecard below reflects the triangulated signal across all three.</p>
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
        <p>The strongest signal in the dataset was D1: human curation over algorithmic recs. Every participant, unprompted, articulated some version of the same preference. The most important conditional finding was V1: willingness to pay is real, but it is gated behind transparency. Travelers know what they want to pay once they understand what they're getting. The product's job is to close that information gap before checkout.</p>
      </section>

      <section>
        <SectionLabel>Iteration</SectionLabel>
        <h2>Five product changes that came directly from testing</h2>
        <p>The research synthesis produced a prioritized backlog of design changes. The team shipped all five before Demo Day, treating each as a direct response to observed user behavior.</p>
        <DecisionCard number={1} title="Itemized Checkout with Hotel Details" rationale="The price isn't the problem. The information vacuum around the price is. Transparency doesn't reduce conversion, it enables it.">
          <p>P1's price reaction flipped the moment he learned what was and wasn't included. P2 couldn't find hotel information on the detail page. The revision added a complete line-item breakdown: agent fee, hotel, activities, and what was explicitly excluded (flights). Travelers now evaluate value before committing, not after.</p>
        </DecisionCard>
        <DecisionCard number={2} title="Package Customization: A La Carte Secrets and Hotel Choice" rationale="Flexibility unlocks conversion. Forcing travelers into fixed bundles creates the impression of a product that wasn't designed for them.">
          <p>Multiple participants wanted to buy secrets without the full package, or swap to a preferred hotel. Rigid bundles were the most cited barrier to purchase. The revision introduced customization options: travelers can select their hotel, adjust dates, and purchase secrets standalone.</p>
        </DecisionCard>
        <DecisionCard number={3} title="Rich Media Secret Reveals" rationale="The reveal is the product's most memorable moment. If it underwhelms, the entire purchase feels like a mistake. Make the payoff match the anticipation.">
          <p>The prototype's secret reveal was text-only. P2 wanted maps, photos, and pin drops. A text list of insider spots doesn't deliver the "wow factor" that justifies the product's core promise. The revision introduced rich media reveals: photos, location pins, and context notes alongside each secret.</p>
        </DecisionCard>
        <DecisionCard number={4} title="Richer Agent Profiles" rationale="Trust in a named local expert requires enough information to actually judge them. A name alone isn't enough. Give travelers what they need to make that judgment.">
          <p>P1 wanted to see a photo and bio for the agent. P2 noted that interest alignment mattered more than identity alone. The revision added agent profile photos, bios, local context, and activity/interest tags so travelers could assess whether a specific agent's taste matched their own.</p>
        </DecisionCard>
        <DecisionCard number={5} title="Activity Tags for Interest Matching" rationale="Reducing browse friction increases depth. When travelers find packages that match before they click, they spend more time evaluating rather than scanning and leaving.">
          <p>Participants with different travel styles had different implicit filters: outdoorsy vs. relaxed, food-focused vs. adventure. Without tags, the browse experience forced travelers to read every package detail before understanding whether it matched their style. Activity tags surface the right packages faster.</p>
        </DecisionCard>
      </section>

      <section className="wide">
        <div style={{ margin: '48px 0' }}>
          <SectionLabel>Try It</SectionLabel>
          <h2 style={{ marginBottom: '8px' }}>Interactive Prototype</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', maxWidth: '560px' }}>The final Roamio prototype was built in Figma Make. Open it in a new tab to click through the homepage, world map, package detail, checkout, and the secrets-unlocked trip dashboard.</p>
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
      </section>

      <section className="wide">
        <VideoSection
          title="Demo Day Walkthrough"
          description="A guided tour of the final Roamio prototype presented at SI 311 Demo Day, April 2026."
          mp4="roamio-demo.mp4"
          mov="roamio-demo.mov"
        />
      </section>

      <section>
        <SectionLabel>My Contributions</SectionLabel>
        <h2>What I owned across each phase</h2>
        <ContribGrid items={CONTRIBUTIONS} />
      </section>

      <section>
        <SectionLabel>Reflection</SectionLabel>
        <h2>What I'd do differently as the PM</h2>
        <p>The biggest product lesson from Roamio was about the gap between a compelling concept and a trustworthy product. The local agent model validated strongly: 5/5 participants rejected AI recommendations in favor of human curation. The market wants what Roamio promises. But the prototype kept revealing the same failure: when travelers couldn't see what they were buying, they didn't buy. The product's information design was working against the business model.</p>
        <p>In a product role, I would have pushed for transparency as a first-class feature from the beginning rather than a post-test fix. That means: define what information a traveler needs to feel confident at checkout before designing the checkout, not after testing it. We treated opacity as a design constraint and discovered it was actually a conversion blocker. A PM should catch that upstream.</p>
        <p>Three specific things I'd change. First, I would have interviewed supply-side participants: local agents and tour operators. All our research was demand-side, which is correct for early validation, but V3 (guide willingness to take a 25 to 50 percent commission) was marked "not testable" throughout. That's a critical assumption for a marketplace to leave unexamined through an entire semester. Even two supply-side interviews would have surfaced whether the commission structure was realistic. Second, I would have defined quantitative success thresholds before testing: what task completion rate would validate each hypothesis, what Likert score would qualify as "high enough confidence to ship." We relied on qualitative judgment calls instead, which left the team debating what "partial" meant for D3. Third, I would have run a second round of usability testing on the revised prototype before Demo Day. We iterated based on findings and shipped five changes, but never verified those changes worked. That's the same gap I identified in the Mintify project: we assume the fix addressed the failure without proving it.</p>
        <h3>If Roamio Continued</h3>
        <p>The immediate next steps are supply-side validation: recruit and interview local agents in two or three candidate pilot cities to test the commission model, understand what friction exists in package creation, and find out what content tools agents need to produce quality packages at scale. The agent onboarding flow is the product that makes all the other product work. Without a usable creation experience, there are no packages to browse, no secrets to unlock, and no marketplace. The local agent is the product. Everything else is infrastructure.</p>
      </section>

      <CaseStudyFooter>Anthony Shephard · University of Michigan · 2026</CaseStudyFooter>
    </div>
  )
}
