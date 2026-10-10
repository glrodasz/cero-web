import time from './time'

const DEAFULT_LOCALE = 'es-CO'

// Largest first. A month is 30 days and a year 365: close enough for "how long
// ago", where days alone turned a two-year-old task into "hace 730 días".
const TIME_UNITS_IN_SECONDS = {
  year: time.ONE_YEAR_IN_SECONDS,
  month: time.ONE_MONTH_IN_SECONDS,
  week: time.ONE_WEEK_IN_SECONDS,
  day: time.ONE_DAY_IN_SECONDS,
  hour: time.ONE_HOUR_IN_SECONDS,
  minute: time.ONE_MINUTE_IN_SECONDS,
  second: time.ONE_SECOND,
}

const getSecondsDiff = (timestamp) =>
  (Date.now() - timestamp) / time.ONE_SECOND_IN_MS

const getUnitAndValueTime = (secondsElapsed) => {
  const entries = Object.entries(TIME_UNITS_IN_SECONDS)

  for (const [unit, unitInSeconds] of entries) {
    const match = secondsElapsed >= unitInSeconds || unit === 'second'

    if (match) {
      const value = Math.floor(secondsElapsed / unitInSeconds)
      return { value, unit }
    }
  }
}

const timeAgo = (timestamp, locale = DEAFULT_LOCALE) => {
  const relativeTimeFormat = new Intl.RelativeTimeFormat(locale)

  const secondsElapsed = getSecondsDiff(timestamp)
  const { value, unit } = getUnitAndValueTime(secondsElapsed)

  return relativeTimeFormat.format(value * -1, unit)
}

export default timeAgo
