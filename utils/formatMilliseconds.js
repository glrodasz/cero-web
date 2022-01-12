const formatMilliseconds = (milliseconds) => {
  const seconds = milliseconds / 1000
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const currentHours = String(hours % 24).padStart(2, '0')
  const currentMinutes = String(minutes % 60).padStart(2, '0')
  const currentSeconds = String(seconds % 60).padStart(2, '0')

  return currentHours !== '00'
    ? `${currentHours}:${currentMinutes}:${currentSeconds}`
    : `${currentMinutes}:${currentSeconds}`
}

export default formatMilliseconds
