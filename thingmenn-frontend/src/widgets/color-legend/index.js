import React from 'react'
import './styles.css'

const ColorLegend = ({
  includeAbsent
}) => {
  return (
    <div className="Colors">
      <div className="Colors--standsTaken">◼︎ Afstaða tekin</div>
      <div className="Colors--idle">◼︎ Afstöðuleysi</div>
      {includeAbsent ? (
        <div className="Colors--absent">◼︎ Skráð fjarvist</div>
      ) : null}
      <div className="Colors--away">◼︎ Fjarverandi</div>
    </div>
  )
}

export default ColorLegend
