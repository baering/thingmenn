import React from 'react'
import './styles.css'

const Mp = ({
  id,
  name,
  imagePath,
  party,
}) => {
  return (
    <a href={`/mps/${id}`} className="Mp">
      <div className="Mp-card">
        <div
          className="Mp-image"
          style={{
            backgroundImage: `url(${imagePath})`
          }}
        />
        <div className="Mp-content">
          <h2 className="Heading">{name}</h2>
          <p className="Text">{party}</p>
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
