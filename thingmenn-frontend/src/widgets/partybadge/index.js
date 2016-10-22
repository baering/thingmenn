import React from 'react'
import './styles.css'

const PartyBadge = ({party, className}) => {
  return (
    <div className={`PartyBadge ${className}`} data-party={party}
      style={{
        backgroundImage: `url(/images/parties/${party}.svg)`
      }}
    >
    </div>
  )
}

PartyBadge.propTypes = {
  party: React.PropTypes.string,
  className: React.PropTypes.string,
}

export default PartyBadge
