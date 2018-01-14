var fs = require('fs')
var path = require('path')

var siteData = require('../public/_data.json')
var fetchAdmin = require('./fetch-admin')
var extractShow = require('./extract-show')

fetchAdmin(function (err, everything) {
  if (err) return console.error(err)

  var show = extractShow(everything)
  siteData.current.date = show.date
  siteData.current.datetime = show.datetime
  siteData.current.host = show.host
  siteData.current.speakers = show.speakers
  siteData.current.sponsors = show.sponsors

  var target = path.join(__dirname, '../public/_data.json')
  fs.writeFileSync(target, JSON.stringify(siteData, null, 4))
})
