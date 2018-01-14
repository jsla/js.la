var tape = require('tape')
var findShowDates = require('../script/find-show-dates')

tape('should find correct dates for when this test was written', function (t) {
  var timeStart = '2018-01-14T00:00:00.000Z'

  var expected = [ '2018-01-25', '2018-02-22', '2018-03-29', '2018-04-26',
    '2018-05-31', '2018-06-28', '2018-07-26', '2018-08-30', '2018-09-27',
    '2018-10-25', '2019-01-31', '2019-02-28' ]

  var dates = findShowDates(12, timeStart)

  t.deepEqual(dates, expected, 'show dates should match')

  t.end()
})

tape('should find correct dates for flying cars', function (t) {
  var flyingCars = '3000-01-14T00:00:00.000Z'

  var expected = [ '3000-01-30', '3000-02-27', '3000-03-27', '3000-04-24',
    '3000-05-29', '3000-06-26', '3000-07-31', '3000-08-28', '3000-09-25',
    '3000-10-30', '3001-01-29', '3001-02-26' ]

  var dates = findShowDates(12, flyingCars)

  t.deepEqual(dates, expected, 'show dates should match')

  t.end()
})
