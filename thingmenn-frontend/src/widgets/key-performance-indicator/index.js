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

  let bills = 0
  let motions = 0
  if (documentSummary && documentSummary.summary) {
    bills = documentSummary.summary.bills.total
    motions = documentSummary.summary.motions.total
  }


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
          <p className="KPI-statsText">{bills}</p>
          <h1 className="KPI-statsHeading">Frumvörp</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{motions}</p>
          <h1 className="KPI-statsHeading">Þingsályktunartillögur</h1>
        </div>
      </div>
      <p className="KPI-smallprint">* atkvæðagreiðslur</p>
    </div>
  )
}

export default KPI
