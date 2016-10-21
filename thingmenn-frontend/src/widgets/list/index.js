import React from 'react'
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
  children: React.PropTypes.node,
}

export default List
