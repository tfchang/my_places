var pictures1 = [
  "https:\/\/igcdn-photos-h-a.akamaihd.net\/hphotos-ak-xap1\/10727283_881418991882143_2120362834_a.jpg",
  "https:\/\/igcdn-photos-f-a.akamaihd.net\/hphotos-ak-xaf1\/10731795_834058619977797_997715626_a.jpg",
  "https:\/\/instagramimages-a.akamaihd.net\/profiles\/profile_601213760_75sq_1396432934.jpg",
  "https:\/\/instagramimages-a.akamaihd.net\/profiles\/profile_1320861116_75sq_1399693279.jpg",
  "https:\/\/igcdn-photos-e-a.akamaihd.net\/hphotos-ak-xfa1\/10413178_1423001777971812_575688056_a.jpg"
];

var pictures2 = [
  "https:\/\/igcdn-photos-f-a.akamaihd.net\/hphotos-ak-xpf1\/10424510_354747108012525_1712622298_a.jpg",
  "https:\/\/instagramimages-a.akamaihd.net\/profiles\/profile_8567719_75sq_1358738028.jpg",
  "https:\/\/igcdn-photos-e-a.akamaihd.net\/hphotos-ak-xap1\/10375495_1441116449474764_1553587804_a.jpg",
  "https:\/\/igcdn-photos-g-a.akamaihd.net\/hphotos-ak-xaf1\/10831905_332352466967430_1761410940_a.jpg"
];

function Slide(img, pictures) {
  this.img = img;
  this.picIndex = 0;
  this.pictures = pictures;
}

Slide.prototype.next = function() {
  this.picIndex += 1;
  this.img.attr('src', this.pictures[this.picIndex]);
  if(this.picIndex < this.pictures.length) {
    setTimeout(function() { this.next() }.bind(this), 2000); 
  }  
}

Slide.prototype.start = function() {
  var picIndex = 0;
  
  setTimeout(function () { this.next() }.bind(this), 2000);
}

$(function() {
  var slide1 = new Slide($('#slide-space-1'), pictures1);
  var slide2 = new Slide($('#slide-space-2'), pictures2);
  slide1.start();
  slide2.start();
});

// <table>
//   <tr>
//     <td><img id="slide-space-1"></td>
//     <td><img id="slide-space-2"></td>
//   </tr>
// </table>