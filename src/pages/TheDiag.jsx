import Navbar from '../components/Navbar'
import imgEventsFeed from '../assets/diag-events-feed.png'
import imgMap from '../assets/diag-map.png'
import imgCalendar from '../assets/diag-calendar.png'
import imgProfile from '../assets/diag-profile-anthony.png'
import imgEventDetail from '../assets/diag-event-detail.png'
import imgOrgPage from '../assets/diag-org-page.png'
import imgAwards from '../assets/diag-awards.png'
import imgCreateEventNew from '../assets/diag-create-event-2.png'
import CaseStudyHero from '../components/CaseStudyHero'
import SectionLabel from '../components/SectionLabel'
import Callout from '../components/Callout'
import DecisionCard from '../components/DecisionCard'
import ContribGrid from '../components/ContribGrid'
import ImageSlot from '../components/ImageSlot'
import VideoSection from '../components/VideoSection'
import PhoneCarousel from '../components/PhoneCarousel'
import CaseStudyFooter from '../components/CaseStudyFooter'

const SCREENS = [
  { src: imgCalendar,       label: 'Calendar' },
  { src: imgCreateEventNew, label: 'Create Event' },
  { src: imgEventsFeed,     label: 'Events Feed' },
  { src: imgEventDetail,    label: 'Event Detail' },
  { src: imgMap,            label: 'Map View' },
  { src: imgProfile,        label: 'Profile' },
  { src: imgOrgPage,        label: 'Org Page' },
]

const THEME = {
  '--color-accent': '#00274C',
  '--color-accent-soft': '#FFF3CC',
  '--color-accent-night': '#6BA3C8',
}

const META = [
  { label: 'Role', value: 'Product Strategy, UX Design, Usability Testing' },
  { label: 'Feature Ownership', value: 'Create Event (end-to-end)' },
  { label: 'Team', value: '5 designers (SI 407)' },
  { label: 'Timeline', value: 'Fall 2025, 10 weeks' },
  { label: 'Tools', value: 'Figma, iOS HIG, Prototyping' },
]

const CONTRIBUTIONS = [
  { phase: 'Understand', work: 'Led competitive review of Maize Pages (web + mobile), annotating friction points and information architecture failures' },
  { phase: 'Define', work: 'Contributed to synthesis of research insights and design criteria. Defined business goals in the Product Vision Board' },
  { phase: 'Sketch', work: 'Sketched the Create Event page through Crazy 8s exercise' },
  { phase: 'Design', work: 'Designed all screens in the Create Event feature (org selection, form, preview, friend invite, photo upload)' },
  { phase: 'Test', work: 'Conducted a usability test session and placed findings into the affinity diagram' },
  { phase: 'Iterate', work: 'Revised the entire Create Event flow based on the 0/5 testing result, replacing NLP with a conventional stepped form' },
  { phase: 'Document', work: 'Drafted product epics (Organizer Event Management, Attendee Event Selection) and contributed to user stories' },
]

export default function TheDiag({ onHome }) {
  return (
    <div className="case-study-page" style={THEME}>
      <Navbar onHome={onHome} label="SI 407 · iOS App Design" />

      <CaseStudyHero
        title="The Diag"
        subtitle="A native iOS app that centralizes campus event discovery at the University of Michigan, turning a fragmented ecosystem of group chats, email lists, and cluttered portals into a single, intuitive experience."
        meta={META}
      />

      <div className="case-study-with-rail">
        <div className="rail-body">

      <section>
        <SectionLabel>The Problem</SectionLabel>
        <h2>A campus of 48,000 students with no central place to find what's happening</h2>
        <p>The University of Michigan has over 1,600 student organizations running thousands of events every semester. But students had no reliable way to discover them. Event information was scattered across Maize Pages (the university's org portal), GroupMe chats, email chains, Instagram stories, and word of mouth.</p>
        <p>The result: low attendance at events that students would actually want to attend, organizations struggling to build visibility, and first-year and transfer students feeling disconnected from campus life.</p>
        <p>We framed this as a two-sided marketplace problem. On the demand side, students needed better discovery. On the supply side, org leaders needed a frictionless way to promote events. Any solution had to serve both.</p>
      </section>

      <section>
        <SectionLabel>Discovery</SectionLabel>
        <h2>Understanding why existing tools failed</h2>
        <p>I led the competitive analysis of Maize Pages, auditing both web and mobile experiences. The core finding across all existing tools was consistent: they were information-dense but insight-poor. Students were presented with walls of text listings with no visual hierarchy, no sense of proximity, and no social context for which events were worth attending.</p>
        <ImageSlot label="Figma Export">Competitive Analysis: Maize Pages annotations (web + mobile)</ImageSlot>
        <p>Three specific failure patterns emerged from our research. Existing platforms overwhelmed users with too many undifferentiated listings. They treated all events equally, with no personalization, no "suggested" layer, and no friend activity. And critically, they made it hard for org leaders to post events, suppressing the supply side of the marketplace.</p>
      </section>

      <section>
        <SectionLabel>Strategy</SectionLabel>
        <h2>Defining what success looks like</h2>
        <p>I defined the business goals in our Product Vision Board, anchoring the team around two measurable outcomes: grow online visibility for campus organizations, and increase org applications by 20%. These weren't vanity metrics. They reflected the core thesis that if students could actually find events worth attending, they would engage more deeply with campus life.</p>
        <ImageSlot label="Figma Export">Product Vision Board (Target Group, Needs, Product, Business Goals, Competitors, Revenue, Costs, Channels)</ImageSlot>
        <p>From insights and competitive research, the team established three design criteria that would guide every decision: limit information overload through filtering and categorization, prioritize visual presentation over text-heavy lists, and incorporate a live interactive map for location-based discovery.</p>
      </section>

      <section>
        <SectionLabel>The Product</SectionLabel>
        <h2>Four pillars of a campus event platform</h2>
        <p>The Diag is structured around four core experiences, each addressing a specific user need identified in research.</p>
        <h3>Discover Events</h3>
        <p>A personalized feed with two tiers: events suggested based on interests and org membership, and events from organizations the student already follows. Visual cards with images, org names, dates, and proximity distance replace the text-heavy listings of Maize Pages.</p>
        <h3>Map-Based Navigation</h3>
        <p>An interactive campus map with event pins, enabling location-driven decision-making. Tapping an address opens a navigation modal (Apple Maps, Google Maps, or Waze). This was a direct response to our finding that students consider physical proximity a primary factor in attendance decisions.</p>
        <h3>Calendar & Tracking</h3>
        <p>A personal calendar view showing events the student is attending, events from their organizations, and suggested events, organized by week with day-level granularity.</p>
        <h3>Gamified Engagement</h3>
        <p>An achievement system that rewards attendance milestones (5, 10, 15, 25 events) and org-specific participation. This serves a retention purpose: giving students visible progress toward community involvement, and giving organizations a reason to keep posting events.</p>
        <div className="rail-carousel--inline">
          <PhoneCarousel screens={SCREENS} />
        </div>
      </section>

      <section>
        <SectionLabel>Feature Deep Dive</SectionLabel>
        <h2>Create Event: owning a feature from sketch to ship</h2>
        <p>Of the product's features, I owned Create Event end-to-end: sketching, wireframing, building the hi-fi screens, testing it, and iterating post-test. This was the supply-side feature. Without a usable event creation flow, the platform has no content. It's the feature that makes or breaks the marketplace.</p>
        <h3>Initial Design</h3>
        <p>My first iteration followed what seemed like an efficient pattern: after selecting an organization, the form used a natural language processing (NLP) input field that would auto-parse event details from a pasted description. The idea was to reduce manual entry for org leaders who already had event copy written for email blasts or social posts.</p>
        <ImageSlot label="Figma Export">Anthony's wireframes: paper sketches + digital wireframes of the Create Event flow</ImageSlot>
        <Callout label="The Test Result" stat="0 / 5">
          <p>Zero out of five users completed the event creation flow smoothly. Every participant got stuck. The NLP field confused them. They didn't know how to proceed after selecting an organization. The create button didn't look tappable. This was the single highest-friction flow in the entire application.</p>
        </Callout>
        <h3>Diagnosing the Failure</h3>
        <p>I placed my usability test findings into the team's affinity diagram, and the pattern was clear. Users expected a standard mobile form: upload an image, type a name, pick a location, set a time, add details. The NLP approach, despite being technically more efficient, violated the mental model that every participant brought to event creation. They didn't want "smart." They wanted predictable.</p>
        <p>This was a critical product lesson: engineering elegance that doesn't match user expectations is just friction by another name.</p>
        <h3>The Revision</h3>
        <p>I rebuilt the flow around a conventional stepped form. Select your organization first, then fill in event details through clearly labeled fields: name, location, date/time picker, categories, perks, description, and image upload. A preview screen lets the creator verify before publishing, and a friend-invite step encourages social distribution at the point of creation.</p>
        <ImageSlot label="Revised Create Event Flow" src={imgCreateEventNew} alt="Revised Create Event: form fields step" phone />
        <p>The key decisions in the revision were removing the NLP field entirely, making the create button visually prominent with a "+" icon, and breaking the flow into discrete, predictable steps. Each step maps to one clear action, reducing cognitive load.</p>
      </section>

      <section>
        <SectionLabel>Testing & Iteration</SectionLabel>
        <h2>What the other usability findings revealed</h2>
        <p>Beyond Create Event, testing exposed friction across several interaction patterns. The findings drove five key design decisions, each tied to specific observed behavior.</p>
        <DecisionCard number={1} title="Redesigned Event Cards" rationale="Ambiguous icons create hesitation. Explicit labels reduce cognitive load and speed up scanning.">
          <p>Users were confused by the checkmark/plus toggle on event cards. Some read it as "RSVP," others as "bookmark." We replaced it with an explicit "Attending" badge and simplified the card metadata to image, name, org, date, and distance.</p>
        </DecisionCard>
        <DecisionCard number={2} title="Rebuilt Create Event Flow" rationale="0/5 success rate. Users expect forms that match their mental model of mobile data entry.">
          <p>Removed the NLP field, added a prominent "+" icon, and restructured into a step-by-step form matching familiar mobile patterns.</p>
        </DecisionCard>
        <DecisionCard number={3} title="Clarified Organization Tags" rationale="Reducing visual affordance on non-interactive elements prevents false expectations.">
          <p>Users mistook the hosting-org pill label for a tappable button. We restyled it as a smaller, non-interactive label that visually reads as metadata rather than a call to action.</p>
        </DecisionCard>
        <DecisionCard number={4} title="Added Address Interaction" rationale="Location is a core user need. Addresses should behave like links.">
          <p>Users tried tapping the event address expecting navigation. Nothing happened. We added a modal that opens Apple Maps, Google Maps, or Waze on tap.</p>
        </DecisionCard>
        <DecisionCard number={5} title="Improved Profile Information Hierarchy" rationale="Content priority should reflect user priority. Group and reorder to reduce unnecessary searching.">
          <p>Users scrolled past their organization memberships and missed key information. We reordered profile sections and added segmented controls to surface upcoming events, attended events, orgs, and awards.</p>
        </DecisionCard>
      </section>

        </div>{/* end rail-body */}
        <aside className="rail-carousel">
          <PhoneCarousel screens={SCREENS} />
        </aside>
      </div>{/* end case-study-with-rail */}

      <section className="wide">
        <div style={{ margin: '48px 0' }}>
          <SectionLabel>Try It</SectionLabel>
          <h2 style={{ marginBottom: '8px' }}>Interactive Prototype</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Click through the final prototype below. Start on the Events feed and explore the full app.</p>
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
      </section>

      <section className="wide">
        <VideoSection
          title="Video Walkthrough"
          description="A guided tour of key flows and interactions."
          mp4="407demovid.mp4"
          mov="407demovid.mov"
        />
      </section>

      <section>
        <SectionLabel>Implementation Readiness</SectionLabel>
        <h2>Engineering handoff</h2>
        <p>I drafted the product epics and contributed to user stories, framing the work in terms an engineering team could pick up directly.</p>
        <p>The two epics I defined were <strong>Organizer Event Management</strong> (event creation, editing, user management under an org, admin controls) and <strong>Attendee Event Selection</strong> (event browsing across feed, calendar, and map views, plus RSVP). Both included authentication constraints: only validated @umich accounts can create events or RSVP.</p>
        <ImageSlot label="Figma Export">User Stories and Epics</ImageSlot>
        <p>The team also delivered a complete design system with color tokens, typography scale, spacing system (4/8/16 grid), icon guidelines, and a reusable component library (event cards, buttons, form fields, navigation, profile tiles, and the badge system). All final screens included redline annotations for spacing, padding, and interaction behavior.</p>
      </section>

      <section>
        <SectionLabel>My Contributions</SectionLabel>
        <h2>What I owned across each phase</h2>
        <ContribGrid items={CONTRIBUTIONS} />
      </section>

      <section>
        <SectionLabel>Reflection</SectionLabel>
        <h2>What I'd do differently as the PM</h2>
        <p>The biggest lesson: clever solutions that don't match user mental models are just friction by another name. In a product context, I would have pushed for progressive disclosure from the start — ship the conventional form first, then layer in smart features like paste-to-parse as a power-user shortcut once the base flow was validated.</p>
        <p>If I were leading this as a product manager, three things would change. First, I would have run a lightweight supply-side discovery sprint before designing: interviewing org leaders about their current event promotion workflow to understand what "easy" means to them, rather than assuming. Second, I would have defined quantitative success metrics upfront (task completion rate targets, time-to-publish benchmarks) so the testing results would have clear pass/fail thresholds. Third, I would have prioritized a second round of usability testing on the revised Create Event flow to validate that the fix actually worked, rather than shipping the iteration on assumption.</p>
        <h3>Next Release Priorities</h3>
        <p>Validate the revised Create Event flow with another test round. Add calendar integration for easier event management. Expand social features (friend attendance visibility, event sharing). Build a notification system for reminders. Launch org admin tools for event approval, editing, and analytics.</p>
      </section>

      <CaseStudyFooter>Anthony Shephard · University of Michigan · 2025</CaseStudyFooter>
    </div>
  )
}
