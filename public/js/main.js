

var $ = window.jQuery = require( 'jquery' ),
    flickr = require( './flickrphotos' );

// monkey patch jquery plugins
require( './jquery.fancybox.pack.js' );
require( './jquery.fancybox-media.js' );

$(function() {

    flickr.addPhotos(); // this starts the script

    $(".various").fancybox({
            maxWidth  : 1000,
            maxHeight : 800,
            fitToView : false,
            width   : '70%',
            height    : '70%',
            autoSize  : false,
            closeClick  : false,
            openEffect  : 'none',
            closeEffect : 'none'
    });

    $('.fancybox-media').fancybox({
        openEffect  : 'none',
        closeEffect : 'none',
        helpers : {
            media : {}
        }
    });

    $('a[rel=lightbox]').fancybox()
});