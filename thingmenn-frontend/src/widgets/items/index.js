import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const Items = ({
  items,
  divider
}) => {
  return (
    <div className="Items">
     <dl className="Items-list">
       {items.map((item) => (
         [
           <dt>{item.name}</dt>,
           <dd><div style={{width: `${item.count/divider}px`}}>&nbsp;</div><span className="bottom-to-top"><span>{item.count}</span></span></dd>
         ]
       ))}
     </dl>
   </div>
  )
}

Items.propTypes = {
  items: PropTypes.array,
}

export default Items
