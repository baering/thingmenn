import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const dayNames = ['Sun', 'Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau']
const days = new Array(7).fill('').map((_, index) => `${index}`)
const timeSlots = new Array(24).fill(0).map((_, index) => index + 1)

const renderTimeSlot = (hours) => {
  if (hours === 24) {
    return '00:00'
  }

  return hours < 10 ? `0${hours}:00` : `${hours}:00`
}

const WeekdayHourMatrix = ({ weekdayHourMatrixSummary }) => {
  if (
    !weekdayHourMatrixSummary ||
    !weekdayHourMatrixSummary.statistics ||
    !weekdayHourMatrixSummary.data
  ) {
    return null
  }

  const { data, statistics } = weekdayHourMatrixSummary
  const { max } = statistics

  return (
    <div className="WeekdayHourMatrix">
      <div className="WeekdayHourMatrix-Day">
        <div className="WeekdayHourMatrix-DayValues">
          <div className="WeekdayHourMatrix-DayValueContainer">
            <p className="WeekdayHourMatrix-DayValue">&nbsp;</p>
          </div>
          {timeSlots.map((timeSlot) => (
            <div
              key={`timeslotHeader_${timeSlot}`}
              className="WeekdayHourMatrix-DayValueContainer"
            >
              <p className="WeekdayHourMatrix-DayValue">
                {renderTimeSlot(timeSlot)}
              </p>
            </div>
          ))}
        </div>
      </div>
      {days.map((dayIndex) => (
        <div key={`dayHeader_${dayIndex}`} className="WeekdayHourMatrix-Day">
          <div className="WeekdayHourMatrix-DayValues">
            <div className="WeekdayHourMatrix-DayValueContainer">
              <p className="WeekdayHourMatrix-DayValue">{dayNames[dayIndex]}</p>
            </div>
            {timeSlots.map((timeSlot) => {
              const value = data[dayIndex] ? data[dayIndex][timeSlot] || 0 : 0

              const valueRatio = value / max
              const colorValue = valueRatio > 0 ? 0.02 + valueRatio * 0.55 : 0

              const color = `rgba(255,0,0,${colorValue})`

              return (
                <div
                  key={`day_${dayIndex}_timeslot_${timeSlot}`}
                  className="WeekdayHourMatrix-DayValueContainer"
                >
                  <p
                    className="WeekdayHourMatrix-DayValue"
                    style={{
                      color: value === 0 ? 'rgba(0,0,0,0)' : 'inherit',
                      backgroundColor: color,
                    }}
                  >
                    {value === 0 ? '0' : value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

WeekdayHourMatrix.propTypes = {
  weekdayHourMatrixSummary: PropTypes.object,
  max: PropTypes.number,
}

export default WeekdayHourMatrix
