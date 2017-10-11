import React from 'react'
import { Link } from 'react-router'
import PropTypes from "prop-types";

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
