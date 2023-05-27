var express = require('express');
var connection = require('./dbconfig')
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Temperature monitor' ,message: 'Node.js and Express REST API'});
});

router.get('/test', function(req, res, next) {
  res.render('index', { title: 'test' ,message: 'Node.js and Express REST API'});
});



module.exports = router;

