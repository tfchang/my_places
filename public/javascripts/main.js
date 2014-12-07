var pictures = [];

function getPictures() {
  const clientID = '587253991bb24378bae6c7f27025c9ae';
  var instaURL = 'https://api.instagram.com/v1/media/search?';
  var latlngStr = 'lat=49.2279&lng=-122.9993&';
  var clientStr = 'client_id=' + clientID;

  const pic_limit = 10;  
  $.getJSON(instaURL + latlngStr + clientStr + '&callback=?', function(pics) {
    for (var i = 0; i < pic_limit; i++) {
      pictures[i] = pics.data[i].images.thumbnail.url;
    };
    console.log('after for');

    $('.picture').each( function(index, elem) {
      console.log(pictures[index]);
      $(elem).attr('src', pictures[index]);
    });
  });
};

$(function() {
  getPictures();
});