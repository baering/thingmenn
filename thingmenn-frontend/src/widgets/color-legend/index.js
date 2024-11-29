import React from 'react'
import './styles.css'

const ColorLegend = ({ includeAbsent }) => {
  return (
    <div className="Colors">
      <div className="Colors--standsTaken">
        <span className="ColorBox ColorBox--standsTaken" />{' '}
        <span className="Colors--grey">Afstaða tekin</span>
      </div>
      <div className="Colors--idle">
        <span className="ColorBox ColorBox--idle" />{' '}
        <span className="Colors--grey">Afstöðuleysi</span>
      </div>
      {includeAbsent ? (
        <div className="Colors--absent">
          <span className="ColorBox ColorBox--absent" />{' '}
          <span className="Colors--grey">Tilkynnt fjarvist</span>
        </div>
      ) : null}
      <div className="Colors--away">
        <span className="ColorBox ColorBox--away" />{' '}
        <span className="Colors--grey">Fjarverandi</span>
      </div>
    </div>
  )
}

export default ColorLegend
