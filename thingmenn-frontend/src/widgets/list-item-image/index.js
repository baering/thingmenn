import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './styles.css'

const ListItemImage = ({ path, children, cover }) => {
  return (
    <div className="ListItemImage">
      <div
        className={classNames('ListItemImage-image', {
          'ListItemImage-image--cover': cover,
        })}
        style={{
          backgroundImage: `url(${path})`,
        }}
      ></div>
      {children}
    </div>
  )
}

ListItemImage.propTypes = {
  path: PropTypes.string,
  children: PropTypes.node,
  cover: PropTypes.bool,
}

export default ListItemImage
