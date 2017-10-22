import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const DetailsHeader = ({
  id,
  mpName,
  description,
  imagePath,
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
            {mpName} <p className="Main-subheader"></p>
          </h1>
          <p className="DetailsHeader-bioText">{description}</p>
        </div>
      </div>
    </div>
  )
}

DetailsHeader.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mpName: PropTypes.string,
  imagePath: PropTypes.string,
  description: PropTypes.any,
}

export default DetailsHeader
