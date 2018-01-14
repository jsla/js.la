require('dotenv').config()

var map = require('map-async')
var Authentic = require('authentic-client')

var creds = {
  email: process.env.AUTHENTIC_EMAIL,
  password: process.env.AUTHENTIC_PASSWORD
}

var auth = Authentic({ server: 'https://authentic.apps.js.la' })

var urls = {
  speakers: 'https://admin.apps.js.la/api/list/speaker',
  sponsors: 'https://admin.apps.js.la/api/list/sponsor',
  hosts: 'https://admin.apps.js.la/api/list/host'
}

module.exports = function fetchAllData (cb) {
  auth.login(creds, function (err) {
    if (err) return cb(err)

    map(urls, auth.get.bind(auth), cb)
  })
}
