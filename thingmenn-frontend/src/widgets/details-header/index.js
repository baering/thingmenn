import React from 'react'
import './styles.css'

const DetailsHeader = ({
  id,
  name,
  description,
  party,
  about,
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
    <div className="DetailsHeader">
      <div className="DetailsHeader-details">
        <div
          className="DetailsHeader-image"
          style={{
            backgroundImage: `url(${imagePath})`
          }}
        ></div>
      <div className="DetailsHeader-bio">
          <h1 className="DetailsHeader-bioName">{name} <p className="Main-subheader">{party}</p></h1>
          <p className="DetailsHeader-bioText">{description || about}</p>
        </div>
      </div>
      <div className="DetailsHeader-stats">
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">{voteSummary.voteSummary.numberOfVotes}</p>
          <h1 className="DetailsHeader-statsHeading">Atkvæði</h1>
        </div>
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">{voteSummary.votePercentages.standsTaken}%</p>
          <h1 className="DetailsHeader-statsHeading">Afstaða</h1>
        </div>
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">{timeInStand}</p>
          <h1 className="DetailsHeader-statsHeading">í Ræðustól</h1>
        </div>
      </div>
    </div>
  )
}

DetailsHeader.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  profilePicture: React.PropTypes.string,
  party: React.PropTypes.string,
}

export default DetailsHeader
