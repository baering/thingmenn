import React from 'react'
import PropTypes from 'prop-types'

import ListItem from '../list-item'
import ListItemImage from '../list-item-image'
import ListItemContent from '../list-item-content'
import PartyBadge from '../partybadge'

import './styles.css'

const Mp = ({ id, imagePath, params, mpName, partyId }) => {
  let url = `/thingmenn/${id}/kjortimabil/${params.term || 'allt'}`
  return (
    <ListItem url={url}>
      <ListItemImage path={imagePath} cover={true}>
        <PartyBadge party={partyId} className="Mp-badge" />
      </ListItemImage>
      <ListItemContent title={mpName} />
    </ListItem>
  )
}

Mp.propTypes = {
  id: PropTypes.any,
  name: PropTypes.string,
  profilePicture: PropTypes.string,
  partyId: PropTypes.number,
}

export default Mp
