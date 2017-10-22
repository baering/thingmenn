import React from 'react'
import PropTypes from 'prop-types'

import ListItem from '../list-item'
import ListItemImage from '../list-item-image'
import ListItemContent from '../list-item-content'
import PartyBadge from '../partybadge'

import './styles.css'

const Mp = ({
  id,
  imagePath,
  lthing,
  name,
  party,
  partySlug,
}) => {
  let url = `/thingmenn/${id}/thing/allt`
  if (lthing) {
    url = `/thingmenn/${id}/thing/${lthing}`
  }
  return (
    <ListItem url={url}>
      <ListItemImage path={imagePath} cover={true}>
        <PartyBadge party={partySlug} className="Mp-badge"/>
      </ListItemImage>
      <ListItemContent title={name} />
    </ListItem>
  )
}

Mp.propTypes = {
  id: PropTypes.any,
  name: PropTypes.string,
  profilePicture: PropTypes.string,
  party: PropTypes.string,
}

export default Mp
