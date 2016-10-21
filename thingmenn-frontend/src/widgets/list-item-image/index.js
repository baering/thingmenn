import React from 'react'

import './styles.css'

const ListItemImage = ({
  path,
  children,
}) => {
  return (
    <div
      className="ListItemImage"
      style={{
        backgroundImage: `url(${path})`
      }}
    >
      {children}
    </div>
  )
}

ListItemImage.propTypes = {
  path: React.PropTypes.string,
  children: React.PropTypes.node,
}

export default ListItemImage
