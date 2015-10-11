/*
  Generates Individual Events As Well as Individual Speaker pages
*/

const path = require('path')
const fs = require('fs')
const eventsDir = path.resolve(process.cwd(), './public/events')
const baseFile = fs.readFileSync(path.resolve(eventsDir, './_base.jade'), 'utf8')
const outputFile = require('output-file')

console.log(path.resolve(eventsDir, './_base.jade'))

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

function eachSubDir(file) {
  const events = getEventData(file[0])
  events.forEach(function(event, index){
    const subdirPath = path.resolve(file[0], getEventPathName(event))
    const baseEventFile = baseFile.split('@year').join(file[1]).split('@index').join(index)
    // console.log(baseEventFile)
    outputFile(path.resolve(subdirPath, 'index.jade'), baseEventFile, function(err, res) {
      console.log(arguments)
    })
    // console.log(subdirPath)
  })

}


getSubdirs(eventsDir, function (err, subDirs) {
  if (err) throw err

  subDirs.forEach(eachSubDir)
  // console.log(subDirs.map(getEventData))

})
