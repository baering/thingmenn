import React from 'react'

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
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  imagePath: React.PropTypes.string,
}

export default Party
