import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import './styles.css'

const ListItem = ({
  url,
  children,
}) => {
  return (
    <Link to={url} className="ListItem">
      {children}
    </Link>
  )
}

ListItem.propTypes = {
  url: PropTypes.string,
  children: PropTypes.node,
}

export default ListItem
