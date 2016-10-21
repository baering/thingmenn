import React from 'react'
import './styles.css'

const ListItemContent = ({
  title,
  description,
}) => {
  return (
    <div className="ListItemContent">
      <h2 className="ListItemContent-name">{title}</h2>
      {description ?
        <p className="ListItemContent-party">{description}</p>
        : null}
    </div>
  )
}

ListItemContent.propTypes = {
  title: React.PropTypes.string,
  description: React.PropTypes.string,
}

export default ListItemContent
