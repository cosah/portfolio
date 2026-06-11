// Mintify is the project-management case study: leading a 10-person student
// consulting team that redesigned Michigan debt court forms for a real
// government client. Structurally similar to the other case studies, but
// emphasizes process leadership (pods, decisions, cross-functional handoffs)
// over individual craft.

import Navbar from '../components/Navbar'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import GridFrames from '../components/GridFrames'
import ImageSlot from '../components/ImageSlot'
import BoardCarousel from '../components/BoardCarousel'
import BeforeAfterPair from '../components/BeforeAfterPair'
import StatRow from '../components/StatRow'
import TableOfContents from '../components/TableOfContents'
import CaseStudyFooter from '../components/CaseStudyFooter'

import imgPersona1 from '../assets/mintify-persona-1.png'
import imgPersona2 from '../assets/mintify-persona-2.png'
import imgJourneyBrett from '../assets/mintify-journey-brett.png'
import imgJourneyAndrew from '../assets/mintify-journey-andrew.png'
import imgAdviceLofi from '../assets/mintify-advice-lofi.png'
import imgAdviceRedesign from '../assets/mintify-advice-redesign.png'
import imgAnswerP1 from '../assets/mintify-answer-p1.png'
import imgAnswerP2 from '../assets/mintify-answer-p2.png'
import affinityHtml from '../assets/mintify-affinity.html?raw'
import imgHeroPoster from '../assets/mintify-hero-poster.png'

const surveyModules = import.meta.glob('../assets/mintify-survey/*.png', { eager: true })
const SURVEY_BOARDS = Object.entries(surveyModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod], i) => ({
    src: mod.default,
    label: `Question ${i + 1}`,
  }))

const presentationModules = import.meta.glob('../assets/mintify-presentation/*.png', { eager: true })
const PRESENTATION_BOARDS = Object.entries(presentationModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod], i) => ({
    src: mod.default,
    label: `Slide ${i + 1}`,
  }))

const kickoffModules = import.meta.glob('../assets/mintify-kickoff/*.png', { eager: true })
const KICKOFF_BOARDS = Object.entries(kickoffModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod], i) => ({
    src: mod.default,
    label: `Slide ${i + 1}`,
  }))

const META = [
  { label: 'Project', value: 'Mintify × MSCJFA' },
  { label: 'Org', value: 'Mintify @ U-M' },
  { label: 'Role', value: 'Project Manager' },
  { label: 'Client', value: 'MI Supreme Court' },
  { label: 'Team', value: '10 across 3 pods' },
  { label: 'Duration', value: '15 weeks' },
  { label: 'Year', value: 'Fall 2025' },
]

const STATS = [
  { label: 'Default judgment rate', value: '70%', delta: 'MI debt collection cases', tone: 'warn' },
  { label: 'Defendants without counsel', value: '97%', delta: 'no attorney representation', tone: 'warn' },
  { label: 'Forms scoped for redesign', value: '2', delta: 'Advice of Rights · Answer Form', tone: 'info' },
]

const PERSONAS = [
  {
    ix: 'P1',
    name: 'Brett',
    src: imgPersona1,
    alt: 'Brett persona: 21, U-M senior, anxious and overwhelmed by the form',
    desc: 'Anxious undergrad who googles unfamiliar terms and wants the form to confirm whether this is real.',
    contain: true,
  },
  {
    ix: 'P2',
    name: 'Andrew',
    src: imgPersona2,
    alt: 'Andrew persona: 24, masters student, stressed and unfamiliar with the court system',
    desc: 'Tech-literate masters student hit with an unexpected legal notice; wants to understand his rights and what to do next.',
    contain: true,
  },
]

const SECTIONS = [
  { num: 1, label: 'The problem', id: 'sec-1' },
  { num: 2, label: 'Team structure', id: 'sec-2' },
  { num: 3, label: 'Discovery', id: 'sec-3' },
  { num: 4, label: 'Strategy', id: 'sec-4' },
  { num: 5, label: 'The redesign', id: 'sec-5' },
  { num: 6, label: 'PM deep dive', id: 'sec-6' },
  { num: 7, label: 'Testing', id: 'sec-7' },
  { num: 8, label: 'Delivery', id: 'sec-8' },
  { num: 9, label: 'Contributions', id: 'sec-9' },
  { num: 10, label: 'Reflection', id: 'sec-10' },
]

const CONTRIBUTIONS = [
  { phase: 'Scope', work: 'Drafted initial client outreach, coordinated kickoff, established deliverable list and team structure with Mintify\'s president.' },
  { phase: 'Organize', work: 'Structured the team into three functional pods (Research, Analysis, Design), defined responsibilities, managed availability.' },
  { phase: 'Research', work: 'When initial tabling produced no engagement, intervened directly: organized sign-ups, assembled the table, sourced forms, arranged incentives. Led a full day of campus tabling that generated the bulk of the data.' },
  { phase: 'Testing', work: 'Participated in usability testing, handled participant recruiting, served as a session facilitator alongside the research team.' },
  { phase: 'Client', work: 'Primary client contact throughout. Led the mid-project alignment call that clarified deliverable priorities, coordinated status updates and expectation-setting.' },
  { phase: 'Status', work: 'Provided regular updates to the SO-ELL office and confirmed expectations with the client; shared research deliverables across the full team at key milestones.' },
  { phase: 'Timeline', work: 'Set internal design deadline of January 4 with handoff January 12–13; built buffer for report writing and presentation prep.' },
  { phase: 'Deliver', work: 'Coordinated final report assembly across all team functions; ensured all deliverables were complete and packaged for handoff.' },
]

export default function Mintify({ onHome }) {
  return (
    <div className="case-study-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="mintify" />

      <CaseStudyHero
        kicker="Case Study · Project Management · Government Client"
        title="Two proposed forms could decide whether defendants get due process."
        titleEmphasis="We rebuilt them."
        subtitle="A student consulting engagement to redesign two proposed court forms intended to give Michigan debt defendants a usable path into the legal process, serving a real government client with a 10-person cross-functional team."
        meta={META}
        corners={{ tl: '+ 00.00', tr: 'TABLING POSTER', bl: 'MINTIFY × MSCJFA', br: 'FALL 2025' }}
        heroImage={imgHeroPoster}
        heroImageAlt="Mintify tabling poster: Help everyday people navigate court. Grab a drink or a snack and talk with us for a few minutes."
        heroImageContain
      />

      <div className="case-study-layout">
        <aside className="toc-rail">
          <TableOfContents sections={SECTIONS} />
        </aside>

        <main id="main-content">

        <div className="section" id="sec-1">
          <SectionLabel num={1}>The problem</SectionLabel>
          <h2>Seventy percent of Michigan debt defendants never get to tell their side of the story.</h2>
          <div className="body-text">
            <p>When a debt collector files a complaint in Michigan, the defendant has little structured guidance for how to respond, and the result shows up downstream as default judgments. The Michigan Supreme Court's Justice For All Commission (MSCJFA) is workshopping two new court documents to close that gap: an Advice of Rights notice and an Answer Form, intended to be the bridge between a defendant and their ability to participate in the legal process.</p>
            <p>But in their initial drafts, the forms were dense, jargon-heavy, and cognitively overwhelming enough that participants gave up before they started. Exactly the failure mode the forms were meant to solve. The power imbalance is stark: <strong>over 90% of plaintiffs are represented by attorneys</strong>. For most defendants, the form <em>is</em> the system.</p>
          </div>
          <StatRow stats={STATS} />
          <div className="body-text">
            <p>The MSCJFA engaged Mintify to study the barriers, test the drafts with users, and rebuild both forms before they enter production. The goal: make these documents clear enough that defendants can actually use them.</p>
          </div>
        </div>

        <div className="section" id="sec-2">
          <SectionLabel num={2}>Team structure</SectionLabel>
          <h2>Organizing ten people around one client deliverable.</h2>
          <div className="body-text">
            <p>Mintify assigns members to projects based on interest and background. For this engagement, I structured the team into three functional pods, each responsible for a distinct phase of the work, with deliverable handoffs between them.</p>
          </div>
          <div className="contrib-grid">
            <div className="contrib-item">
              <div className="contrib-phase">Research · 3</div>
              <div className="contrib-work">Tabling, user interviews, survey design, affinity diagram, personas, journey maps, usability testing.</div>
            </div>
            <div className="contrib-item">
              <div className="contrib-phase">Analysis · 3</div>
              <div className="contrib-work">Survey instrument, data visualization, written synthesis for presentations and final report.</div>
            </div>
            <div className="contrib-item">
              <div className="contrib-phase">Design · 4</div>
              <div className="contrib-work">Lo-fi, mid-fi, and hi-fi redesigns of both forms; original document critique; design system.</div>
            </div>
          </div>
          <div className="body-text">
            <p>My job as PM was to keep these three pods coordinated, making sure research findings reached the design team, deliverable scope was clear, and the client stayed informed. The kickoff deck below is one of the first artifacts I drafted: it framed the engagement for the team, set deliverable expectations, and gave us a shared reference for the work ahead.</p>
          </div>
          <BoardCarousel
            id="2.1"
            caption="Kickoff slide deck: scope, deliverables, timeline, and pod responsibilities established with the team in week one."
            boards={KICKOFF_BOARDS}
            aspect="16x9"
          />
        </div>

        <div className="section" id="sec-3">
          <SectionLabel num={3}>Discovery</SectionLabel>
          <h2>What five interviews and 21 surveys revealed about legal form comprehension.</h2>
          <div className="body-text">
            <p>The research team's initial tabling attempts at the Ann Arbor library and courthouse produced no participant engagement, a schedule threat I could not let sit. I stepped in: organized sign-ups for a full campus tabling day, assembled the table, prepared the forms, and arranged food and drink incentives. The result was a single high-output day that generated the bulk of our data.</p>
          </div>
          <ImageSlot
            id="3.1"
            html={affinityHtml}
            alt="Affinity diagram of 84 sticky notes across 20 themed clusters synthesized from 5 interviews"
            caption="Affinity diagram: 84 sticky notes coded into 20 themes across five interview transcripts."
          />
          <div className="body-text">
            <p>Three failure modes emerged consistently. First, the legal terminology created a comprehension wall even for educated participants. Words like "plaintiff" and "defendant," used without definition, left interviewees unsure of their own role. Second, the density of information triggered cognitive overload before participants finished reading. Third, the forms buried critical action steps (deadlines, response options) inside blocks of undifferentiated text.</p>
            <p>On the survey, participants ranked plain language and visual deadlines as the most desired improvements, confirming that <strong>the core problem wasn't information quantity but information design</strong>.</p>
          </div>
          <BoardCarousel
            id="3.2"
            caption="Campus survey results across 21 respondents. Plain language and visual deadlines led the requested improvements."
            boards={SURVEY_BOARDS}
            aspect="16x9"
          />

          <h3>Two personas to brief the design team</h3>
          <GridFrames items={PERSONAS} cols={2} aspect="4x3" />

          <h3>Journey maps for each persona</h3>
          <div className="body-text">
            <p>The personas were paired with journey maps tracing each defendant's emotional and decision-making arc from receiving the forms in the mail through preparing for court. The opportunities column at the bottom of each map became the design team's working brief.</p>
          </div>
          <ImageSlot
            id="3.3"
            srcs={[
              { src: imgJourneyBrett, alt: 'Brett user journey map across four stages, from receiving the forms to reaching out for help' },
              { src: imgJourneyAndrew, alt: 'Andrew user journey map across four stages, from receiving the forms to reaching out for help' },
            ]}
            caption="User journey maps: Brett (left) and Andrew (right), each mapped across four stages from receipt to court preparation."
            aspect="4x3"
          />
        </div>

        <div className="section" id="sec-4">
          <SectionLabel num={4}>Strategy</SectionLabel>
          <h2>Scoping to what the client actually needed.</h2>
          <div className="body-text">
            <p>When we kicked off in late September, the deliverable list was ambitious: research affinity diagram, personas, journey maps, design drafts of both forms, survey data, usability testing, a final report, and a presentation. As PM, I needed to confirm that these aligned with the client's actual priorities.</p>
            <p>In a mid-project call with the MSCJFA contact, I learned something important. The client was primarily counting on the form design drafts and usability testing. The research artifacts were valued as supplemental context, not primary deliverables. This was a meaningful scope signal: the research had to happen, but the product we were shipping was the redesigned forms.</p>
          </div>

          <Callout
            tone="info"
            stat="↓1"
            label="The scope clarification · week 8"
            title="A direct conversation collapsed the deliverable list to one primary output."
          >
            <p>Validated, usability-tested redesigns of both court forms. Everything else became supporting documentation. This reoriented how the team spent its final weeks.</p>
          </Callout>

          <div className="body-text">
            <p>With the deliverable hierarchy clarified, I set an internal design deadline of January 4 for the high-fidelity final drafts, and planned the client handoff for January 12–13. This gave the design team a clear forcing function and ensured we weren't still iterating when the client was ready to receive work.</p>
          </div>
        </div>

        <div className="section" id="sec-5">
          <SectionLabel num={5}>The redesign</SectionLabel>
          <h2>Two forms rebuilt around the principle of one action at a time.</h2>
          <div className="body-text">
            <p>The design team's process unfolded across three fidelity stages: lo-fi sketches, mid-fi wireframes tested with users, and a final hi-fi revision informed by usability testing. Research findings were a consistent input at each stage.</p>
          </div>

          <h3>Advice of Rights: from a wall of text to three scannable sections</h3>
          <div className="body-text">
            <p>The original form was a dense, single-column document with no clear visual hierarchy. The redesign reorganized it into three distinct card sections (Steps to Follow, Warning, Find Legal Help) so a defendant could process one section at a time. The warning section got a high-contrast red color block to ensure the deadline and consequences were impossible to overlook. A QR code in the "Find Legal Help" section gave physical-format readers a direct path to legal resources without transcribing a URL.</p>
          </div>
          <ImageSlot
            id="5.1"
            src={imgAdviceRedesign}
            alt="Advice of Rights, redesigned: three card sections (Read Your Court Papers, Prepare an Answer, Go to the Hearing) with a high-contrast warning block and QR code"
            caption="Advice of Rights, redesigned: three card sections (Steps to Follow, Warning, Find Legal Help) with high-contrast warning block and QR code for legal resources."
            aspect="4x3"
            contain
          />

          <h3>Answer Form: making two scenarios visibly distinct</h3>
          <div className="body-text">
            <p>The original Answer Form's two primary scenarios ("I do not owe this debt" and "I owe the debt but...") sat stacked in a single column with similar formatting, leaving defendants unsure which section applied to them and how many boxes to check. The redesign split the scenarios horizontally and color-coded them, allowing defendants to compare them simultaneously rather than scrolling between dense paragraphs.</p>
          </div>
          <ImageSlot
            id="5.2"
            srcs={[
              { src: imgAnswerP1, alt: 'Redesigned Answer Form page 1: horizontally split, color-coded scenarios (A in orange, B in teal)' },
              { src: imgAnswerP2, alt: 'Redesigned Answer Form page 2: explanation field and bolded jury demand with link' },
            ]}
            caption="Redesigned Answer Form, pages 1 and 2. Scenarios split horizontally and color-coded; jury rights bolded and surfaced with a search prompt."
            aspect="4x3"
          />
        </div>

        <div className="section" id="sec-6">
          <SectionLabel num={6}>PM deep dive</SectionLabel>
          <h2>Running a research-to-design handoff across three teams.</h2>
          <div className="body-text">
            <p>The hardest operational challenge was the information flow between the three pods. Research ran ahead of design by design: the team needed user data before designers could make informed decisions. But team members had full course loads and variable availability. Waiting for research to fully complete before design started would have compressed the design phase dangerously.</p>
          </div>
          <h3>The handoff problem</h3>
          <div className="body-text">
            <p>I resolved this by structuring the process in overlapping phases rather than sequential ones. While research was still conducting interviews and analyzing data, I briefed the design team directly with early findings from tabling sessions. This let designers begin lo-fi concept work, exploring layout structures and form components, before the affinity diagram was complete. When research finished their synthesis, the design team had already developed directions to test the findings against, rather than starting from blank screens.</p>
          </div>
          <ImageSlot
            id="6.1"
            src={imgAdviceLofi}
            alt="Lo-fi sketch of the Advice of Rights redesign, with three section blocks and a deadline warning"
            caption="Lo-fi exploration of the Advice of Rights redesign: section blocking, hierarchy, and warning treatment sketched before the hi-fi pass."
            aspect="4x3"
            contain
          />
          <h3>Managing the client relationship</h3>
          <div className="body-text">
            <p>I served as the primary contact for the MSCJFA throughout. This meant drafting the initial client outreach in week one, scheduling and leading the kickoff, and running the November mid-project alignment call. That call, and the scope clarification that came from it, was the most consequential PM decision of the semester.</p>
          </div>
          <h3>Managing toward a deadline</h3>
          <div className="body-text">
            <p>Working backward from the client handoff date, I set an internal design deadline with one week of buffer for report writing, presentation prep, and final adjustments, buffer that turned out to be necessary, as the high-fidelity revisions took longer than the mid-fi cycle suggested.</p>
          </div>
        </div>

        <div className="section" id="sec-7">
          <SectionLabel num={7}>Testing & iteration</SectionLabel>
          <h2>What four usability tests revealed about the mid-fidelity designs.</h2>
          <div className="body-text">
            <p>With mid-fidelity designs complete, the team moved into usability testing. I handled participant recruiting and served as a facilitator alongside the research team. Each session was conducted by one researcher with a second member acting as notetaker, and sessions were recorded for later review.</p>
            <p>The good news: participants could navigate the redesigned forms and complete the required tasks, a meaningful improvement over the confusion the original forms produced. But several friction points remained that drove the final round of design changes.</p>
          </div>

          <DecisionCard number={1} title="Simplified Advice of Rights into three scannable sections" rationale="Users scan before they read. Information density must earn attention; if a section looks like work, it gets skipped.">
            <p>Even in the mid-fidelity prototype, some participants were only skimming the Advice of Rights. The hi-fi revision tightened the three-section structure, reducing text density and making each block visually self-contained with clear headers.</p>
          </DecisionCard>
          <DecisionCard number={2} title="Retained color coding on the Answer Form after confirming it worked" rationale="When a design decision solves the specific problem it was intended to solve, the right call is to protect it, not iterate on it.">
            <p>Participants in testing successfully differentiated the two primary response sections in the redesigned Answer Form, a result that did not happen with the original. The color coding was validated and carried forward unchanged.</p>
          </DecisionCard>
          <DecisionCard number={3} title="Revised the jury rights section after persistent confusion" rationale="A recurring failure across multiple test rounds means the design assumption is wrong, not the user.">
            <p>The jury demand paragraph at the bottom of the Answer Form continued to confuse participants even in the redesigned version. The final design bolded the word "jury" for fast visual identification and added a visual representation alongside the QR code.</p>
          </DecisionCard>
          <DecisionCard number={4} title="Added more space for the 'other' response option" rationale="Form design failures aren't always visual. A form people can't physically fill out is a form that won't be returned.">
            <p>Several participants noted that the blank field for the "other" checkbox was too small, raising concerns about defendants needing to write on the back of the form. The final design expanded this field.</p>
          </DecisionCard>
          <DecisionCard number={5} title="Merged sections B and C in the Answer Form" rationale="Reducing options reduces errors. Two clear paths are more navigable than three similar ones.">
            <p>Testing confirmed that the separation of B and C added confusion without clarity benefit. The final design combined them, reducing the form from three scenarios to two, simplifying the decision structure for defendants under stress.</p>
          </DecisionCard>
        </div>

        <div className="section" id="sec-8">
          <SectionLabel num={8}>Delivery</SectionLabel>
          <h2>What we handed to the Michigan Justice For All Commission.</h2>
          <div className="body-text">
            <p>At the January handoff meeting, the team delivered a complete package to the MSCJFA Debt Collection Workgroup: high-fidelity redesigns of both forms, a final report documenting the full process and findings, and a presentation summarizing the project.</p>
            <p>The high-fidelity designs were built to be immediately usable as a production reference, not just a prototype. Design decisions were documented with the reasoning behind them so the MSCJFA team could evaluate, adapt, or extend the work without losing context.</p>
          </div>
          <BoardCarousel
            id="8.1"
            caption="Final client presentation deck, walked through with the MSCJFA Debt Collection Workgroup at the January handoff."
            boards={PRESENTATION_BOARDS}
            aspect="16x9"
          />
        </div>

        <div className="section" id="sec-9">
          <SectionLabel num={9}>My contributions</SectionLabel>
          <h2>What I owned across each phase.</h2>
          <ContribGrid items={CONTRIBUTIONS} />
        </div>

        <div className="section" id="sec-10">
          <SectionLabel num={10}>Reflection</SectionLabel>
          <h2>What I'd do differently as the PM.</h2>
          <div className="body-text">
            <p>The most valuable lesson was about scope alignment: confirming what the client actually wants, early and directly, rather than assuming a comprehensive deliverable list is always better. The mid-project call that clarified the client's primary interest in the form designs would have been more valuable in week two than week eight.</p>
            <p>Three changes for a second run. First, I would have front-loaded direct client access for the research and design teams. I served as the communication bottleneck by design, which kept things organized but meant designers never heard the client's voice directly. Second, I would have set explicit success criteria before usability testing: task completion rate, comprehension thresholds, so the team had a clear pass/fail. Third, I would have planned a second round of usability testing on the high-fidelity designs before final handoff. We validated the mid-fi and iterated, but shipped the hi-fi on assumption that the changes worked. That's a gap.</p>
          </div>
        </div>

        </main>
      </div>

      <CaseStudyFooter slug="mintify · mscjfa" />
    </div>
  )
}
