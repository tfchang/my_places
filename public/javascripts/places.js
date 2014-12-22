var places = [];
var map, curMarker, bounds;

function setPlaces() {
  $('#form-place').hide();
  setMap();

  // places[0] = {name: "Metrotown"};
  // places[1] = {name: "Chapters (Robson & Howe)"};
  // places[2] = {name: "Queen Elizabeth Park"};
  // places[3] = {name: "Stanley Park"};
  // places[4] = {name: "Granville Island"};
  // places[5] = {name: "UBC"};
  // places[6] = {name: "SFU"};
  // places[7] = {name: "Westminster Pier Park"};
  // places[8] = {name: "Aberdeen Centre"};

  // places[0].lat = 49.2279;
  // places[1].lat = 49.2822;
  // places[2].lat = 49.2431;
  // places[3].lat = 49.3075;
  // places[4].lat = 49.2724;
  // places[5].lat = 49.2608;
  // places[6].lat = 49.2783;
  // places[7].lat = 49.2028;
  // places[8].lat = 49.1838;

  // places[0].lng = -122.9993;
  // places[1].lng = -123.1209;
  // places[2].lng = -123.1110;
  // places[3].lng = -123.1412;
  // places[4].lng = -123.1340;
  // places[5].lng = -123.2460;
  // places[6].lng = -122.9199;
  // places[7].lng = -122.9060;
  // places[8].lng = -123.1337;
};

function setMap() {
  function addPlace() {
    console.log('addPlace');

    $('#place-list').hide();
    $('#form-place').show();
    $('#btn-submit-place').show();

    $('#place-number').text(places.length);
    $('#input-place-name').val(curMarker.title);
    $('#input-place-location').val(locStr(curMarker.position));
    $('#input-place-desc').val('');
  };

  function submitPlace() {
    console.log('submitPlace');
    curMarker.title = $('#input-place-name').val();
    places.push(curMarker);

    var infoStr = '<div id="infoContent"> <h3>' + curMarker.title + '</h3>' +
                  '<p>' + $('#input-place-desc').val() + '</p> </div>';
    var infoWindow = new google.maps.InfoWindow({ content: infoStr });

    google.maps.event.addListener(curMarker, 'click', function() {
      infoWindow.open(map, this);
    });

    var tr = $('<tr>').appendTo('#place-list tbody');
    $('<td>').text(places.length - 1).appendTo(tr);
    $('<td>').text(curMarker.title).appendTo(tr);
    $('<td>').text(locStr(curMarker.position)).appendTo(tr);

    $('#form-place').hide();
    $('#btn-submit-place').hide();
    $('#place-list').show();
  };

  // var myLatLng = new google.maps.LatLng(49.2503, -122.9241);
  getCurrentLoc( function(myLat, myLng) {
    var myLatLng = new google.maps.LatLng(myLat, myLng);
    var mapOptions = {
      center: myLatLng,
      zoom: 12
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), 
      mapOptions);

    curMarker = new google.maps.Marker({
      title: 'Current Location',
      map: map,
      position: myLatLng,
      animation: google.maps.Animation.DROP  
    });

    bounds = new google.maps.LatLngBounds();
    bounds.extend(myLatLng);

    $('#map-prompt').text('Current location: ' + locStr(myLatLng) + '.');
    $('#btn-add-place').on('click', addPlace);
    $('#btn-submit-place').on('click', submitPlace);

    addSearchBox();
  });
}; // setMap()

function getCurrentLoc(callback) {
  var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;
    callback(crd.latitude, crd.longitude);
  };

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

function locStr(latLng) {
  var lat = latLng.lat();
  var lng = latLng.lng();
  return '(' + round4(lat) + ', ' + round4(lng) + ')';
};

function round4(x) {
  return Math.round(x * 10000) / 10000;
};

function addSearchBox() {
  console.log('addSearchBox');
  // var input = $('<input id="map-searchbox" type="text" placeholder="Search Box">');
  var input = $('#map-searchbox');
  var searchBox = new google.maps.places.SearchBox(input[0]);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input[0]);

  google.maps.event.addListener(searchBox, 'places_changed', setSearchPlace);

  function setSearchPlace() {
    var searchPlaces = searchBox.getPlaces();
    if (searchPlaces.length == 0)
      return;
  
    var thePlace = searchPlaces[0];
    curMarker = new google.maps.Marker({
      map: map,
      title: thePlace.name,
      position: thePlace.geometry.location
    });

    bounds.extend(curMarker.position);
    map.fitBounds(bounds);
  };
};