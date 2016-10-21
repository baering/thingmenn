import React from 'react'
import './styles.css'

const MpHeader = ({
  id,
  name,
  description,
  party,
  imagePath,
  speechSummary,
  subjectSummary,
  voteSummary,
}) => {

  let timeInStand = 0;
  if (speechSummary && speechSummary.Samtals) {
    let minutes = parseFloat(speechSummary.Samtals.minutes)
    if (minutes !== 0) {
      if (minutes <= 60) {
        timeInStand = `${Math.round(minutes)}min`;
      } else {
        timeInStand = `${parseFloat(minutes/60).toFixed(1)}klst`;
      }
    } else {
      timeInStand = `Aldrei`;
    }
  }

  return (
    <div className="MpHeader">
      <div className="MpHeader-details">
        <div
          className="MpHeader-image"
          style={{
            backgroundImage: `url(${imagePath})`
          }}
        ></div>
        <div className="MpHeader-bio">
          <h1 className="MpHeader-bioName">{name} <span className="Main-subheader">{party}</span></h1>
          <p className="MpHeader-bioText">{description}</p>
        </div>
      </div>
      <div className="MpHeader-stats">
        <div className="MpHeader-statsItem">
          <p className="MpHeader-statsText">{voteSummary.voteSummary.numberOfVotes}</p>
          <h1 className="MpHeader-statsHeading">Atkvæði</h1>
        </div>
        <div className="MpHeader-statsItem">
          <p className="MpHeader-statsText">{voteSummary.votePercentages.standsTaken}%</p>
          <h1 className="MpHeader-statsHeading">Afstaða</h1>
        </div>
        <div className="MpHeader-statsItem">
          <p className="MpHeader-statsText">{timeInStand}</p>
          <h1 className="MpHeader-statsHeading">í Ræðustól</h1>
        </div>
      </div>
    </div>
  )
}

MpHeader.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  profilePicture: React.PropTypes.string,
  party: React.PropTypes.string,
}

export default MpHeader
