import React from 'react'
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
  title: React.PropTypes.string,
  description: React.PropTypes.string,
}

export default ListItemContent
