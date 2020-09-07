const SECOND_ROUNDING_EPSILON = 0.0000001

var nextShowtime = getNextShowtime()

var el = document.querySelector('#countdown')

updateTime(el, nextShowtime)
setInterval(updateTime, 1000, el, nextShowtime)

function updateTime (el, nextShowtime) {
  var ms = nextShowtime - new Date()
  if (ms < 0) return

  el.innerText = `in ${prettyMs(ms, {
    verbose: true, secondsDecimalDigits: 0
  })}`
}

function getNextShowtime () {
  var now = new Date().toISOString().slice(0, 10)
  var showtimes = getShowtimes()

  var showtime
  for (var i = 0; i < showtimes.length; i++) {
    showtime = showtimes[i]
    if (showtime.slice(0, 10) >= now) break
  }

  return new Date(showtime)
}

function getShowtimes () {
  return ['2020-09-25T03:00:00.000Z', '2020-10-30T03:00:00.000Z', '2021-01-29T03:00:00.000Z', '2021-02-26T03:00:00.000Z', '2021-03-26T03:00:00.000Z', '2021-04-30T03:00:00.000Z', '2021-05-28T03:00:00.000Z', '2021-06-25T03:00:00.000Z', '2021-07-30T03:00:00.000Z', '2021-08-27T03:00:00.000Z', '2021-10-01T03:00:00.000Z', '2021-10-29T03:00:00.000Z', '2022-01-28T03:00:00.000Z', '2022-02-25T03:00:00.000Z', '2022-04-01T03:00:00.000Z', '2022-04-29T03:00:00.000Z', '2022-05-27T03:00:00.000Z', '2022-07-01T03:00:00.000Z', '2022-07-29T03:00:00.000Z', '2022-08-26T03:00:00.000Z', '2022-09-30T03:00:00.000Z', '2022-10-28T03:00:00.000Z', '2023-01-27T03:00:00.000Z', '2023-02-24T03:00:00.000Z', '2023-03-31T03:00:00.000Z', '2023-04-28T03:00:00.000Z', '2023-05-26T03:00:00.000Z', '2023-06-30T03:00:00.000Z', '2023-07-28T03:00:00.000Z', '2023-09-01T03:00:00.000Z', '2023-09-29T03:00:00.000Z', '2023-10-27T03:00:00.000Z', '2024-01-26T03:00:00.000Z', '2024-03-01T03:00:00.000Z', '2024-03-29T03:00:00.000Z', '2024-04-26T03:00:00.000Z', '2024-05-31T03:00:00.000Z', '2024-06-28T03:00:00.000Z', '2024-07-26T03:00:00.000Z', '2024-08-30T03:00:00.000Z', '2024-09-27T03:00:00.000Z', '2024-11-01T03:00:00.000Z', '2025-01-31T03:00:00.000Z', '2025-02-28T03:00:00.000Z', '2025-03-28T03:00:00.000Z', '2025-04-25T03:00:00.000Z', '2025-05-30T03:00:00.000Z', '2025-06-27T03:00:00.000Z', '2025-08-01T03:00:00.000Z', '2025-08-29T03:00:00.000Z']
}

// https://github.com/sindresorhus/pretty-ms and https://github.com/sindresorhus/parse-ms

function pluralize (word, count) {
  return count === 1 ? word : `${word}s`
}

function prettyMs (milliseconds, options = {}) {
  if (!Number.isFinite(milliseconds)) {
    throw new TypeError('Expected a finite number')
  }

  if (options.colonNotation) {
    options.compact = false
    options.formatSubMilliseconds = false
    options.separateMilliseconds = false
    options.verbose = false
  }

  if (options.compact) {
    options.secondsDecimalDigits = 0
    options.millisecondsDecimalDigits = 0
  }

  const result = []

  const floorDecimals = (value, decimalDigits) => {
    const flooredInterimValue = Math.floor((value * (10 ** decimalDigits)) + SECOND_ROUNDING_EPSILON)
    const flooredValue = Math.round(flooredInterimValue) / (10 ** decimalDigits)
    return flooredValue.toFixed(decimalDigits)
  }

  const add = (value, long, short, valueString) => {
    if ((result.length === 0 || !options.colonNotation) && value === 0 && !(options.colonNotation && short === 'm')) {
      return
    }

    valueString = (valueString || value || '0').toString()
    let prefix
    let suffix
    if (options.colonNotation) {
      prefix = result.length > 0 ? ':' : ''
      suffix = ''
      const wholeDigits = valueString.includes('.') ? valueString.split('.')[0].length : valueString.length
      const minLength = result.length > 0 ? 2 : 1
      valueString = '0'.repeat(Math.max(0, minLength - wholeDigits)) + valueString
    } else {
      prefix = ''
      suffix = options.verbose ? ' ' + pluralize(long, value) : short
    }

    result.push(prefix + valueString + suffix)
  }

  const parsed = parseMilliseconds(milliseconds)

  add(Math.trunc(parsed.days / 365), 'year', 'y')
  add(parsed.days % 365, 'day', 'd')
  add(parsed.hours, 'hour', 'h')
  add(parsed.minutes, 'minute', 'm')

  if (
    options.separateMilliseconds ||
    options.formatSubMilliseconds ||
    milliseconds < 1000
  ) {
    add(parsed.seconds, 'second', 's')
    if (options.formatSubMilliseconds) {
      add(parsed.milliseconds, 'millisecond', 'ms')
      add(parsed.microseconds, 'microsecond', 'µs')
      add(parsed.nanoseconds, 'nanosecond', 'ns')
    } else {
      const millisecondsAndBelow =
        parsed.milliseconds +
        (parsed.microseconds / 1000) +
        (parsed.nanoseconds / 1e6)

      const millisecondsDecimalDigits =
        typeof options.millisecondsDecimalDigits === 'number'
          ? options.millisecondsDecimalDigits
          : 0

      const roundedMiliseconds = millisecondsAndBelow >= 1
        ? Math.round(millisecondsAndBelow)
        : Math.ceil(millisecondsAndBelow)

      const millisecondsString = millisecondsDecimalDigits
        ? millisecondsAndBelow.toFixed(millisecondsDecimalDigits)
        : roundedMiliseconds

      add(
        Number.parseFloat(millisecondsString, 10),
        'millisecond',
        'ms',
        millisecondsString
      )
    }
  } else {
    const seconds = (milliseconds / 1000) % 60
    const secondsDecimalDigits =
      typeof options.secondsDecimalDigits === 'number'
        ? options.secondsDecimalDigits
        : 1
    const secondsFixed = floorDecimals(seconds, secondsDecimalDigits)
    const secondsString = options.keepDecimalsOnWholeSeconds
      ? secondsFixed
      : secondsFixed.replace(/\.0+$/, '')
    add(Number.parseFloat(secondsString, 10), 'second', 's', secondsString)
  }

  if (result.length === 0) {
    return '0' + (options.verbose ? ' milliseconds' : 'ms')
  }

  if (options.compact) {
    return result[0]
  }

  if (typeof options.unitCount === 'number') {
    const separator = options.colonNotation ? '' : ' '
    return result.slice(0, Math.max(options.unitCount, 1)).join(separator)
  }

  return options.colonNotation ? result.join('') : result.join(' ')
};

function parseMilliseconds (milliseconds) {
  if (typeof milliseconds !== 'number') {
    throw new TypeError('Expected a number')
  }

  const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil

  return {
    days: roundTowardsZero(milliseconds / 86400000),
    hours: roundTowardsZero(milliseconds / 3600000) % 24,
    minutes: roundTowardsZero(milliseconds / 60000) % 60,
    seconds: roundTowardsZero(milliseconds / 1000) % 60,
    milliseconds: roundTowardsZero(milliseconds) % 1000,
    microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
    nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
  }
};
