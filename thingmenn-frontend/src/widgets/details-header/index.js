import React from 'react'
import { formatTime, formatPercentage } from '../../utils'

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
  const { standsTaken, idle } = voteSummary.votePercentages

  let timeInStand = 0
  if (speechSummary && speechSummary.Samtals) {
    timeInStand = speechSummary.Samtals.minutes
  }
  let attendance = standsTaken + idle

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
          <p className="DetailsHeader-statsText">{formatPercentage(attendance)}</p>
          <h1 className="DetailsHeader-statsHeading">Mæting</h1>
        </div>
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">{formatPercentage(standsTaken)}</p>
          <h1 className="DetailsHeader-statsHeading">Afstaða</h1>
        </div>
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">{formatTime(timeInStand)}</p>
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
