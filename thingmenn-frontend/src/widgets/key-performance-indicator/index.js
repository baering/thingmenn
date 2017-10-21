import React from 'react'
import { formatTime, formatPercentage } from '../../utils'
import './styles.css'

const KPI = ({ voteSummary, speechSummary, documentSummary }) => {
  const { standsTaken, away } = voteSummary.votePercentages
  let timeInStand = 0
  if (speechSummary && speechSummary.Samtals) {
    timeInStand = speechSummary.Samtals.minutes
  }
  let attendance = 100 - parseFloat(away)

  return (
    <div className="KPI">
      <div className="KPI-stats">
        <div className="KPI-statsItem">
          <p className="KPI-statsText">
            {formatPercentage(attendance)}
          </p>
          <h1 className="KPI-statsHeading">Mæting*</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">
            {formatPercentage(standsTaken)}
          </p>
          <h1 className="KPI-statsHeading">Afstaða*</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{formatTime(timeInStand)}</p>
          <h1 className="KPI-statsHeading">í Ræðustól</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{documentSummary.summary && documentSummary.summary.bills.total}</p>
          <h1 className="KPI-statsHeading">frumvörp</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{documentSummary.summary && documentSummary.summary.motions.total}</p>
          <h1 className="KPI-statsHeading">Þingsályktunartillögur</h1>
        </div>
      </div>
      <p className="KPI-smallprint">* í atkvæðagreiðslum</p>
    </div>
  )
}

export default KPI
