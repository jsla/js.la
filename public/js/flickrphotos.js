
exports.addPhotos = function( ) {
    // execute after page has loaded

    var els = document.querySelectorAll( '[data-flickr]' ),
        urls;

    // dont execute if not flickr els are found
    if ( !els.length ) {
        return;
    }

    els = Array.prototype.slice.call( els, 0 ); //normal arrays are better

    urls = els.map( getUrls );
    getJSONP( urls );
};

function getUrls( el ) {
    return el.getAttribute( 'data-flickr' ); // this should have the url in it
}

function createScriptEl( url ) {
    var script = document.createElement( 'script' ),
        id = '_flickr' + ( Math.floor( Math.random() * 5000 ) );
    window[ id ] = handleCallback.bind( null, id, url ); // this is the callback for the api
    script.src = url + '&jsoncallback=' + id;
    return script; 
}

function appendEl( el, parent ) {
    parent = ( 'object' === typeof parent ) ? parent : document.body; 
    parent.appendChild( el );
}

function getJSONP( urls ) {
    var els = urls.map( createScriptEl ); 
    els.forEach( appendEl );
}

function handleCallback( id, url, data ){
    delete window[ id ]; // cleanup
    addToPage( data, document.querySelector( '[data-flickr="' + url + '"]') );
}

function appendPhoto( el, photo ) {

    var link = document.createElement( 'a' ),
        img = document.createElement( 'img' );

    link.rel = 'lightbox';
    link.href = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "z.jpg";
    img.alt = photo.title;
    img.src = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg",

    appendEl( img, link );
    appendEl( link, el );

}

function addToPage( resp, el ) {
    var header = document.createElement( 'h1' ),
        center = document.createElement( 'center' ),
        br = document.createElement( 'br' );

    center.innerText = "Photos";
    // adding header to dom
    appendEl( center, header );
    appendEl( header, el );
    appendEl( br, el );

    resp.photos.photo.forEach( appendPhoto.bind( null, el ) );
}
