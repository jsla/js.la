/*
  Generates Individual Events As Well as Individual Speaker pages
*/

const path = require('path')
const fs = require('fs')
const eventsDir = path.resolve(process.cwd(), './public/events')
const baseFile = fs.readFileSync(path.resolve(eventsDir, './_base_event.jade'), 'utf8')
const baseSpeakerFile = fs.readFileSync(path.resolve(eventsDir, './_base_speaker.jade'), 'utf8')
const outputFile = require('output-file')

function getSubdirs (dir, callback) {
  fs.readdir(eventsDir, function (err, files) {
    if (err) throw err
    const subDirs = files.map(mapFullPath(dir)).filter(onlyDirs)
    callback(null, subDirs)
  })
}

function onlyDirs (file) {
  return fs.statSync(file[0]).isDirectory()
}

function mapFullPath (baseDir) {
  return function(file, index) {
    return [path.resolve(baseDir, file), file, index]
  }
}

function getEventData (dir) {
  const dataFile = path.resolve(dir, '_data.json')
  const data = require(dataFile)
  return data ? data.events : []
}

// generate a path name based off event date
function getEventPathName (event) {
  const segments = event.datetime.split(',')
  segments.pop()
  return segments
    .join('')
    .toLowerCase()
    .split(/thursday|tuesday/) // there is one tuesday event
    .pop()
    .trim()
    .split(' ')
    .join('-')
}

function getSpeakerNamePath (speaker) {
  return speaker.name
    .split(',')
    .shift()
    .split(/\'|\./)
    .join('')
    .split(/\s|\//)
    .join('-')
    .toLowerCase()
}

function eachSpeaker (eventPath, eventIndex, year, done) {
  return function (speaker, index) {
    const subdirPath = path.resolve(eventPath, getSpeakerNamePath(speaker))
    const _baseSpeakerFile = baseSpeakerFile
      .split('@year')
      .join(year)
      .split('@eventIndex')
      .join(eventIndex)
      .split('@index')
      .join(index)
    outputFile(path.resolve(subdirPath, 'index.jade'), _baseSpeakerFile, done)
  }
}

function eachSubDir (callback) {
  return function (file) {
    const events = getEventData(file[0])
    const amount = events.length
    var amountDone = 0

    function done () {
      amountDone++
      if (amount === amountDone) {
        callback()
      }
    }

    events.forEach(function(event, index){
      const subdirPath = path.resolve(file[0], getEventPathName(event))
      const baseEventFile = baseFile
        .split('@year')
        .join(file[1])
        .split('@index')
        .join(index)

      event.speakers.forEach(eachSpeaker(subdirPath, index, file[1], function(){}))
      outputFile(path.resolve(subdirPath, 'index.jade'), baseEventFile, done)
    })
  }

}


getSubdirs(eventsDir, function (err, subDirs) {
  if (err) throw err
  const amount = subDirs.length
  var doneAmount = 0

  function done () {
    doneAmount++
    if (doneAmount === amount) {
      console.log('Done!')
    }
  }

  subDirs.forEach(eachSubDir(done))
})
