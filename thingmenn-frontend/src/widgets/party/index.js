import React from 'react'
import PropTypes from 'prop-types'

import ListItem from '../list-item'
import ListItemImage from '../list-item-image'
import ListItemContent from '../list-item-content'

const Party = ({
  id,
  name,
  imagePath,
}) => {
  return (
    <ListItem url={`/thingflokkar/${id}`}>
      <ListItemImage path={imagePath}></ListItemImage>
      <ListItemContent title={name} />
    </ListItem>
  )
}

Party.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  imagePath: PropTypes.string,
}

export default Party
