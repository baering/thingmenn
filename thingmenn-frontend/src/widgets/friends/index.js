import React from 'react'
import { Link } from 'react-router'
import { formatPercentage } from '../../utils'

import PartyBadge from '../partybadge'

import './styles.css'

const Friends = ({
  title,
  subTitle,
  friends,
  isDisplayingFriends,
}) => {
  return (
    <div className="Friends">
     <h1 className="Friends-heading heading"><span className={`typcn typcn-group-outline icon-${isDisplayingFriends ? 'friend' : 'enemy'}`}></span> {title}</h1>
     <dl className="Friends-list">
       <dt>Nafn</dt>
       <dd>{subTitle}</dd>
       {friends.map((friend) => (
         [
           <dt>
             <PartyBadge party={friend.mp.partySlug} className="Friends-badge" />
             <Link to={`/thingmenn/${friend.mp.id}`}>{friend.mp.name}</Link>
            </dt>,
           <dd>{friend.votes} ({formatPercentage(friend.similarity)})</dd>
         ]
       ))}
     </dl>
   </div>
  )
}

Friends.propTypes = {
  title: React.PropTypes.string,
  subTitle: React.PropTypes.string,
  friends: React.PropTypes.array,
}

export default Friends
