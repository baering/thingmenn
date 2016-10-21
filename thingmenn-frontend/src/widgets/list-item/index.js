import React from 'react'
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
  url: React.PropTypes.string,
  children: React.PropTypes.node,
}

export default ListItem
