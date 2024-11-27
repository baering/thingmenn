import React from 'react'
import { formatTime, formatPercentage } from '../../utils'
import './styles.css'

const KPI = ({ voteSummary, speechSummary, documentSummary }) => {
  let timeInStand = 0

  let hasVoteSummary = false
  let hasSpeechSummary = false
  let hasDocumentSummary = false

  let standsTaken = 0
  let away = 0

  if (voteSummary && voteSummary.votePercentages) {
    hasVoteSummary = true
    standsTaken = voteSummary.votePercentages.standsTaken
    away = voteSummary.votePercentages.away
  }

  if (speechSummary && speechSummary.Samtals) {
    hasSpeechSummary = true
    timeInStand = speechSummary.Samtals.minutes
  }
  let attendance = 100 - parseFloat(away)

  let bills = 0
  let motions = 0

  if (documentSummary && documentSummary.summary) {
    hasDocumentSummary = true
    bills = documentSummary.summary.bills.presenter.count
    motions = documentSummary.summary.motions.presenter.count
  }

  const renderedAttendance = hasVoteSummary
    ? formatPercentage(attendance)
    : 'Hleð'
  const renderedStandsTaken = hasVoteSummary
    ? formatPercentage(standsTaken)
    : 'Hleð'
  const renderedTimeInStand = hasSpeechSummary
    ? formatTime(timeInStand)
    : 'Hleð'

  return (
    <div className="KPI">
      <div className="KPI-stats">
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{renderedAttendance}</p>
          <h1 className="KPI-statsHeading">Mæting*</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{renderedStandsTaken}</p>
          <h1 className="KPI-statsHeading">Afstaða*</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{renderedTimeInStand}</p>
          <h1 className="KPI-statsHeading">í Ræðustól</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{bills}</p>
          <h1 className="KPI-statsHeading">Frumvörp**</h1>
        </div>
        <div className="KPI-statsItem">
          <p className="KPI-statsText">{motions}</p>
          <h1 className="KPI-statsHeading">Þingsályktunartillögur</h1>
        </div>
      </div>
      <p className="KPI-smallprint">
        * atkvæðagreiðslur
        <br />
        ** 1. flutningsmaður
      </p>
    </div>
  )
}

export default KPI
