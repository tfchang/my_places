// Instagram client_id
const clientID = '587253991bb24378bae6c7f27025c9ae';

// Nine places at most, up to ten pictures for each place
const maxPlace = 9;
const maxPic = 10;
 
var pictures = [];

var gotPlaces = [];  // getJSON returned objects
var stopPictures = false;
var pictTimeoutIDs = [];
var setRandDefer = $.Deferred(); 

function getPlacePics(getStr, placeIndex) {
  pictures[placeIndex] = [];

  gotPlaces[placeIndex] = $.getJSON(getStr + '&callback=?', function(pics) {
    var numPics = Math.min(maxPic, pics.data.length);

    for (var i = 0; i < numPics; i++) {    
      pictures[placeIndex][i] = pics.data[i].images.thumbnail.url;
    };
  });  
};

function getPictures() { 
  var instaURL = 'https://api.instagram.com/v1/media/search?';
  var clientStr = 'client_id=' + clientID;

  for (var placeIndex = 0; placeIndex < maxPlace; placeIndex++) {
    var place = places[placeIndex];
    var latlngStr = 'lat=' + String(place.lat) + '&lng=' + String(place.lng) + '&';
    getPlacePics(instaURL + latlngStr + clientStr, placeIndex);
  };
};

function showPicture(img_url, picIndex, placeIndex) {
  var img = $('.picture').eq(placeIndex); 
  pictTimeoutIDs[placeIndex] = [];

  pictTimeoutIDs[placeIndex][picIndex] = setTimeout(function() {
    img.attr('src', img_url);
    console.log('fade in/out: ' + String(placeIndex) + ', ' + String(picIndex));
    img.fadeIn(500).delay(3000).fadeOut(500);
  }, picIndex * 4000);
};

function showPlacePics(placeIndex) {
  if (stopPictures) {
    setRandDefer.resolve();
    return; 
  }
  
  gotPlaces[placeIndex].done( function() {
    var placePics = pictures[placeIndex];
    for (var picIndex = 0; picIndex < placePics.length; picIndex++) {    
      showPicture(placePics[picIndex], picIndex, placeIndex);
    };
    
    // Replace pictures in an infinite loop
    setTimeout( function() {
      showPlacePics(placeIndex);
    }, placePics.length * 4000 );
  });
};

function showPictures() { 
  for (var placeIndex = 0; placeIndex < maxPlace; placeIndex++) { 
    showPlacePics(placeIndex);
  };
};

function clearAllTimeouts() {
  for (var placeIndex = 0; placeIndex < maxPlace; placeIndex++) {
    for (var picIndex = 0; picIndex < pictures[placeIndex].length; picIndex++) { 
      clearTimeout(pictTimeoutIDs[placeIndex][picIndex]);
      console.log('clear timeout: ' + String(placeIndex) + ', ' + String(picIndex));
    };
  };
};

function setRandomPics() {
  for (var placeIndex = 0; placeIndex < maxPlace; placeIndex++) { 
    console.log('random: ' + String(placeIndex));

    var placePics = pictures[placeIndex];
    var randPic = Math.floor( Math.random(placePics.length) );
    
    var img = $('.picture').eq(placeIndex);
    img.clearQueue();
    img.attr('src', placePics[randPic]);
    img.slideDown(500);
  };
};

$(function() {
  setPlaces();
  getPictures();
  showPictures();

  $('#btn-stop').on('click', function() { 
    stopPictures = true; 
    clearAllTimeouts();
  });

  setRandDefer.done(setRandomPics);
});