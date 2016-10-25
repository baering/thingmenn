import React from 'react'
import './styles.css'

const ColorLegend = ({
  includeAbsent
}) => {
  return (
    <div className="Colors">
      <div className="Colors--standsTaken">◼︎ <span className="Colors--grey">Afstaða tekin</span></div>
      <div className="Colors--idle">◼︎ <span className="Colors--grey">Afstöðuleysi</span></div>
      {includeAbsent ? (
        <div className="Colors--absent">◼︎ <span className="Colors--grey">Skráð fjarvist</span></div>
      ) : null}
      <div className="Colors--away">◼︎ <span className="Colors--grey">Fjarverandi</span></div>
    </div>
  )
}

export default ColorLegend
