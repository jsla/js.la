var fetchAdmin = require('./fetch-admin')
var extractShow = require('./extract-show')

fetchAdmin(function (err, everything) {
  if (err) return console.error(err)

  printEverything(everything)

  console.log(extractShow(everything))
})

function printEverything (everything) {
  Object.keys(everything).forEach(function (type) {
    console.log('')
    console.log('----------------------------')
    console.log(type)
    console.log('----------------------------')
    var items = everything[type]

    Object.keys(items).forEach(function (id) {
      var item = items[id]
      console.log(item.organization || [item.name, item.title].join(' - '))
    })
  })
}
