import time from './time'

const DEAFULT_LOCALE = 'es-CO'

const TIME_UNITS_IN_SECONDS = {
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
