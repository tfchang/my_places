var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'My Places' });
});

/* Try to see how elements look */
router.get('/try', function(req, res) {
  res.render('try', { title: 'Look' });
});


module.exports = router;
