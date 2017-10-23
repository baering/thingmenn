import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const ListItemContent = ({
  title,
  description,
}) => {
  return (
    <div className="ListItemContent">
      <h2 className="ListItemContent-title">{title}</h2>
      {description ?
        <p className="ListItemContent-description">{description}</p>
        : null}
    </div>
  )
}

ListItemContent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

export default ListItemContent
