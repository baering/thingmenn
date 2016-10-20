import React from 'react'
import './styles.css'

const BarChart = ({
  subjectSummary
}) => {
  const { subject, voteSplit } = subjectSummary

  let standsTaken = 0;
  let standsTakenOccurance;
  let idle = 0;
  let idleOccurance;
  let away = 0;
  let awayOccurance;

  if (voteSplit.standsTaken) {
    standsTaken = voteSplit.standsTaken.percentage
    standsTakenOccurance = voteSplit.standsTaken.occurance
  }

  if (voteSplit.idle) {
    idle = voteSplit.idle.percentage
    idleOccurance = voteSplit.idle.occurance
  }

  if (voteSplit.away) {
    away = voteSplit.away.percentage
    awayOccurance = voteSplit.away.occurance
  }

  return (
    <div className="Barchart">
      <div className="Barchart-topic"><strong>{subject}</strong></div>
      <div className="Barchart-bar">
        <div className="Barchart-segment Barchart--standsTaken" style={{width: standsTaken + '%'}}>{standsTakenOccurance}</div>
        <div className="Barchart-segment Barchart--idle" style={{width: idle + '%'}}>{idleOccurance}</div>
        <div className="Barchart-segment Barchart--away" style={{width: away + '%'}}>{awayOccurance}</div>
      </div>
    </div>
  )
}

export default BarChart
