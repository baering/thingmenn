import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { formatPercentage } from '../../utils'

import PartyBadge from '../partybadge'

import './styles.css'

const Friends = ({
  title,
  subTitle,
  friends,
  isDisplayingFriends,
  valueFormatter = (friend) => `${friend.votes} (${formatPercentage(friend.similarity)})`,
  icon = true
}) => {
  return (
    <div className="Friends">
      <h1 className="Friends-heading heading">
        {icon ? <span><span key="icon-1" className={`typcn typcn-group-outline icon-${isDisplayingFriends ? 'friend' : 'enemy'}`}></span> </span>: null}
        {title}
      </h1>
      <dl className="Friends-list">
       <dt>Nafn</dt>
       <dd>{subTitle}</dd>
       {friends.map((friend) => (
         [
           <dt key={friend.mp.id}>
             <PartyBadge party={friend.mp.partySlug} className="Friends-badge" />
             <Link to={`/thingmenn/${friend.mp.id}`}>{friend.mp.name}</Link>
            </dt>,
           <dd key={friend.mp.id + '-value'}>{valueFormatter(friend)}</dd>
         ]
       ))}
     </dl>
   </div>
  )
}

Friends.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  friends: PropTypes.array,
}

export default Friends
