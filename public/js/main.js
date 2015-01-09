

var $ = window.jQuery = require( 'jquery' ),
<<<<<<< HEAD
    merge = require( 'merge' ),
    flickr = require( './flickrphotos' ),
    hero = require( './components/hero' ),
    nav = require( './components/nav' );
=======
    flickr = require( './flickrphotos' );
>>>>>>> master

// monkey patch jquery plugins
require( './jquery.fancybox.pack.js' );
require( './jquery.fancybox-media.js' );

$(function() {
<<<<<<< HEAD
    var $body = $( 'body' ),
        fancyboxOptions = {
            openEffect  : 'none',
            closeEffect : 'none',
            beforeShow: function(){
                $body.css({ overflowY: 'hidden' })
            },
            afterClose: function(){
                $body.css({ overflowY: 'visible' })
            },
            helpers : {
                media : {}
            }
        };

    // attach components
    nav.attach( '.jsla-mobile-menu' );
    hero.attach( '.jsla-hero' );

    flickr.addPhotos(); // this starts the script
    $( 'a[rel=lightbox-video]' ).fancybox( merge( {}, fancyboxOptions, { 
        showNavArrows: false 
    } ) );
    $('a[rel=lightbox]').fancybox( fancyboxOptions );

});
=======

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
>>>>>>> master
