import React from 'react'
import './styles.css'

const DetailsHeader = ({
  id,
  mpName,
  description,
  lthings,
  imagePath,
}) => {
  const { asMp, asPerson } = description

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
            {mpName} <p className="Main-subheader"></p>
          </h1>
          <p className="DetailsHeader-bioText">{asMp}</p>
        </div>
      </div>
    </div>
  )
}

DetailsHeader.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  profilePicture: React.PropTypes.string,
}

export default DetailsHeader
