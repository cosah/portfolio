import Navbar from '../components/Navbar'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import ImageSlot from '../components/ImageSlot'
import StatRow from '../components/StatRow'
import VideoSection from '../components/VideoSection'
import GridFrames from '../components/GridFrames'
import BeforeAfterPair from '../components/BeforeAfterPair'
import PullQuote from '../components/PullQuote'
import TableOfContents from '../components/TableOfContents'
import CaseStudyFooter from '../components/CaseStudyFooter'

import imgHero from '../assets/diag-hero.png'
import imgEventsFeed from '../assets/diag-events-feed.png'
import imgMap from '../assets/diag-map.png'
import imgCalendar from '../assets/diag-calendar.png'
import imgProfile from '../assets/diag-profile-final.png'
import imgCreateEventNew from '../assets/diag-create-event-2.png'
import imgNlpDefault from '../assets/diag-nlp-default.png'
import imgNlpFilled from '../assets/diag-nlp-filled.png'
import imgVisionBoard from '../assets/diag-vision-board.png'

const META = [
  { label: 'Project', value: 'The Diag' },
  { label: 'Course', value: 'SI 407' },
  { label: 'Role', value: 'UX, Strategy' },
  { label: 'Owned', value: 'Create Event' },
  { label: 'Team', value: '5 designers' },
  { label: 'Duration', value: '10 weeks' },
  { label: 'Year', value: 'Fall 2025' },
]

const PILLARS = [
  { ix: '3.1', name: 'Discover', src: imgEventsFeed, alt: 'Discovery feed', desc: 'Personalized feed: suggested events plus events from followed orgs.' },
  { ix: '3.2', name: 'Map', src: imgMap, alt: 'Map view', desc: 'Pinned events with proximity-driven discovery and navigation handoff.' },
  { ix: '3.3', name: 'Calendar', src: imgCalendar, alt: 'Calendar view', desc: 'Week view with day-level granularity for personal scheduling.' },
  { ix: '3.4', name: 'Profile', src: imgProfile, alt: 'Profile view: friends, orgs, awards, and upcoming/attended events', desc: 'Engagement hub: friends, followed orgs, earned awards, and a feed of upcoming and attended events.' },
]

const DETAIL_STATS = [
  { label: 'Completion rate', value: '0 / 5', delta: 'all participants stuck', tone: 'warn' },
  { label: 'Avg. time on task', value: '2:48', delta: 'none reached completion', tone: 'warn' },
  { label: 'Help requests', value: '11', delta: '2.2 per participant', tone: 'warn' },
  { label: 'Critical drop-off', value: 'NLP field', delta: 'step 1 of 5', tone: 'warn' },
]

const SECTIONS = [
  { num: 1, label: 'The problem', id: 'sec-1' },
  { num: 2, label: 'Existing tools', id: 'sec-2' },
  { num: 3, label: 'Strategy', id: 'sec-3' },
  { num: 4, label: 'Final composition', id: 'sec-4' },
  { num: 5, label: 'Feature ownership', id: 'sec-5' },
  { num: 6, label: 'Test result', id: 'sec-6' },
  { num: 7, label: 'Diagnosis', id: 'sec-7' },
  { num: 8, label: 'The rebuild', id: 'sec-8' },
  { num: 9, label: 'Other findings', id: 'sec-9' },
  { num: 10, label: 'Implementation', id: 'sec-10' },
  { num: 11, label: 'Try it', id: 'sec-11' },
  { num: 12, label: 'Walkthrough', id: 'sec-12' },
  { num: 13, label: 'Contributions', id: 'sec-13' },
  { num: 14, label: 'Reflection', id: 'sec-14' },
]

const CONTRIBUTIONS = [
  { phase: 'Understand', work: 'Led competitive review of Maize Pages (web and mobile), annotating friction points and information-architecture failures.' },
  { phase: 'Define', work: 'Contributed to synthesis of research insights and design criteria. Defined business goals in the Product Vision Board.' },
  { phase: 'Sketch', work: 'Sketched the Create Event page through Crazy 8s exercise.' },
  { phase: 'Design', work: 'Designed all screens in the Create Event feature: org selection, form, preview, friend invite, photo upload.' },
  { phase: 'Test', work: 'Conducted a usability test session and placed findings into the affinity diagram.' },
  { phase: 'Iterate', work: 'Revised the entire Create Event flow based on the 0/5 testing result, replacing NLP with a conventional stepped form.' },
  { phase: 'Document', work: 'Drafted product epics (Organizer Event Management, Attendee Event Selection) and contributed to user stories.' },
]

export default function TheDiag({ onHome }) {
  return (
    <div className="case-study-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="the-diag" />

      <CaseStudyHero
        kicker="Case Study · Native iOS · Fall 2025"
        title="The first design failed every user."
        titleEmphasis="The rebuild ran the marketplace."
        subtitle="A native iOS app for campus event discovery at the University of Michigan. I owned the Create Event flow end to end. After our first usability test, no participant could finish it. This is the diagnosis and the rebuild."
        meta={META}
        corners={{ tl: '+ 00.00', tr: 'iOS · iPhone 13 Pro', bl: 'THE DIAG · iOS', br: 'FALL 2025 · SI 407' }}
        heroImage={imgHero}
        heroImageAlt="The Diag final composition: three iPhone 13 Pro screens showing Discover Events, Maize Pages org profile, and the Map view"
        heroImageContain
      />

      <div className="case-study-layout">
        <aside className="toc-rail">
          <TableOfContents sections={SECTIONS} />
        </aside>

        <main id="main-content">

        <div className="section" id="sec-1">
          <SectionLabel num={1}>The problem</SectionLabel>
          <h2>1,600 organizations. Thousands of events. No central place to find them.</h2>
          <div className="body-text">
            <p>The University of Michigan has more than 1,600 student organizations running thousands of events every semester. Event information was scattered across Maize Pages (the official org portal), GroupMe chats, email chains, Instagram stories, and word of mouth. Students had no reliable way to discover them.</p>
            <p>The result: low attendance at events students would have wanted to attend. Organizations struggling to be seen. The product had to solve <strong>both sides of the marketplace</strong>, demand and supply, in one experience.</p>
          </div>
        </div>

        <div className="section" id="sec-2">
          <SectionLabel num={2}>Existing tools, audited</SectionLabel>
          <h2>Information-dense, insight-poor. The same failure pattern across every platform.</h2>
          <div className="body-text">
            <p>We ran a competitive analysis across three existing platforms students used to find campus events — Maize Pages, GroupMe, and Instagram — and the same three failure patterns repeated across every one. Listings were undifferentiated and overwhelming. There was no personalization or social layer to help students prioritize. And the org-leader posting flow was so heavy that supply itself was suppressed.</p>
            <p>From the audit, three design criteria emerged: limit information overload, prioritize visual presentation, and surface a live interactive map for proximity.</p>
          </div>
        </div>

        <div className="section" id="sec-3">
          <SectionLabel num={3}>Strategy</SectionLabel>
          <h2>Defining what success looks like before designing it.</h2>
          <div className="body-text">
            <p>I defined the business goals in our Product Vision Board, anchoring the team around two measurable outcomes: grow online visibility for campus organizations, and increase org applications by 20%. These were not vanity metrics. They reflected the core thesis that if students could find events worth attending, they would engage more deeply with campus life.</p>
          </div>
          <ImageSlot
            id="3.1"
            src={imgVisionBoard}
            alt="Product Vision Board with target group, needs, product, business goals, competitors, revenue streams, costs, and channels filled in"
            caption="Product Vision Board: target group, needs, product, business goals, competitors, revenue, costs, channels."
            aspect="16x9"
            contain
          />
        </div>

        <div className="section" id="sec-4">
          <SectionLabel num={4}>Final composition</SectionLabel>
          <h2>Four pillars: discover, locate, track, and engage.</h2>
          <GridFrames items={PILLARS} cols={4} aspect="9x16" />
          <div className="body-text">
            <p>Each pillar maps to a specific behavior surfaced in research: discovery (a personalized feed), locate (a campus map with event pins and navigation handoff), track (a calendar synced to followed orgs), and engage (a profile that surfaces friends, followed orgs, earned awards, and a personal record of upcoming and attended events).</p>
          </div>
        </div>

        <div className="section" id="sec-5">
          <SectionLabel num={5}>Feature ownership</SectionLabel>
          <h2>The supply-side feature. Without it, the marketplace has no content.</h2>
          <div className="body-text">
            <p>I owned Create Event end to end: sketches, wireframes, hi-fi screens, the usability test, and the post-test rebuild. The first design used a natural-language input field that would auto-parse pasted event copy. The thinking was that org leaders already had this content written for emails and social posts, so why make them retype it.</p>
          </div>
          <ImageSlot
            id="5.1"
            srcs={[
              { src: imgNlpDefault, alt: 'V1 Create Event, default state: NLP input field at the top awaiting pasted event copy' },
              { src: imgNlpFilled, alt: 'V1 Create Event, expanded and filled state: NLP field with pasted text parsed into structured fields below' },
            ]}
            caption="V1 Create Event: NLP input in its default state (left) and expanded with pasted event copy parsed into structured fields (right)."
            aspect="9x16"
          />
        </div>

        <div className="section" id="sec-6">
          <SectionLabel num={6}>Test result</SectionLabel>
          <h2>The flow I owned <span className="warn">failed every participant.</span></h2>

          <Callout
            stat="0/5"
            label="Completion rate · n=5"
            title="Zero of five participants completed the Create Event flow."
          >
            <p>Every participant got stuck. The NLP field confused them. The create button did not read as tappable. They did not know how to advance after selecting an organization. This was the highest-friction flow in the entire app, and the one feature the rest of the marketplace depended on.</p>
          </Callout>

          <StatRow stats={DETAIL_STATS} />

          <PullQuote
            id="P3 · post-task interview"
            who="Year 2 student, never used Maize Pages"
            ref="REF Q.6.1"
          >
            "I expected to fill out a form. I didn't know what this box was supposed to do."
          </PullQuote>
        </div>

        <div className="section" id="sec-7">
          <SectionLabel num={7}>Diagnosis</SectionLabel>
          <h2>Predictable beat clever, every time, across every participant.</h2>
          <div className="body-text">
            <p>I placed the test findings into the team's affinity diagram and the pattern was unmistakable. Every participant arrived expecting a standard mobile form: upload an image, type a name, pick a location, set a time, add details. The NLP approach, despite being technically more efficient, violated that mental model.</p>
            <p><strong>Engineering elegance that doesn't match user expectations is just friction by another name.</strong> The shortcut wasn't a shortcut for users; it was a detour. The conventional answer was the right answer.</p>
          </div>
        </div>

        <div className="section" id="sec-8">
          <SectionLabel num={8}>The rebuild</SectionLabel>
          <h2>Predictable form. Discrete steps. <em>Conventional fields.</em></h2>
          <BeforeAfterPair
            aspect="9x16"
            before={{
              label: 'FIG. 8.1 · V1, Initial design',
              tag: '0/5 completed',
              src: imgNlpDefault,
              alt: 'V1 Create Event: NLP input field in default state, the design that produced a 0/5 completion rate in usability testing',
              annotations: [
                'NLP field violates standard form mental model.',
                'Create button low-contrast, did not read as tappable.',
                'Path forward unclear after org selection.',
              ],
            }}
            after={{
              label: 'FIG. 8.2 · V2, Revised design',
              tag: 'design for ship',
              src: imgCreateEventNew,
              alt: 'V2 stepped form, conventional fields',
              annotations: [
                'Discrete steps mapped to standard mobile data entry.',
                'Prominent + icon, system blue, clearly tappable.',
                'Preview screen and friend invite at completion.',
              ],
            }}
          />
          <div className="body-text">
            <p>The rebuild kept nothing from V1 except the org-selection step. The NLP field was removed entirely. The form was broken into discrete labeled steps mapping directly to mobile data-entry conventions. A preview screen lets the creator verify before publishing. A friend-invite step encourages distribution at the moment of creation, when the organizer's energy is highest and their social graph is freshest in mind.</p>
          </div>
        </div>

        <div className="section" id="sec-9">
          <SectionLabel num={9}>Other test findings</SectionLabel>
          <h2>Five design decisions, each tied to specific observed behavior.</h2>
          <DecisionCard number={1} title="Redesigned event cards" rationale="Ambiguous icons create hesitation. Explicit labels reduce cognitive load and speed scanning.">
            <p>Users were confused by the checkmark/plus toggle on event cards. Some read it as RSVP, others as bookmark. We replaced it with an explicit "Attending" badge and simplified card metadata to image, name, org, date, distance.</p>
          </DecisionCard>
          <DecisionCard number={2} title="Rebuilt Create Event flow" rationale="0/5 success rate. Users expect forms that match their mental model of mobile data entry.">
            <p>Removed the NLP field, added a prominent + icon, and restructured into a step-by-step form matching familiar mobile patterns.</p>
          </DecisionCard>
          <DecisionCard number={3} title="Clarified organization tags" rationale="Reducing visual affordance on non-interactive elements prevents false expectations.">
            <p>Users mistook the hosting-org pill label for a tappable button. We restyled it as a smaller, non-interactive label that visually reads as metadata rather than a call to action.</p>
          </DecisionCard>
          <DecisionCard number={4} title="Added address interaction" rationale="Location is a core user need. Addresses should behave like links.">
            <p>Users tried tapping the event address expecting navigation. Nothing happened. We added a modal that opens Apple Maps, Google Maps, or Waze on tap.</p>
          </DecisionCard>
          <DecisionCard number={5} title="Improved profile information hierarchy" rationale="Content priority should reflect user priority. Group and reorder to reduce unnecessary searching.">
            <p>Users scrolled past their organization memberships and missed key information. We reordered profile sections and added segmented controls to surface upcoming events, attended events, orgs, and awards.</p>
          </DecisionCard>
        </div>

        <div className="section" id="sec-10">
          <SectionLabel num={10}>Implementation readiness</SectionLabel>
          <h2>Engineering handoff.</h2>
          <div className="body-text">
            <p>I drafted the product epics and contributed to user stories, framing the work in terms an engineering team could pick up directly. The two epics were <strong>Organizer Event Management</strong> (event creation, editing, user management under an org, admin controls) and <strong>Attendee Event Selection</strong> (event browsing across feed, calendar, and map views, plus RSVP). Both included authentication constraints: only validated @umich accounts can create events or RSVP.</p>
            <p>The team also delivered a complete design system: color tokens, typography scale, spacing system (4/8/16 grid), icon guidelines, and a reusable component library (event cards, buttons, form fields, navigation, profile tiles, badges). All final screens included redline annotations for spacing, padding, and interaction behavior.</p>
          </div>
        </div>

        <div className="section" id="sec-11">
          <SectionLabel num={11}>Try it</SectionLabel>
          <h2>Interactive prototype.</h2>
          <div className="body-text" style={{ marginBottom: '24px' }}>
            <p>Click through the final prototype below. Start on the Events feed and explore the full app.</p>
          </div>
          <div className="prototype-embed-wrapper">
            <iframe
              width="400"
              height="860"
              src="https://embed.figma.com/proto/GPrbf3nseOkGdO0t5HjXn4/SI-407-Group-Project?node-id=419-11643&starting-point-node-id=419-11643&scaling=scale-down&content-scaling=fixed&page-id=377-4356&embed-host=share"
              allowFullScreen
              title="The Diag prototype"
            />
          </div>
        </div>

        <div className="section" id="sec-12">
          <SectionLabel num={12}>Walkthrough</SectionLabel>
          <h2>Video tour of the final app.</h2>
          <VideoSection
            description="A guided tour of key flows and interactions across discovery, map, calendar, and create."
            mp4="407demovid.mp4"
            mov="407demovid.mov"
          />
        </div>

        <div className="section" id="sec-13">
          <SectionLabel num={13}>My contributions</SectionLabel>
          <h2>What I owned across each phase.</h2>
          <ContribGrid items={CONTRIBUTIONS} />
        </div>

        <div className="section" id="sec-14">
          <SectionLabel num={14}>Reflection</SectionLabel>
          <h2>Test against the mental model first, not the engineering shortcut.</h2>
          <div className="body-text">
            <p>The lesson: engineering elegance that doesn't match user expectation is just friction by another name. If I were running this project again, I'd prototype the standard form alongside the NLP field and run a comparative test before committing to either. The cost would have been a few hours. The savings would have been an entire usability cycle.</p>
            <p>This is the kind of decision a PM gets paid to make: not which design is more clever, but which design users will actually be able to use without help.</p>
          </div>
        </div>

        </main>
      </div>

      <CaseStudyFooter slug="the-diag · si-407" />
    </div>
  )
}
