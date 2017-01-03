const raf = require('raf')
const fps = 60

module.exports.attach = function attach (canvas, video, parentEl) {
  const context = canvas.getContext('2d')
  const bgCanvas = document.createElement('canvas')
  const bgContext = bgCanvas.getContext('2d')

  video.addEventListener('play', function () {
    const dimensions = getDimensions(parentEl)
    const ogDimensions = getDimensions(video)
    const {width, height} = dimensions
    const {width: ogWidth, height: ogHeight} = ogDimensions
    canvas.width = width
    canvas.height = height
    bgCanvas.width = width
    bgCanvas.height = height
    start(video, context, bgContext, width, height, ogWidth, ogHeight)
  })
}

function getDimensions (el) {
  return {
    width: Math.floor(el.clientWidth),
    height: Math.floor(el.clientHeight)
  }
}

function manipulatePixels (bgContext, width, height) {
  const _data = bgContext.getImageData(0, 0, width, height)
  const data = _data.data
  // // Loop through the pixels, turning them grayscale
  let i = 0
  for (i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const brightness = ((3 * r + 4 * g + b) >>> 3) / 2.55
    data[i] = brightness + 220
    data[i + 1] = brightness + 190
    data[i + 2] = brightness + 0
    // 255, 30, 13
    // black is 0, 0, 0
    // an yellow 241, 214, 34
    // yellow is 245, 221, 61
    // white is 255, 255, 255
  }
  _data.data = data
  // Draw the pixels onto the visible canvas
  return _data
}

function draw (video, context, bgContext, width, height, ogWidth, ogHeight) {
  return function () {
    if (video.paused || video.ended) return
    bgContext.drawImage(video, 0, 0, width, height, 0, 0, ogWidth, ogHeight)
    const pixels = manipulatePixels(bgContext, width, height)
    context.putImageData(pixels, 0, 0)
    setTimeout(function () {
      raf(draw(video, context, bgContext, width, height, ogWidth, ogHeight))
    }, 1000 / fps)
  }
}

function start () {
  draw.apply(null, arguments)()
}
