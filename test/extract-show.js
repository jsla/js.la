var tape = require('tape')
var extractShow = require('../script/extract-show')

var everything = require('./fixtures/everything.json')
var expectedShow = require('./fixtures/expected-show.json')

tape('should extract show from admin data', function (t) {
  var show = extractShow(everything)

  t.deepEqual(show.date, expectedShow.date, 'date should match expected')
  t.deepEqual(show.datetime, expectedShow.datetime, 'datetime should match expected')
  t.deepEqual(show.host, expectedShow.host, 'host should match expected')
  t.deepEqual(show.sponsors, expectedShow.sponsors, 'sponsors should match expected')
  t.deepEqual(show.speakers[1], expectedShow.speakers[1], 'speakers should match expected')

  t.end()
})
