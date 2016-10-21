import React from 'react'
import './styles.css'

const PartyBadge = ({party}) => {
  return (
    <div className='PartyBadge' data-party={party}
      style={{
        backgroundImage: `url(/images/parties/${party}.svg)`
      }}
    >
    </div>
  )
}

PartyBadge.propTypes = {
  party: React.PropTypes.string
}

export default PartyBadge
