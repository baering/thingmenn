import React from 'react'
import './styles.css'

import PartyBadge from '../partybadge'

const Mp = ({
  id,
  name,
  imagePath,
  party,
  partySlug
}) => {
  return (
    <a href={`/thingmenn/${id}`} className="Mp">
      <div
        className="Mp-image"
        style={{
          backgroundImage: `url(${imagePath})`
        }}
      >
        <PartyBadge party={partySlug}/>
      </div>
      <div className="Mp-content">
        <h2 className="Mp-name">{name}</h2>
        <p className="Mp-party">{party}</p>
      </div>
    </a>
  )
}

Mp.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  profilePicture: React.PropTypes.string,
  party: React.PropTypes.string,
}

export default Mp
