// Instagram client_id
const clientID = '587253991bb24378bae6c7f27025c9ae';

// Nine places at most, up to ten pictures for each place
const maxPlace = 9;
const maxPic = 10;
 
var pictures = [];

var gotPlaces = [];  // getJSON returned objects
var stopPictures = false;
var pictTimeoutIDs = [];


function getPlacePics(getStr, placeIndex) {
  pictures[placeIndex] = [];

  gotPlaces[placeIndex] = $.getJSON(getStr + '&callback=?', function(pics) {
    var numPics = Math.min(maxPic, pics.data.length);

    for (var i = 0; i < numPics; i++) {
      pictures[placeIndex][i] = {};    
      pictures[placeIndex][i].smallURL = pics.data[i].images.thumbnail.url;
      pictures[placeIndex][i].largeURL = pics.data[i].images.standard_resolution.url;
      pictures[placeIndex][i].instaURL = pics.data[i].link;

      if (pics.data[i].caption) {
        pictures[placeIndex][i].caption = pics.data[i].caption.text;
      };
    };
  });  
};

function getPictures() { 
  var instaURL = 'https://api.instagram.com/v1/media/search?';
  var clientStr = 'client_id=' + clientID;

  for (var placeIndex = 0; placeIndex < places.length; placeIndex++) {
    var place = places[placeIndex];
    var latlngStr = 'lat=' + String(place.lat) + '&lng=' + String(place.lng) + '&';
    getPlacePics(instaURL + latlngStr + clientStr, placeIndex);
  };
};

function SlideShow(placeIndex) {
  this.placeIndex = placeIndex;
  this.img = $('.picture').eq(placeIndex);
  this.pictures = pictures[placeIndex];
};

SlideShow.prototype.start = function() {
  this.picIndex = -1;
  this.next();
};

SlideShow.prototype.next = function() {
  if (stopPictures) {
    this.random();
    return; 
  };

  this.picIndex += 1;
  if (this.picIndex == this.pictures.length) { this.picIndex = 0; };

  this.img.hide();
  this.img.attr('src', this.pictures[this.picIndex].smallURL);
  this.img.data("place-index", this.placeIndex);
  this.img.data("pic-index", this.picIndex);

  this.img.fadeIn(500).delay(3000).fadeOut(500);
  setTimeout(function() { this.next() }.bind(this), 4000);  
};

SlideShow.prototype.random = function() {
  var randPic = Math.floor( Math.random(this.pictures.length) );
  this.img.attr('src', this.pictures[randPic].smallURL);
  this.img.data("place-index", this.placeIndex);
  this.img.data("pic-index", randPic);
  this.img.slideDown(500);
};

function showPlacePics(placeIndex, slideShows) {  
  gotPlaces[placeIndex].done( function() {
    slideShows[placeIndex] = new SlideShow(placeIndex);
    slideShows[placeIndex].start();
  });
};

function showPictures() {
  var slideShows = [];

  for (var placeIndex = 0; placeIndex < places.length; placeIndex++) {
    showPlacePics(placeIndex, slideShows);
  };
};

function openPicInPanel() {
  var placeIndex = $(this).data('place-index');
  var picIndex = $(this).data('pic-index');
  var picObj = pictures[placeIndex][picIndex];
  var picLarge = $('#picture-large');

  picLarge.attr('src', picObj.largeURL);
  $('#picture-panel').find('figcaption').text(picObj.caption);
  $('#link-insta').attr('href', picObj.instaURL);
  $('#picture-panel').show();
};


$(function() {
  // To-Do: Aysnc Control Flow
  // start slideshows after setPlaces finish running
  
  setPlaces( function() {
    $('#left-pictures').show();
    $('#right-pictures').show();
    $('#picture-panel').hide();
    
    getPictures();
    showPictures();

    // Clicking on a picture opens it in the picture panel
    $('.picture').on('click', openPicInPanel);
    $('#hide-panel').on('click', function() { $('#picture-panel').hide(); });

    // Clicking the stop button stop the SlideShows and set random pictures
    $('#btn-stop').on('click', function() { stopPictures = true; });
  });
});