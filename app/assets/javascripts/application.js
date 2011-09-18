// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery_ujs
//= require_tree .

var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

$(document).ready(function() {

  initialLocation = 0;
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();
  var beer_icon = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-f5c344/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/bar.png";
  var green_beer = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-ceeb8e/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/bar.png";
  var normal_beer = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-ffaf4b/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/bar.png";
  var red_beer = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-cc0000/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/bar.png";
  var me_icon = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-23b6fa/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/walkingtour.png";
  var beer_url = "/beers/search";

  function setMap() {
    $('#map').gmap();
    resizeMap();
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

  function updateLinks(coords) {
    $("a[href^='/beers/search']").attr('href', '/beers/search?lat='+coords.Ka+"&lng="+coords.La);
    $("a[href^='/beers/new']").attr('href', '/beers/new?lat='+coords.Ka+"&lng="+coords.La);
    $("a[href^='/beers/venues']").attr('href', '/beers/venues?lat='+coords.Ka+"&lng="+coords.La);
  }

  function centerAndRefreshMap(coords) {
    updateLinks(coords);
    //settings the link with the right data
    $.getJSON( '/beers/search.json', 'lat='+coords.Ka+'&lng='+coords.La, function(data) {
      $.each( data, function(i, m) {
        var icon;
        if (m.score > 4) {icon = green_beer; } else if (m.score > 1) {icon = normal_beer;} else {icon = red_beer;}
        $('#map').gmap('addMarker', { 'position': new google.maps.LatLng(m.venue_lat, m.venue_lng), 'venue': m.venue_id, 'bounds':true, 'title': m.text, 'icon':new google.maps.MarkerImage(icon) })
        .click(function() {
          $.mobile.changePage( "/beers/venue_details?venue_id="+$(this)[0].venue, { transition: "slideup"} );
        });
      });
    $('#map').gmap('addMarker', { 'position': coords, 'bounds':true, 'title': "me", 'icon':new google.maps.MarkerImage(me_icon) });
    $('#map').gmap({ 'center': coords, "zoom": 16 });
    //$("#map").gmap('clearMarkers');
    });
  }

  function resizeMap() {
    var header = $(".ui-page-active div[data-role='header']").height();
    var footer = $(".ui-page-active div[data-role='footer']").height();
    var padding = 70;
    $("#map").height($("body").height()-header-footer-padding);
    $('#map').gmap('refresh');
  }

  $(window).resize(function () {
      waitForFinalEvent(function(){
        console.log("resized");
        resizeMap();
        //...
      }, 500, "some unique string");
  });

  $('div').live('pageshow',function(event, ui){
    console.log('This page was just hidden: '+ ui.prevPage);
    setMap();
  });

  $("a.search-b").live('click', function(e) {
    console.log("starting search");
    var id = $.mobile.activePage[0].id;
    $("#"+id+" div.search-form").fadeToggle(300, function() {
      resizeMap();
    });
    e.preventDefault();
    e.stopPropagation();
  });

  $(".search-form input").keyup(function(event){
    if(event.keyCode == 13){
      var address = $(this).attr("value");
      $.getJSON("http://maps.google.com/maps/geo?q="+ address+"&key=ABQIAAAAl-IUE5-PNzD6MFUfJkhLWBRNx5mSnk_uhqemmKmNua51JBqGEhQyaWZWw4LawrjsczuHejSDYNi-og&sensor=false&output=json&callback=?",
        function(data, textStatus){
          c = data.Placemark[0].Point.coordinates
          initialLocation = new google.maps.LatLng(c[1], c[0]);
          centerAndRefreshMap(initialLocation);
          //data.Placemark[0].Point.coordinates
          //console.log(data);
        });
    }
  });

  if (!$("body.sessions_new").length) {setMap();}
  MBP.scaleFix();

  // Media Queries Polyfill https://github.com/shichuan/mobile-html5-boilerplate/wiki/Media-Queries-Polyfill
  yepnope({
    test : Modernizr.mq('(min-width)'),
    nope : ['js/libs/respond.min.js']
  });

});
