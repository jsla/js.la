#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
    , lwip = require('lwip')
    , path = require('path')

console.log('script is currently broken due to a bad dependency "lwip"')
process.exit(1)

function print(msg) {
    console.log(msg + '\n')
}

function usage() {
    print('Usage:')
    print('npm run speakerimages -- --imagepath=<path/to/file/name.jpeg>')
}

// main
if (!argv.imagepath) {
    print('Missing script arguments')
    usage()
} else {
    var filePath = path.normalize(__dirname + '/../' + argv.imagepath)
        , pathParts = filePath.split('/')
        // everything but the file name
        , pathBase = pathParts.slice(0, -1)
        , fileName = pathParts.slice(-1)
        , convertPath = path.normalize(pathBase.join('/') + '/' + fileName[0].split('.')[0] + '.jpg')

    // resizes and crops keeping ratio without skewing
    lwip.open(filePath, function(err, image){
        if (err) throw err

        image.batch()
            .cover(160, 160)
            .writeFile(convertPath, { quality: 75 }, function(err) {
                if (err) throw err
                print('Done converting file: ' + convertPath)
            })
    })
}
