import React from 'react'
import './styles.css'

const Friends = ({
  title,
  friends,
}) => {
  return (
    <div className="Friends">
     <h1 className="Friends-heading"><span className="typcn typcn-user-outline icon-friend"></span> {title}</h1>
     <dl className="Friends-list">
       <dt>Nafn</dt>
       <dd>Eins greidd atkvæði</dd>
       {friends.map((friend) => (
         [
           <dt>{friend.mp.name}</dt>,
           <dd>{friend.similarVotes} ({friend.similarity}%)</dd>
         ]
       ))}
     </dl>
   </div>
  )
}

Friends.propTypes = {
  title: React.PropTypes.string,
  friends: React.PropTypes.array,
}

export default Friends
