require('dotenv').config()
const _ = require('lodash')

const map = require('map-async')
const Authentic = require('authentic-client')

const findShowDates = require('./show-dates')

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
  fillPastSponsors()
}

function getAllDates ({ hosts, speakers, sponsors, drinks }) {
  const dateStart = '2012-03-01'
  const count = Math.round((Date.now() - new Date(dateStart)) / (30 * 24 * 3600 * 1000)) + 1

  const showDates = findShowDates({
    count,
    dateStart,
    ignoreInvalid: true
  })

  const nextShow = findShowDates({ count: 1 })
  showDates.filter(d => d <= nextShow)

  const shows = showDates.map(function (date) {
    const [year, month] = date.split('-')

    const showHost = _.find(hosts, h => hasDate(h, date))
    const showSponsors = _.filter(sponsors, s => hasDate(s, date))
    const showSpeakers = _.filter(speakers, s => hasDate(s, date))
    const showDrinks = _.find(drinks, d => hasDate(d, date))

    if (!showSpeakers.length) return

    return {
      date: date,
      host: showHost,
      sponsors: showSponsors,
      speakers: showSpeakers,
      drinkjs: showDrinks,
      titoUrl: `https://jsla-${months[month - 1]}-${year}.eventbrite.com/?aff=site`
    }
  }).filter(s => s)

  DATA.events = shows
}

function fillPastSponsors () {
  DATA.pastSponsors = []

  DATA.events.slice().reverse().forEach(function (event) {
    const dHost = event.host
    let hostFound = false

    each(DATA.pastSponsors, function (sponsor, pSponsor) {
      if (hostFound || !dHost) return

      if (pSponsor.organization === dHost.organization) hostFound = true
    })

    if (!hostFound && dHost) {
      DATA.pastSponsors.push({
        organization: dHost.organization,
        logo: dHost.logo,
        link: dHost.link
      })
    }

    event.sponsors.forEach(function (dSponsor) {
      let sponsorFound = false

      each(DATA.pastSponsors, function (sponsor, pSponsor) {
        if (sponsorFound) return

        if (pSponsor.organization === dSponsor.organization) sponsorFound = true
      })

      if (sponsorFound) return

      DATA.pastSponsors.push({
        organization: dSponsor.organization,
        logo: dSponsor.logo,
        link: dSponsor.link
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
  'october',
  'november',
  'december'
]

function hasDate (obj, date) {
  return (obj.bookedShows || '').split('\n').indexOf(date) > -1
}
