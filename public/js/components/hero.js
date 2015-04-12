
var flickr = require( '../flickrphotos' ),
    EventEmitter = require( 'eventemitter2').EventEmitter2,
    bus = new EventEmitter(),
    $ = require( 'jquery' ),
    raf = require( 'raf' )

module.exports.attach = function( selector ) {
    var hero = document.querySelector( selector );

    // check for support
    if ( !('backgroundBlendMode' in document.body.style) ){
        setTimeout( bus.emit.bind( bus, new Error('not supported') ), 0 )
        return bus
    }

    if ( hero ) {
        getPhotos( hero )
        bus.once( 'hero:nextPhoto', canScrollAnimation )
        bus.once( 'hero:handlePhotos', addPhotos.bind( null, hero ) )
    }

    return bus
}

function addPhotos( el, resp ) {
    var styles = window.getComputedStyle( el, null ),
        background = styles.backgroundImage.split( 'url(' ).pop( ).split( ')' ).shift()

    cyclePhotos( el, {
        style: getStyle.bind( null, background ),
        photos: resp.photos.photo,
        timeout: 10000
    } )
}

function getStyle( background, photo ) {
    return 'background-image: url(' + background + '), url(' + flickr.getPhotoLink( photo ) + ');'
}

function loadImage( url, callback ) {
    var img = document.createElement( 'img' );

    function done( err ) {
        callback( err, img );
    }

    img.addEventListener( 'load', done.bind( null, null ) )
    img.addEventListener( 'error', done )

    img.src = url;
}

function cyclePhotos( el, options ) {
    var current = 0,
        photos = options.photos

    function setTimer( err, img ) {
        setTimeout( next.bind( null, err, img ) , options.timer || 3000 )
    }

    function next( err, img ) {

        if ( err ) return bus.emit( 'error', err ); // if an error occurs stop

        if ( img.naturalWidth < img.naturalHeight ) { // filter portrait photos
            photos.splice( current, 1 )
            // should update array now this is the next photo
            if ( current === photos.length ) { // this can happen here
                current = 0
            }

            loadImage( flickr.getPhotoLink( photos[ current ] ), next )
            return;
        }

        var style = options.style( photos[ current ] )
        el.setAttribute( 'style', style );

        bus.emit( 'hero:nextPhoto', photos[ current ] )

        current++

        if ( current === photos.length ) {
            current = 0
        }

        loadImage( flickr.getPhotoLink( photos[ current ] ), function( err, img ){
            raf( setTimer.bind( null, err, img ) );
        } )
    }

    loadImage( flickr.getPhotoLink( photos[ 0 ] ), next );

}

function handlePhotos( id, url, resp ) {
    bus.emit( 'hero:handlePhotos', resp )
}


function getPhotos( el ) {
    var url = el.getAttribute( 'data-photos' ),
        script = flickr.createScriptEl( url, handlePhotos )

    bus.emit( 'hero:getPhotos' )
    document.body.appendChild( script )
}

function canScrollAnimation() {
    var $html = $('body'),
        currentPostion = $html.scrollTop();

    if (window.location.hash || currentPostion) {
        return;
    }

    $html
        .animate({
            scrollTop: '20px'
        },500)
        .animate({
            scrollTop: '0px'
        },300)
}
