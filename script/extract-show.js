var showDates = require('./show-dates')

module.exports = function extractNextShow (all) {
  var hosts = toArray(all.hosts)
  var sponsors = toArray(all.sponsors)
  var speakers = toArray(all.speakers)

  var date = showDates[0]

  var month = date.slice(0, 7)
  var speakerMatch = speakers.filter(function (speaker) {
    return (speaker.bookedShows || '').match(month)
  })

  var hostMatch = hosts.filter(function (host) {
    return (host.bookedShows || '').match(month)
  })

  var sponsorMatch = sponsors.filter(function (sponsor) {
    return (sponsor.bookedShows || '').match(month)
  })

  return {
    date: date,
    host: hostMatch[0],
    speaker1: speakerMatch[0],
    speaker2: speakerMatch[1],
    sponsor1: sponsorMatch[0],
    sponsor2: sponsorMatch[1]
  }
}

function toArray (obj) {
  return Object.keys(obj).map(key => obj[key])
}
