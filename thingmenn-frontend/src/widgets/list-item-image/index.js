import React from 'react'
import classNames from 'classnames'

import './styles.css'

const ListItemImage = ({
  path,
  children,
  cover,
}) => {
  return (
    <div
      className="ListItemImage">
      <div
        className={classNames('ListItemImage-image', {
          'ListItemImage-image--cover': cover
        })}
        style={{
          backgroundImage: `url(${path})`
        }}
      >
        {children}
      </div>
    </div>
  )
}

ListItemImage.propTypes = {
  path: React.PropTypes.string,
  children: React.PropTypes.node,
  cover: React.PropTypes.bool,
}

export default ListItemImage
