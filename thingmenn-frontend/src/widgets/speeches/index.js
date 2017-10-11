import React from 'react'
import PropTypes from "prop-types";
import { formatTime } from '../../utils'

import './styles.css'

const Speeches = ({
  title,
  speechSummary,
}) => {
  const speeches = Object.keys(speechSummary)
      .filter((key) => key !== 'Samtals')
      .map((key) => ({
          id: key,
          time: formatTime(speechSummary[key].minutes),
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
  title: PropTypes.string,
  speechSummary: PropTypes.object,
}

export default Speeches
