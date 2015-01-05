var places, markers, curMarker;
var map, bounds;

function setPlaces(callback) {
  $('#left-pictures').hide();
  $('#right-pictures').hide();
  $('#right-places').children().hide();

  setMap( function() {
    $('#btn-list-places').on('click', showPlacesTable);
    $('#btn-add-place').on('click', addPlace);
    $('#btn-save-places').on('click', savePlaces);
    $('#btn-delete-place').on('click', deletePlace);

    $('#btn-start-pictures').on('click', function() {
      $('#left-places').hide();
      $('#right-places').hide();
      callback();
    });
  }); // setMap();
}; // setPlaces();

function setMap(callback) {
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

    loadPlaces(myLatLng);
    addSearchBox();
    callback();
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
}; // getCurrentLoc()

function loadPlaces(myLatLng) {
  bounds = new google.maps.LatLngBounds();
  places = JSON.parse(localStorage.getItem('my_places.places')) || [];
  markers = [];
  places.forEach(setMarker);

  if (bounds.isEmpty()) {
    bounds.extend(myLatLng)
  } else {
    map.fitBounds(bounds);
  };

  function setMarker(place, index) {
    var newMarker = new google.maps.Marker({
      map: map,
      title: place.name,
      position: new google.maps.LatLng(place.lat, place.lng)
    });
    markers[index] = newMarker;
    bounds.extend(newMarker.position);
    addInfoWindow(newMarker, place.desc);
  };
}; // loadPlaces()

function addSearchBox() {
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
  }; //setSearchPlace()
}; // addSearchBox()

function showPlacesTable() {
  var tbody = $('#table-places tbody').empty();
  
  function addRow(marker, index) {
    var tr = $('<tr>').appendTo(tbody);
    $('<td>').text(index).appendTo(tr);
    $('<td>').text(marker.title).appendTo(tr);
    $('<td>').text(locStr(marker.position)).appendTo(tr);
  };
  
  markers.forEach(addRow);
  $('#table-places').siblings().hide();
  $('#table-places').show();
}; // showPlacesTable()

function addPlace() {
  $('#form-place').siblings().hide();
  $('#form-place').show();

  $('#place-number').text(places.length);
  $('#input-place-name').val(curMarker.title);
  $('#input-place-location').val(locStr(curMarker.position));
  $('#input-place-desc').val('');

  $('#btn-submit-place').on('click', submitPlace);
  $('#btn-cancel-submit').on('click', function() { $('#form-place').hide(); });
};

function submitPlace() {
  curMarker.title = $('#input-place-name').val();
  markers.push(curMarker);
  var curPlace = { 
    name: curMarker.title,
    lat: curMarker.position.lat(),
    lng: curMarker.position.lng(),
    desc: $('#input-place-desc').val()
  };
  places.push(curPlace);

  addInfoWindow(curMarker, curPlace.desc);
  showPlacesTable();
};

function locStr(latLng) {
  var lat = latLng.lat();
  var lng = latLng.lng();
  return '(' + round4(lat) + ', ' + round4(lng) + ')';
};

function round4(x) {
  return Math.round(x * 10000) / 10000;
};

function addInfoWindow(marker, desc) {
  var infoStr = '<div id="infoContent"> <h3>' + marker.title + '</h3>' +
                '<p>' + desc + '</p> </div>';
  var infoWindow = new google.maps.InfoWindow({ content: infoStr });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map, this);
  });
};

function savePlaces() {
  localStorage.setItem('my_places.places', JSON.stringify(places));
  $('#table-places').hide();
};

function deletePlace() {
  $('#delete-place').siblings().hide();
  $('#delete-place').show();

  $('#btn-submit-delete').on('click', deleteResult);
  $('#btn-cancel-delete').on('click', function() { $('#delete-place').hide(); });
};

function deleteResult() {
  var index = $('#input-place-delete').val();
  var result;

  if (places[index]) {
    result = "Place " + index + ": " + places[index].name + " deleted."
    places.splice(index, 1);
    markers[index].setMap(null);
    markers.splice(index, 1);
  } else {
    result = "Error: Place " + index + " does not exist";
  };

  $('#delete-place').hide();
  $('#delete-result').empty();
  $('<p>').text(result).appendTo('#delete-result');
  $('#delete-result').show();
};