import React from 'react'
import { formatTime, formatPercentage } from '../../utils'
import './styles.css'

const KPI = ({ voteSummary, speechSummary }) => {
  const { standsTaken, away } = voteSummary.votePercentages
  let timeInStand = 0
  if (speechSummary && speechSummary.Samtals) {
    timeInStand = speechSummary.Samtals.minutes
  }
  let attendance = 100 - parseFloat(away)

  return (
    <div className="KPI">
      <div className="DetailsHeader-stats">
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">
            {formatPercentage(attendance)}
          </p>
          <h1 className="DetailsHeader-statsHeading">Mæting</h1>
        </div>
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">
            {formatPercentage(standsTaken)}
          </p>
          <h1 className="DetailsHeader-statsHeading">Afstaða</h1>
        </div>
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">{formatTime(timeInStand)}</p>
          <h1 className="DetailsHeader-statsHeading">í Ræðustól</h1>
        </div>
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">100%</p>
          <h1 className="DetailsHeader-statsHeading">Til í tuskið</h1>
        </div>
        <div className="DetailsHeader-statsItem">
          <p className="DetailsHeader-statsText">25.55%</p>
          <h1 className="DetailsHeader-statsHeading">Árangur</h1>
        </div>
      </div>
    </div>
  )
}

export default KPI
