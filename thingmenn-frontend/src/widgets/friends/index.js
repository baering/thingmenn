import React from 'react'
import './styles.css'

const Friends = ({
  title,
  subTitle,
  friends,
  isDisplayingFriends,
}) => {
  return (
    <div className="Friends">
     <h1 className="Friends-heading"><span className={`typcn typcn-user-outline icon-${isDisplayingFriends ? 'friend' : 'enemy'}`}></span> {title}</h1>
     <dl className="Friends-list">
       <dt>Nafn</dt>
       <dd>{subTitle}</dd>
       {friends.map((friend) => (
         [
           <dt>{friend.mp.name}</dt>,
           <dd>{friend.votes} ({friend.similarity}%)</dd>
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
