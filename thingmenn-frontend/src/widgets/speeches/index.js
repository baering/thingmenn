import React from 'react'
import './styles.css'

const fixTime = (timeValue) => {
  let minutes = parseFloat(timeValue)

  if (minutes === 0) {
    return 'Aldrei'
  }

  if (minutes <= 60) {
    return `${Math.round(minutes)} mín.`
  }

  let hours = parseFloat(minutes/60)
  return `${hours.toFixed(1).replace('.', ',')} klst.`
}

const Speeches = ({
  title,
  speechSummary,
}) => {
  const speeches = Object.keys(speechSummary)
      .filter((key) => key !== 'Samtals')
      .map((key) => ({
          id: key,
          time: fixTime(speechSummary[key].minutes),
          count: speechSummary[key].count,
        }))

  return (
    <div className="Speeches">
      <h3 className="Speeches-heading heading">{title}</h3>
      <div className="Speeches-items">
        {speeches.map((speech, index) => (
          <div className="Speeches-item" key={speech.id}>
            <p className="Speeches-statsText">{speech.time}</p>
            <h1 className="Speeches-statsHeading">{speech.id} ({speech.count})</h1>
          </div>
        ))}
     </div>
   </div>
  )
}

Speeches.propTypes = {
  title: React.PropTypes.string,
  speechSummary: React.PropTypes.object,
}

export default Speeches
