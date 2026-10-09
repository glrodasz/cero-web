const MINUTES_IN_AN_HOUR = 60

// A short duration label: 30 → "30m", 60 → "1h", 90 → "1h 30m".
const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / MINUTES_IN_AN_HOUR)
  const remainingMinutes = minutes % MINUTES_IN_AN_HOUR

  const parts = [
    hours > 0 && `${hours}h`,
    remainingMinutes > 0 && `${remainingMinutes}m`,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' ') : '0m'
}

export default formatMinutes
