var jsonFlickrApi = function(rsp) {
    window.rsp = rsp;
    var s = "";
    // http://farm{id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
    s = "<H1>" + "<center>" + "Photos" + "</h1>" + "</center>" + "<br/>";
    
    for (var i=0; i < rsp.photos.photo.length; i++) {
      photo = rsp.photos.photo[i];
      var t_url = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
      var p_url = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "z.jpg";
    var lightbox = "rel=lightbox"; 
      s +=  '<a href="' + p_url + '" ' + lightbox + '>' + '<img alt="'+ photo.title + '"src="' + t_url + '"/>' + '</a>' ;
    }
    document.writeln(s);
}

jsonFlickr(rsp);
