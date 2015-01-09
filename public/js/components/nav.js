
/*
    nav.js
    ----------------------------------------------------------------------------
        this is mainly here to allow the DOM element to unfocus on "click" or
        to allow IOS webview to behave a lil more like a normal browser.
*/

function attach( selector ) {
    var el = document.querySelector( selector ),
        active = 0,
        state = 0; // start closed

    if ( el ) return;

    function resetActive(){
        active = 0;
    }

    function setBlur(){
        state = 0;
    }

    function onClick( e ) {
       
        e.preventDefault(); // stop this from focusing again
        if ( active ) {
            return;
        }

        active = 1; // set state

        if ( state ) {
            state = 0; 
            el.blur();
        } 
        else {
            state = 1;
            el.focus();
        }

        setTimeout( resetActive, 100 );
    }

    el.addEventListener( 'mousedown', onClick );
    el.addEventListener( 'touchstart', onClick );
    el.addEventListener( 'blur', setBlur );
}

module.exports.attach = attach; 