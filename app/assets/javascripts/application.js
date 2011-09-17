// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery_ujs
//= require_tree .

$(document).ready(function() {

  var initialLocation;
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();
  var beer_icon = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-f5c344/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/bar.png";
  var me_icon = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-23b6fa/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/walkingtour.png";

  function setMap() {
    $("#map").height($("body").height()-160);
    $('#map').gmap().gmap('refresh');
    if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        centerAndRefreshMap(initialLocation);
      }, function() {
        handleNoGeolocation(browserSupportFlag);
      });
    // Try Google Gears Geolocation
    } else {
      browserSupportFlag = false;
      handleNoGeolocation(browserSupportFlag);
    }
  }



  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    centerAndRefreshMap(initialLocation);
  }

  function centerAndRefreshMap(coords) {
    //settings the link with the right data
    $("a[href='/beers/search']").attr('href', '/beers/search?lat='+coords.Ka+"&lng="+coords.La);

    $.getJSON( '/beers/search.json', 'lat='+coords.Ka+'&lng='+coords.La, function(data) {
      $.each( data, function(i, m) {
        $('#map').gmap('addMarker', { 'position': new google.maps.LatLng(m.venue_lat, m.venue_lng), 'venue': m.venue_id, 'bounds':true, 'title': m.text, 'icon':new google.maps.MarkerImage(beer_icon) })
        .click(function() {
          $.mobile.changePage( "/beers/venue_details?venue_id="+$(this)[0].venue, { transition: "slideup"} );
        });
      });
    $('#map').gmap('addMarker', { 'position': coords, 'bounds':true, 'title': "me", 'icon':new google.maps.MarkerImage(me_icon) });
    $('#map').gmap({ 'center': coords, "zoom": 14 });
    });
  }




  $('div').live('pagebeforecreate',function(event){
    console.log("apage is being created");
    setMap();
  });

  setMap();
  MBP.scaleFix();

  // Media Queries Polyfill https://github.com/shichuan/mobile-html5-boilerplate/wiki/Media-Queries-Polyfill
  yepnope({
    test : Modernizr.mq('(min-width)'),
    nope : ['js/libs/respond.min.js']
  });

});
