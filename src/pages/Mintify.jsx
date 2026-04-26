import Navbar from '../components/Navbar'
import imgAffinity from '../assets/mintify-affinity.png'
import imgPersona1 from '../assets/mintify-persona-1.png'
import imgPersona2 from '../assets/mintify-persona-2.png'
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
  '--color-accent': '#1A3B5C',
  '--color-accent-soft': '#DCE9F5',
  '--color-accent-night': '#6BA3C8',
}

const META = [
  { label: 'Role', value: 'Project Manager' },
  { label: 'Client', value: 'Michigan Supreme Court Justice For All Commission' },
  { label: 'Team', value: '10 members across Research, Analysis & Design' },
  { label: 'Timeline', value: 'Fall 2025, ~15 weeks' },
  { label: 'Org', value: 'Mintify @ U-M, sponsored by SO-ELL/UMSI' },
]

const STATS = [
  { number: '70%', label: 'of Michigan debt collection cases end in default judgment' },
  { number: '97%', label: 'of defendants have no attorney representation' },
  { number: '2', label: 'court forms standing between defendants and due process' },
]

const CONTRIBUTIONS = [
  { phase: 'Scope', work: 'Drafted initial client outreach, coordinated first contact and kickoff meeting, established deliverable list and team structure with Mintify\'s president' },
  { phase: 'Organize', work: 'Structured the team into three functional pods (Research, Analysis, Design), defined responsibilities for each pod, managed availability and attendance' },
  { phase: 'Research', work: 'When initial tabling at the Ann Arbor library and courthouse yielded no engagement and threatened our research timeline, I intervened directly: organized team sign-ups, assembled the table, sourced forms, and arranged food and drink incentives. Led a full day of on-campus tabling that generated surveys, contextual inquiries, and interview sign-ups. Also briefed the design team with early tabling findings to enable overlapping phase work before the affinity diagram was complete.' },
  { phase: 'Testing', work: 'Participated directly in usability testing, handled participant recruiting and served as a facilitator in test sessions alongside the research team' },
  { phase: 'Client', work: 'Served as primary client contact throughout the project; led the mid-project alignment call that clarified the deliverable priority hierarchy; coordinated status updates and expectation-setting across the full engagement' },
  { phase: 'Status', work: 'Provided regular status updates to the SO-ELL office and confirmed expectations with the client; shared research deliverables across the full team at key milestones' },
  { phase: 'Timeline', work: 'Set internal deadline of January 4th for final design; planned client handoff for January 12–13; built buffer for report writing and presentation preparation' },
  { phase: 'Deliver', work: 'Coordinated final report assembly across all team functions; ensured all deliverables were complete and packaged for the January handoff meeting' },
]

export default function Mintify({ onHome }) {
  return (
    <div className="case-study-page" style={THEME}>
      <Navbar onHome={onHome} label="Mintify Consulting · Project Manager" />

      <CaseStudyHero
        title="Mintify × Michigan Justice For All"
        subtitle="A student consulting engagement to redesign the court forms that stand between Michigan debt defendants and access to justice, serving a real government client with a 10-person cross-functional team."
        meta={META}
      />

      <section>
        <SectionLabel>The Problem</SectionLabel>
        <h2>Seventy percent of Michigan debt defendants never get to tell their side of the story</h2>
        <p>In Michigan, defendants in debt collection cases face an almost impossible information asymmetry. When a debt collector files a complaint, the defendant receives two court documents: an Advice of Rights notice and an Answer Form. These two pieces of paper are the only bridge between the defendant and their ability to participate in the legal process.</p>
        <p>Most defendants never use them — not because they don't have a defense, but because the forms are dense, jargon-heavy, and cognitively overwhelming enough that many give up before they start.</p>
        <p>The power imbalance is stark: over 90% of plaintiffs are represented by attorneys. For most defendants, the form <em>is</em> the system. If they can't understand it, they can't access justice.</p>
        <StatRow stats={STATS} />
        <p>The Michigan Supreme Court Justice For All Commission (MSCJFA), which works to close gaps in access to justice, engaged Mintify to study the barriers and redesign both forms. The goal: make these documents clear enough that defendants can actually use them.</p>
      </section>

      <section>
        <SectionLabel>Team Structure</SectionLabel>
        <h2>Organizing ten people around one client deliverable</h2>
        <p>Mintify assigns members to projects based on interest and background. For this engagement, I structured the team into three functional pods, each responsible for a distinct phase of the work, with deliverable handoffs between them.</p>
        <div className="team-grid">
          <div className="team-pod">
            <span className="pod-label">Research</span>
            <h4>3 Members</h4>
            <p>Tabling, user interviews, survey design, affinity diagram, personas, journey maps, usability testing</p>
          </div>
          <div className="team-pod">
            <span className="pod-label">Analysis</span>
            <h4>3 Members</h4>
            <p>Survey instrument, data visualization, written synthesis for presentations and final report</p>
          </div>
          <div className="team-pod">
            <span className="pod-label">Design</span>
            <h4>4 Members</h4>
            <p>Lo-fi, mid-fi, and hi-fi redesigns of both forms; original document critique; design system</p>
          </div>
        </div>
        <p>My job as PM was to keep these three pods coordinated, making sure research findings reached the design team, deliverable scope was clear, and the client stayed informed. Mintify's president and I were the primary client-facing contacts throughout.</p>
      </section>

      <section>
        <SectionLabel>Discovery</SectionLabel>
        <h2>What five interviews and 21 surveys revealed about legal form comprehension</h2>
        <p>The research team's initial tabling attempts at the Ann Arbor library and courthouse produced no participant engagement, a schedule threat I couldn't let sit. I stepped in directly: organized team sign-ups for a full campus tabling day, assembled the table, prepared the forms, and arranged food and drink as incentives to draw passersby. The result was a single high-output day that generated the bulk of our data: survey responses, contextual inquiries, and interview commitments from University of Michigan students.</p>
        <p>The research approach was deliberately mixed: the survey captured scaled self-assessments of trust and comprehension, while the interviews surfaced the specific language and interaction patterns that caused confusion.</p>
        <ImageSlot label="Affinity Diagram" src={imgAffinity} alt="Affinity diagram: synthesized from 5 interviews, coded by theme" />
        <p>Three failure modes emerged consistently across both forms and all participants. First, the legal terminology created a comprehension wall even for educated participants. Words like "plaintiff" and "defendant," used without definition, left interviewees unsure of their own role in the process. Second, the density of information on each page triggered cognitive overload before participants finished reading, many skimmed or gave up. Third, the forms buried critical action steps (deadlines, response options) inside blocks of undifferentiated text, making it difficult for participants to identify what they were actually supposed to do.</p>
        <p>On the survey, participants were also asked which improvements would most help them understand court documents. Plain language and visual deadlines were the most common responses, confirming that the core problem wasn't information quantity but information design.</p>
        <ImageSlot label="Figma Export">Survey data visualization: comprehension and trust ratings across 21 respondents</ImageSlot>
        <p>The research team also developed two personas and accompanying journey maps: one representing a defendant who actively tries to navigate the forms, and one representing a defendant who becomes overwhelmed and disengages. These artifacts served as the bridge document I used to brief the design team before they began their redesign work.</p>
        <ImageGrid columns={2}>
          <ImageSlot label="Andrew — Engaged Defendant" src={imgPersona1} alt="Andrew persona: engaged defendant" />
          <ImageSlot label="Brett — Overwhelmed Defendant" src={imgPersona2} alt="Brett persona: overwhelmed defendant" />
        </ImageGrid>
      </section>

      <section>
        <SectionLabel>Strategy</SectionLabel>
        <h2>Scoping to what the client actually needed</h2>
        <p>When we kicked off in late September, the deliverable list was ambitious: research affinity diagram, personas, journey maps, design drafts of both forms, survey data visualization, usability testing, a final report, and a presentation. As PM, I also needed to confirm that these deliverables aligned with the client's actual priorities, not just what seemed thorough from our side.</p>
        <p>In a mid-project check-in call with the MSCJFA project contact, I learned something important. The client was primarily counting on the form design drafts and usability testing. The research artifacts, affinity diagrams, personas, journey maps, were valued as supplemental context, not primary deliverables. This was a meaningful scope signal: the research work had to happen (it informed the designs), but the product we were shipping to the client was the redesigned forms.</p>
        <Callout label="The Scope Clarification" stat="↓ 1">
          <p>Midway through the project, a direct conversation with the client collapsed our deliverable list from a broad research report to a single clear primary output: validated, usability-tested redesigns of both court forms. Everything else became supporting documentation. This reoriented how the team spent its final weeks.</p>
        </Callout>
        <p>With the deliverable hierarchy clarified, I set an internal design deadline of January 4th for the high-fidelity final drafts, and planned the client handoff meeting for January 12–13. This gave the design team a clear forcing function and ensured we weren't still iterating when the client was ready to receive work.</p>
      </section>

      <section>
        <SectionLabel>The Redesign</SectionLabel>
        <h2>Two forms rebuilt around the principle of one action at a time</h2>
        <p>The design team's process unfolded across three fidelity stages, lo-fi sketches, mid-fi wireframes tested with users, and a final hi-fi revision informed by usability testing, with research findings as the consistent input at each stage.</p>
        <h3>Advice of Rights</h3>
        <p>The original form was a dense, single-column document with no clear visual hierarchy. The redesign reorganized it into three distinct card sections, Steps to Follow, Warning, and Find Legal Help, so a defendant could process one section at a time. The warning section was given a high-contrast red color block to ensure the deadline and consequences were impossible to overlook. A QR code in the "Find Legal Help" section gave physical-format readers a direct path to legal resources without transcribing a URL.</p>
        <h3>Answer Form</h3>
        <p>The original form's two primary scenarios, "I do not owe this debt" and "I owe the debt but…", were visually indistinguishable. Defendants were confused about which section applied to them and how many boxes to check. The redesign split these scenarios horizontally and color-coded them, allowing defendants to compare them simultaneously. White space was added between checkbox options to prevent visual merging. The jury rights section, which consistently confused participants, received bolded language and a visual representation of the QR code to help defendants quickly identify and process it.</p>
      </section>

      <section>
        <SectionLabel>PM Deep Dive</SectionLabel>
        <h2>Running a research-to-design handoff across three teams</h2>
        <p>The hardest operational challenge of this project wasn't the design work, it was the information flow between the three pods. Research ran ahead of design by design: the team needed user data before the designers could make informed decisions. But in a consulting club context, team members had full course loads and variable availability. Waiting for research to fully complete before design started would have compressed the design phase dangerously.</p>
        <h3>The Handoff Problem</h3>
        <p>I resolved this by structuring the process in overlapping phases rather than sequential ones. While research was still conducting interviews and analyzing data, I briefed the design team directly with early findings from tabling sessions. This let designers begin lo-fi concept work, exploring layout structures and form components, before the affinity diagram was complete. When research finished their synthesis, the design team had already developed a set of directions to test the findings against, rather than starting from blank screens.</p>
        <ImageSlot label="Figma Export">Lo-fidelity sketches: initial design directions explored before full research synthesis</ImageSlot>
        <h3>Managing the Client Relationship</h3>
        <p>I served as the primary contact for the MSCJFA throughout the project. This meant drafting the initial client outreach in week one, scheduling and leading the kickoff, and running the November mid-project alignment call. That call, and the scope clarification that came from it, was the most consequential PM decision of the semester.</p>
        <h3>Managing Toward a Deadline</h3>
        <p>Working backward from the client handoff date, I set an internal design deadline with one week of buffer for report writing, presentation prep, and final adjustments — buffer that turned out to be necessary, as the high-fidelity revisions took longer than the mid-fi iteration cycle suggested.</p>
      </section>

      <section>
        <SectionLabel>Testing & Iteration</SectionLabel>
        <h2>What four usability tests revealed about the mid-fidelity designs</h2>
        <p>With mid-fidelity designs complete, the team moved into usability testing. I handled participant recruiting and served as a facilitator in test sessions alongside the research team. Each session was conducted by one Mintify researcher with a second member acting as notetaker, and sessions were recorded for later review. Insights were synthesized into a shared document that guided the final design revision.</p>
        <p>The good news: participants were generally able to navigate the redesigned forms and complete the required tasks successfully, a meaningful improvement over the confusion the original forms produced. But several friction points remained that drove the final round of design changes.</p>
        <DecisionCard number={1} title="Simplified the Advice of Rights into Three Scannable Sections" rationale="Users scan before they read. Information density must earn attention, if a section looks like work, it gets skipped.">
          <p>Even in the mid-fidelity prototype, some participants were only skimming the Advice of Rights rather than reading it through. The high-fidelity revision tightened the three-section structure further, reducing text density in each section and making each block visually self-contained with clear headers.</p>
        </DecisionCard>
        <DecisionCard number={2} title="Retained Color Coding on the Answer Form After Confirming It Worked" rationale="When a design decision solves the specific problem it was intended to solve, the right call is to protect it, not iterate on it.">
          <p>Participants in testing successfully differentiated the two primary response sections in the redesigned Answer Form, a result that didn't happen with the original. The color coding was validated as effective and carried forward unchanged into the high-fidelity design.</p>
        </DecisionCard>
        <DecisionCard number={3} title="Revised the Jury Rights Section After Persistent Confusion" rationale="A recurring failure across multiple test rounds means the design assumption is wrong, not the user. Explicit labeling outperforms clever visual cues when the stakes of misunderstanding are high.">
          <p>The jury demand paragraph at the bottom of the Answer Form continued to confuse participants even in the redesigned version, particularly the QR code placement. The final design bolded the word "jury" for fast visual identification and added a visual representation alongside the QR code to help defendants who weren't sure what it was for.</p>
        </DecisionCard>
        <DecisionCard number={4} title="Added More Space for the 'Other' Response Option" rationale="Form design failures aren't always visual, sometimes they're physical. A form people can't fill out is a form that won't be returned.">
          <p>Several participants noted that the blank field for the "other" checkbox was too small, raising concerns about defendants needing to write on the back of the form or in the margins. The final design expanded this field to prevent that scenario.</p>
        </DecisionCard>
        <DecisionCard number={5} title="Merged Sections B and C in the Answer Form" rationale="Reducing options reduces errors. Two clear paths are more navigable than three similar ones.">
          <p>The original form had three response scenarios (A, B, and C). Testing confirmed that the separation of B and C added confusion without clarity benefit. The final design combined them into a single section, reducing the form from three scenarios to two, making the decision structure simpler for defendants under stress.</p>
        </DecisionCard>
      </section>

      <section>
        <SectionLabel>Delivery</SectionLabel>
        <h2>What we handed to the Michigan Justice For All Commission</h2>
        <p>At the January handoff meeting, the team delivered a complete package to the MSCJFA Debt Collection Workgroup: high-fidelity redesigns of both forms, a final report documenting the full process and findings, and a presentation summarizing the project for the client's stakeholders.</p>
        <p>The high-fidelity designs were built to be immediately usable as a production reference, not just a prototype. Design decisions were documented with the reasoning behind them so the MSCJFA team could evaluate, adapt, or extend the work without losing the context that made those decisions.</p>
        <ImageSlot label="Figma Export">Final client presentation deck: project summary and form walkthroughs</ImageSlot>
      </section>

      <section>
        <SectionLabel>My Contributions</SectionLabel>
        <h2>What I owned across each phase</h2>
        <ContribGrid items={CONTRIBUTIONS} />
      </section>

      <section>
        <SectionLabel>Reflection</SectionLabel>
        <h2>What I'd do differently as the PM</h2>
        <p>The most valuable lesson from this project was about scope alignment: confirming what the client actually wants, early and directly, rather than assuming that a comprehensive deliverable list is always better. The mid-project call that clarified the client's primary interest in the form designs would have been more valuable in week two than week eight. A structured kickoff deliverable-alignment exercise, walking the client through what we planned to produce and asking them to rank-order priorities, would have let us invest the right resources in the right work from the start.</p>
        <p>Three things I'd change with a second run. First, I would have front-loaded more direct client access for the research and design teams. I served as the communication bottleneck by design, which kept things organized, but it meant the designers never heard the client's voice directly. Having them join one client call early would have calibrated their design instincts better than a second-hand brief. Second, I would have set explicit success criteria before usability testing began, task completion rate, comprehension score thresholds, so the team had a clear pass/fail standard rather than qualitative judgment calls. Third, I would have planned a second round of usability testing on the high-fidelity designs before the final handoff. We validated the mid-fi designs and iterated, but shipped the hi-fi designs on assumption that the changes worked. That's a gap.</p>
        <h3>If the Project Continued</h3>
        <p>The natural next step would be a second usability testing round on the final hi-fi forms, ideally with participants recruited through the MSCJFA's Lansing partner to better approximate the actual defendant population. Beyond testing, a digital accessibility audit of the forms would be essential before any production implementation, the MSCJFA indicated interest in both paper and digital versions, and the two contexts have meaningfully different design requirements. A digital form needs to consider screen readers, mobile rendering, and form submission flows that a paper redesign doesn't.</p>
      </section>

      <CaseStudyFooter>Anthony Shephard · University of Michigan · 2025</CaseStudyFooter>
    </div>
  )
}
