
const $ = window.jQuery = require('jquery')
const merge = require('merge')
const flickr = require('./flickrphotos')
const hero = require('./components/hero')
const nav = require('./components/nav')

// monkey patch jquery plugins
require('./jquery.fancybox.pack.js')
require('./jquery.fancybox-media.js')

$(function () {
  const $body = $('body')
  const video = document.getElementsByClassName('jsla-hero-video')[0]
  const canvas = document.getElementsByClassName('jsla-hero-canvas')[0]
  const fancyboxOptions = {
    openEffect: 'none',
    closeEffect: 'none',
    beforeShow: function () {
      $body.css({overflowY: 'hidden'})
    },
    afterClose: function () {
      $body.css({overflowY: 'visible'})
    },
    helpers: {
      media: {}
    }
  }

  // attach components
  nav.attach('.jsla-mobile-menu')
  hero.attach(canvas, video)

  flickr.addPhotos() // this starts the script
  $('a[rel^=lightbox-video]').fancybox(merge({}, fancyboxOptions, {
    showNavArrows: false
  }))
  $('a[rel=lightbox]').fancybox(fancyboxOptions)
})
