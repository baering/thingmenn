import React from 'react'
import './styles.css'

const Mp = ({
  id,
  name,
  imagePath,
  party,
}) => {
  return (
    <a href={`/thingmenn/${id}`} className="mp">
      <div className="mp-card">
        <div
          className="mp-image"
          style={{
            backgroundImage: `url(${imagePath})`
          }}
        />
        <div className="mp-content">
          <h2 className="heading">{name}</h2>
          <p className="text">{party}</p>
        </div>
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
