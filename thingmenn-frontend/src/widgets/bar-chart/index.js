import React from 'react'
import './styles.css'

const BarChart = ({
  subjectSummary
}) => {
  const { subject, voteSplit } = subjectSummary

  let standsTaken = 0
  let idle = 0
  let away = 0

  if (voteSplit.standsTaken) {
    standsTaken = voteSplit.standsTaken.percentage
  }

  if (voteSplit.idle) {
    idle = voteSplit.idle.percentage
  }

  if (voteSplit.away) {
    away = voteSplit.away.percentage
  }

  return (
    <div>
      <strong>{subject}</strong> {standsTaken}% / {idle}% / {away}% = {standsTaken + idle + away}%
    </div>
  )
}

export default BarChart
