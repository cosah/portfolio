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
