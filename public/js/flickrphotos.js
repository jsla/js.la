
// this gets called to find all elements with data-flickr
exports.addPhotos = function( callback ) {
    // execute after page has loaded
    callback = callback || function noop() {};
    var els = document.querySelectorAll( '[data-flickr]' ),
        urls;

    // dont execute if not flickr els are found
    if ( !els.length ) {

        callback( new Error( 'No [data-flickr] targets found' ), true );


        return;
    }

    els = Array.prototype.slice.call( els, 0 ); //normal arrays are better

    // makes an array of urls
    urls = els.map( getUrls );
    getJSONP( urls, callback );

};

function getUrls( el ) {
    return el.getAttribute( 'data-flickr' ); // this should have the url in it
}

var createScriptEl =
module.exports.createScriptEl = function ( url, callback ) {
    var script = document.createElement( 'script' ),
        id = '_flickr' + ( Math.floor( Math.random() * 5000 ) );
    window[ id ] = typeof callback === 'function' ? 
        callback.bind( null, id, url ) : handleCallback.bind( null, id, url ); // this is the callback for the api
    script.src = url + '&jsoncallback=' + id;
    return script; 
}

function appendEl( el, parent ) {
    parent = ( 'object' === typeof parent ) ? parent : document.body; 
    parent.appendChild( el );
}

function getJSONP( urls, callback ) {
    // maps a bunch of script tags { DOM node Object } into an array
    // each on links to a JSONP endpoint with a unique id
    var els = urls.map( createScriptEl ); 
    // appends script tags
    els.forEach( appendEl );
    callback( null, true );
}

function handleCallback( id, url, data ){
    delete window[ id ]; // cleanup
    // finds the data-flickr el, and appends data to it
    addToPage( data, document.querySelector( '[data-flickr="' + url + '"]') );
}

function appendPhoto( el, photo ) {

    var link = document.createElement( 'a' ),
        img = document.createElement( 'img' );

    link.rel = 'lightbox';
    link.href = getPhotoLink( photo );
    link.setAttribute( 'style', 'background-image: url(' + getPhotoSRC( photo ) + ')' )
    appendEl( link, el );

}

var getPhotoLink =
module.exports.getPhotoLink = function( photo ) {
    return "https://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "z.jpg";
}

var getPhotoSRC =
module.exports.getPhotoSRC = function( photo ) {
    return "https://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
}

function addToPage( resp, el ) {
    // each photo
    resp.photos.photo.forEach( appendPhoto.bind( null, el ) );
}
