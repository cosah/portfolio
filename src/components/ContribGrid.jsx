// ContribGrid lists phase-by-phase contributions in a two-column grid.
// Used in case study credits to show who did what across a multi-phase
// project (e.g. "Research: A, B / Design: B, C / Build: A, C").

export default function ContribGrid({ items }) {
  return (
    <div className="contrib-grid">
      {items.map(({ phase, work }, i) => (
        <div key={i} className="contrib-item">
          <div className="contrib-phase">{phase}</div>
          <div className="contrib-work">{work}</div>
        </div>
      ))}
    </div>
  )
}
