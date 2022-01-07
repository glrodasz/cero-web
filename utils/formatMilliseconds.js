const formatMilliseconds = (milliseconds) => {
  const seconds = milliseconds / 1000
  const currentMinutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const currentSeconds = String(seconds % 60).padStart(2, '0')

  return `${currentMinutes}:${currentSeconds}`
}

export default formatMilliseconds
