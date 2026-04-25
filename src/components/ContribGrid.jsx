import { Fragment } from 'react'

export default function ContribGrid({ items }) {
  return (
    <div className="contrib-grid">
      {items.map(({ phase, work }, i) => (
        <Fragment key={i}>
          <div className="phase">{phase}</div>
          <div className="work">{work}</div>
        </Fragment>
      ))}
    </div>
  )
}
