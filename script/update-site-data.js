var fs = require('fs')
var path = require('path')

var pastData = require('../public/events/2018/_data.json')
var currentData = require('../public/_data.json')
var fetchAdmin = require('./fetch-admin')
var extractShow = require('./extract-show')

fetchAdmin(function (err, everything) {
  if (err) {
    console.error(err)
    return process.exit(1)
  }

  updateCurrent(everything)
  updatePrevious(everything)
})

function updateCurrent (everything) {
  var show = extractShow(everything)
  currentData.current.date = show.date
  currentData.current.datetime = show.datetime
  currentData.current.host = show.host
  currentData.current.speakers = show.speakers
  currentData.current.sponsors = show.sponsors

  var target = path.join(__dirname, '../public/_data.json')
  fs.writeFileSync(target, JSON.stringify(currentData, null, 4))
}

function updatePrevious (everything) {
  var shows = []

  var t0 = new Date('2018-01-01T00:00:00.000Z').valueOf()
  var msMonth = 31 * 24 * 3600 * 1000
  for (var i = t0; i < Date.now(); i += msMonth) {
    shows.push(extractShow(everything, i))
  }

  pastData.events = shows.filter(show => show.unixTime < Date.now())
  var target = path.join(__dirname, '../public/events/2018/_data.json')
  fs.writeFileSync(target, JSON.stringify(pastData, null, 4))
}
