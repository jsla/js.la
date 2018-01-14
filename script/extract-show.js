var moment = require('moment')
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

  return formatShow({
    date: date,
    host: hostMatch[0],
    speakers: speakerMatch,
    sponsors: sponsorMatch
  })
}

function formatShow ({date, host, speakers, sponsors}) {
  var showSpeakers = []
  if (speakers[0]) showSpeakers.push(formatSpeaker(speakers[0]))
  if (speakers[1]) showSpeakers.push(formatSpeaker(speakers[1]))

  var showSponsors = []
  showSponsors.push(formatSponsor(host))
  if (sponsors[0]) showSponsors.push(formatSponsor(sponsors[0]))
  if (sponsors[1]) showSponsors.push(formatSponsor(sponsors[1]))

  var formattedDate = formatDate(date)

  return {
    datetime: formattedDate.datetime,
    date: formattedDate.date,
    host: formatHost(host),
    speakers: showSpeakers,
    sponsors: showSponsors
  }
}

function formatDate (date) {
  var m = moment(date)
  var human = `${m.format('dddd MMMM Do, YYYY')} 7pm`
  var time = `${m.format('M/D/YYYY')} 19:00:00`

  return {
    datetime: human,
    date: time
  }
}

function formatHost (host) {
  return {
    address: host.address,
    name: host.organization,
    url: host.link,
    misc: ''
  }
}

function formatSpeaker (adminSpeaker) {
  return {
    title: adminSpeaker.title,
    name: adminSpeaker.name,
    image: adminSpeaker.avatar,
    twitter: (adminSpeaker.twitter || '').replace('@', ''),
    github: (adminSpeaker.github || '').replace('@', ''),
    description: adminSpeaker.abstract
  }
}

function formatSponsor (adminSponsor) {
  return {
    name: adminSponsor.organization,
    logo: adminSponsor.logo,
    url: adminSponsor.link
  }
}

function toArray (obj) {
  return Object.keys(obj).map(key => obj[key])
}
