import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const List = ({
  children,
}) => {
  return (
    <div className="List">
     {children}
    </div>
  )
}

List.propTypes = {
  children: PropTypes.node,
}

export default List
