module.exports = function findShowDates ({ count, dateStart, ignoreInvalid }) {
  var n = count || 5
  dateStart = dateStart || Date.now() - 24 * 3600 * 1000

  var dates = []

  var invalidMonths = [-1, 10, 11]

  var thisMonth
  var lastThurs
  var lastMonth = -1
  var d = resetDate(new Date(dateStart))

  while (dates.length < n) {
    d = incrementDate(d)

    thisMonth = d.getUTCMonth()
    var isValidMonth = ignoreInvalid || invalidMonths.indexOf(lastMonth) === -1
    var isNewMonth = thisMonth !== lastMonth

    if (lastThurs && isValidMonth && isNewMonth) { dates.push(lastThurs) }

    if (d.getUTCDay() === 4) lastThurs = d
    lastMonth = thisMonth
  }

  var dateStrings = dates.map(function (d) {
    return d.toISOString().slice(0, 10)
  })

  return dateStrings
}

function incrementDate (d) {
  return new Date(d.valueOf() + 24 * 3600 * 1000)
}

function resetDate (d) {
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}
