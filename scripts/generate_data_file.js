require('dotenv').config()

const map = require('map-async')
const sha1 = require('sha1')
const Authentic = require('authentic-client')

const auth = Authentic({
  server: 'https://authentic.apps.js.la/'
})

const creds = {
  email: process.env.AUTHENTIC_EMAIL,
  password: process.env.AUTHENTIC_PASSWORD
}

let DATA = require('./data_not_on_server.json')

fetchData(creds, function (err, { speakers, sponsors, hosts, drinks }) {
  if (err) return console.error(err)

  updateData({ speakers, sponsors, hosts, drinks })
  console.log(JSON.stringify(DATA, null, 2))
})

function updateData ({ speakers, sponsors, hosts, drinks }) {
  getAllDates({ speakers, sponsors, hosts, drinks })
  fillHosts(hosts)
  fillSpeakers(speakers)
  fillSponsors(sponsors)
  fillPastSponsors()
}

function getAllDates ({ hosts, speakers, sponsors, drinks }) {
  // Get all dates
  each(hosts, function (hostKey, host) {
    if (!host.bookedShows) return

    host.bookedShows = host.bookedShows.split('\n')

    host.bookedShows.forEach(function (date) {
      var [year, month] = date.split('-')

      let event = {
        host: hostKey,
        date: date,
        speakers: [],
        sponsors: [],
        titoUrl: `https://jsla-${months[month - 1]}-${year}.eventbrite.com/?aff=site`
      }

      let sponsorHost = {
        id: generateUniqeId(host),
        name: host.organization,
        logo: host.logo,
        url: host.link
      }

      DATA.sponsors[sponsorHost.id] = sponsorHost
      event.sponsors.push(sponsorHost.id)

      each(speakers, function (speakerKey, speaker) {
        if (speaker.bookedShows === date) event.speakers.push(speakerKey)
      })

      each(sponsors, function (sponsorKey, sponsor) {
        if (sponsor.bookedShows && sponsor.bookedShows.indexOf(date) > -1) {
          event.sponsors.push(sponsorKey)
        }
      })

      each(drinks, function (key, drink) {
        if (drink.bookedShows && drink.bookedShows.indexOf(date) > -1) {
          event.drinkjs = drink
        }
      })

      DATA.events.push(event)
    })

    DATA.events.sort((a, b) => new Date(b.date) - new Date(a.date))
  })
}

function fillHosts (hosts) {
  DATA.hosts = Object.assign(DATA.hosts, hosts)
}

function fillSpeakers (speakers) {
  DATA.speakers = Object.assign(DATA.speakers, speakers)

  each(DATA.speakers, function (sKey, speaker) {
    if (!speaker.avatar) return

    // If the speaker is from the old _data file
    speaker.description = speaker.abstract
    delete speaker.abstract

    speaker.image = speaker.avatar
    delete speaker.avatar

    speaker.video = speaker.youtubeUrl
    delete speaker.youtubeUrl

    speaker.videoimg = speaker.youtubeImageUrl
    delete speaker.youtubeImageUrl
  })
}

function fillSponsors (sponsors) {
  DATA.sponsors = Object.assign(DATA.sponsors, sponsors)

  each(DATA.sponsors, function (sKey, sponsor) {
    if (!sponsor.link) return

    sponsor.url = sponsor.link
    delete sponsor.link
  })
}

function fillPastSponsors () {
  DATA.pastSponsors = []

  each(DATA.events, function (eKey, event) {
    each(event.sponsors, function (sKey, sponsorId) {
      var dSponsor = DATA.sponsors[sponsorId]
      if (!dSponsor) return

      let sponsorFound = false
      each(DATA.pastSponsors, function (sponsor, pSponsor) {
        if (sponsorFound) return

        if (!dSponsor.organization) dSponsor.organization = dSponsor.name
        if (pSponsor.name === dSponsor.organization) sponsorFound = true
      })

      if (sponsorFound) return

      DATA.pastSponsors.push({
        name: dSponsor.organization,
        logo: dSponsor.logo,
        url: dSponsor.url
      })
    })
  })
}

function each (obj, fn) {
  for (let key in obj) { if (obj.hasOwnProperty(key)) fn(key, obj[key]) }
}

function fetchData (creds, cb) {
  auth.login(creds, function (err) {
    if (err) return console.error(err)

    const base = 'https://admin.apps.js.la/api/list'
    const urls = {
      hosts: `${base}/host`,
      sponsors: `${base}/sponsor`,
      speakers: `${base}/speaker`,
      drinks: `${base}/drinksjs`
    }

    map(urls, auth.get.bind(auth), cb)
  })
}

function generateUniqeId (obj) {
  return sha1(JSON.stringify(obj))
}

var months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'november',
  'december'
]
