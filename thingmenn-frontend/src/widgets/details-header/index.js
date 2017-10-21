import React from 'react'
import './styles.css'

const DetailsHeader = ({
  id,
  name,
  description,
  party,
  about,
  imagePath,
  speechSummary,
  subjectSummary,
  voteSummary,
}) => {
  return (
    <div className="DetailsHeader">
      <div className="DetailsHeader-details">
        <div
          className="DetailsHeader-image"
          style={{
            backgroundImage: `url(${imagePath})`,
          }}
        />
        <div className="DetailsHeader-bio">
          <h1 className="DetailsHeader-bioName">
            {name} <p className="Main-subheader">{party}</p>
          </h1>
          <p className="DetailsHeader-bioText">{description || about}</p>
        </div>
      </div>
    </div>
  )
}

DetailsHeader.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  profilePicture: React.PropTypes.string,
  party: React.PropTypes.string,
}

export default DetailsHeader
