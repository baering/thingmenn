import React from 'react'
import './styles.css'

const PartyBadge = ({party}) => {
  return (
    <div className='PartyBadge'
      style={{
        backgroundImage: `url(/img/${party}.svg)`
      }}
    >
    </div>
  )
}

PartyBadge.propTypes = {
  party: React.PropTypes.string
}

export default PartyBadge
