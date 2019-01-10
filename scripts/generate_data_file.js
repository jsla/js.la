const Authentic = require('authentic-client')
const fs = require('fs')

const auth = Authentic({
  server: 'https://authentic.apps.js.la/'
})

const creds = {
  email: process.env.AUTHENTIC_EMAIL,
  password: process.env.AUTHENTIC_PASSWORD
}

let DATA = JSON.parse(fs.readFileSync('scripts/data_not_on_server.json', 'utf8'))

function generateUniqeId () {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 28; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

auth.login(creds, function (err) {
  if (err) return console.error(err)

  const url = 'https://admin.apps.js.la/api/list/'
  auth.get(url + 'host', function (err, hosts) {
    if (err) throw err
    auth.get(url + 'sponsor', function (err, sponsors) {
      if (err) throw err
      auth.get(url + 'speaker', function (err, speakers) {
        if (err) throw err
        // Get all dates
        for (let hostKey in hosts) {
          if (hosts.hasOwnProperty(hostKey) && hosts[hostKey].bookedShows) {
            if (hosts[hostKey].bookedShows.length > 10) {
              hosts[hostKey].bookedShows = hosts[hostKey].bookedShows.split('\n')
            } else {
              hosts[hostKey].bookedShows = [hosts[hostKey].bookedShows]
            }
            for (let ij = 0; ij < hosts[hostKey].bookedShows.length; ij++) {
              let date = hosts[hostKey].bookedShows[ij]
              let event = {
                host: hostKey,
                date: date,
                speakers: [],
                sponsors: [],
                titoUrl: 'https://jsla.eventbrite.com/?aff=site'
              }
              let sponsorHost = {
                id: generateUniqeId(),
                name: hosts[hostKey].organization,
                logo: hosts[hostKey].logo,
                url: hosts[hostKey].link
              }

              DATA.sponsors[sponsorHost.id] = sponsorHost
              event.sponsors.push(sponsorHost.id)

              for (let speakerKey in speakers) {
                if (speakers.hasOwnProperty(speakerKey)) {
                  if (speakers[speakerKey].bookedShows === date) {
                    event.speakers.push(speakerKey)
                  }
                }
              }
              for (let sponsorKey in sponsors) {
                if (sponsors.hasOwnProperty(sponsorKey)) {
                  if (sponsors[sponsorKey].bookedShows &&
                        sponsors[sponsorKey].bookedShows.indexOf(date) !== -1) {
                    event.sponsors.push(sponsorKey)
                  }
                }
              }
              DATA.events.push(event)
              DATA.events.sort(function (a, b) {
                return new Date(b.date) - new Date(a.date)
              })
            }
          }
        }

        // Fill info about dates
        DATA.hosts = Object.assign(DATA.hosts, hosts)
        DATA.speakers = Object.assign(DATA.speakers, speakers)
        for (let sKey in DATA.speakers) {
          if (DATA.speakers.hasOwnProperty(sKey)) {
            if (DATA.speakers[sKey]['avatar']) { // If the speaker is from the old _data file
              delete Object.assign(DATA.speakers[sKey],
                { description: DATA.speakers[sKey]['abstract'] })['abstract']
              delete Object.assign(DATA.speakers[sKey],
                { image: DATA.speakers[sKey]['avatar'] })['avatar']
              delete Object.assign(DATA.speakers[sKey],
                { video: DATA.speakers[sKey]['youtubeUrl'] })['youtubeUrl']
              delete Object.assign(DATA.speakers[sKey],
                { videoimg: DATA.speakers[sKey]['youtubeImageUrl'] })['youtubeImageUrl']
            }
          }
        }
        DATA.sponsors = Object.assign(DATA.sponsors, sponsors)
        for (let sKey in DATA.sponsors) {
          if (DATA.sponsors.hasOwnProperty(sKey)) {
            if (DATA.sponsors[sKey]['link']) {
              delete Object.assign(DATA.sponsors[sKey],
                { url: DATA.sponsors[sKey]['link'] })['link']
            }
          }
        }
        DATA.pastSponsors = []
        for (let eKey in DATA.events) {
          if (DATA.events.hasOwnProperty(eKey)) {
            for (let sKey in DATA.events[eKey]['sponsors']) {
              let sponsorFound = false
              let sponsorId = DATA.events[eKey]['sponsors'][sKey]
              for (let sponsor in DATA.pastSponsors) {
                if (!DATA.sponsors[sponsorId]['organization']) { DATA.sponsors[sponsorId]['organization'] = DATA.sponsors[sponsorId]['name'] }
                if (DATA.sponsors[sponsorId] && DATA.pastSponsors[sponsor]['name'] === DATA.sponsors[sponsorId]['organization']) {
                  sponsorFound = true
                  break
                }
              }
              if (DATA.sponsors[sponsorId] && !sponsorFound) {
                DATA.pastSponsors.push({
                  name: DATA.sponsors[sponsorId]['organization'],
                  logo: DATA.sponsors[sponsorId]['logo'],
                  url: DATA.sponsors[sponsorId]['url']
                })
              }
            }
          }
        }
        fs.writeFile('public/_data.json', JSON.stringify(DATA, null, 2), function (err) {
          if (err) {
            return console.log(err)
          }
          console.log('The file was saved!')
        })
      })
    })
  })
})
