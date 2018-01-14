var tape = require('tape')
var extractShow = require('../script/extract-show')

var nothing = require('./fixtures/nothing.json')
var everything = require('./fixtures/everything.json')

var tbaShow = require('./fixtures/tba-show.json')
var expectedShow = require('./fixtures/expected-show.json')

tape('should extract show from admin data', function (t) {
  var show = extractShow(everything)

  t.deepEqual(show.date, expectedShow.date, 'date should match expected')
  t.deepEqual(show.datetime, expectedShow.datetime, 'datetime should match expected')
  t.deepEqual(show.host, expectedShow.host, 'host should match expected')
  t.deepEqual(show.sponsors, expectedShow.sponsors, 'sponsors should match expected')
  t.deepEqual(show.speakers[0], expectedShow.speakers[0], 'speakers should match expected')
  t.deepEqual(show.speakers[1], expectedShow.speakers[1], 'speakers should match expected')

  t.end()
})

tape('should extract TBA show from admin data', function (t) {
  var show = extractShow(nothing)

  t.deepEqual(show.date, tbaShow.date, 'date should match expected')
  t.deepEqual(show.datetime, tbaShow.datetime, 'datetime should match expected')

  t.deepEqual(show.host, tbaShow.host, 'host should match expected')
  t.deepEqual(show.sponsors, tbaShow.sponsors, 'sponsors should match expected')
  t.deepEqual(show.speakers[0], tbaShow.speakers[0], 'speakers should match expected')

  t.end()
})
