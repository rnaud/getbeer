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
  $("a[href='/beers/search']").attr('href', '/beers/search?lat='+coords.Ka+"&lng="+coords.La)
    $('#map').gmap({ 'center': coords });
    console.log(coords);
    $.getJSON( '/beers/search.json', 'lat='+coords.Ka+'&lng='+coords.La, function(data) {
      console.log(data);
      $.each( data, function(i, m) {
        $('#map').gmap('addMarker', { 'position': new google.maps.LatLng(m.venue_lat, m.venue_lng), 'venue': m.venue_id, 'bounds':true, 'title': m.text, 'icon':new google.maps.MarkerImage('http://google-maps-icons.googlecode.com/files/music-rock.png') })
        .click(function() {
          console.log($(this));
          $.mobile.changePage( "/beers/venue_details?venue_id="+$(this)[0].venue, { transition: "slideup"} );
            //map.panTo( $(this).get(0).getPosition());
            //$(clone).dialog({ 'modal': true, 'width': 530, 'title': m.text, 'resizable': false, 'draggable': false });
            //$('#map').gmap('displayStreetView', 'streetview{0}'.replace('{0}', index), { 'position': $(this).get(0).getPosition() });
        });

      });
    });
  }

  $('#map').gmap({ 'center': '42.345573,-71.098326', 'zoom': 16 }).bind('init', function(evt, map) {

  });


  MBP.scaleFix();

  // Media Queries Polyfill https://github.com/shichuan/mobile-html5-boilerplate/wiki/Media-Queries-Polyfill
  yepnope({
    test : Modernizr.mq('(min-width)'),
    nope : ['js/libs/respond.min.js']
  });

});
