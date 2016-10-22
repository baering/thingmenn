export const formatTime = (time) => {
  if (!time) {
    return
  }

  let minutes = parseFloat(time)

  if (minutes === 0) {
    return 'Aldrei'
  }

  if (minutes <= 60) {
    return `${Math.round(minutes)} mín.`
  }

  let hours = parseFloat(minutes / 60)
  return `${hours.toFixed(1).replace('.', ',')} klst.`
}

export const formatPercentage = (number) => {
  if (!number) {
    return
  }

  let percentage = parseFloat(number).toFixed(1).replace('.', ',')
  return `${percentage}%`
}
