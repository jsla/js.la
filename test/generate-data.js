var fs = require('fs')
var tape = require('tape')
var { fork } = require('child_process')

var testdata = fs.readFileSync(__dirname + '/testdata.json')

tape('do it', function (t) {
  var cp = fork('scripts/generate_data_file.js', {
    silent: true
  })

  var chunks = []

  cp.stdout
    .on('data', chunk => chunks.push(chunk))
    .on('end', () => {
      var data = Buffer.concat(chunks)
      t.equal(data.toString(), testdata.toString())
    })

  t.end()
})
