import React from 'react'
import PropTypes from 'prop-types'

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
  party: PropTypes.string,
  className: PropTypes.string,
}

export default PartyBadge
