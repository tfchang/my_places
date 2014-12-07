// Instagram client_id
const clientID = '587253991bb24378bae6c7f27025c9ae';

// Nine places at most, up to ten pictures for each place
const maxPlace = 9;
const maxPic = 10;
var places = []; 
var pictures = [];

function setPlaces() {
  places[0] = {name: "Metrotown"};
  places[1] = {name: "Chapters (Robson & Howe)"};
  places[2] = {name: "Queen Elizabeth Park"};

  places[0].lat = 49.2279;
  places[1].lat = 49.2822;
  places[2].lat = 49.2431;

  places[0].lng = -122.9993;
  places[1].lng = -123.1209;
  places[2].lng = -123.1110;
};

function getPictures(getStr, placeIndex) {
  $.getJSON(getStr + '&callback=?', function(pics) {
    var numPics = Math.min(maxPic, pics.data.length); 
    for (var i = 0; i < numPics; i++) {    
      pictures[placeIndex][i] = pics.data[i].images.thumbnail.url;
    };

    var img = $('.picture').eq(placeIndex);
    var index = 0;
    var intv = setInterval( function() {
      index ++;
      if (index == numPics - 1) {
        clearInterval(intv);
      };

      img.attr('src', pictures[placeIndex][index]);
      img.fadeIn(1000, function() {
        setTimeout(function() { img.fadeOut(1000); }, 2000);
      });
    }, 4000);
  });  
};

function loadPictures() { 
  var instaURL = 'https://api.instagram.com/v1/media/search?';
  var clientStr = 'client_id=' + clientID;

  for (var pIndex = 0; pIndex < 3; pIndex++) {
    var place = places[pIndex];
    var latlngStr = 'lat=' + String(place.lat) + '&lng=' + String(place.lng) + '&';
    pictures[pIndex] = [];
    getPictures(instaURL + latlngStr + clientStr, pIndex);
  };
};

$(function() {
  setPlaces();
  loadPictures();
});