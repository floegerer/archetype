var express = require('express');
var path = require('path');
var router = express.Router();
var uxroot = path.resolve(__dirname).replace('\\routes','')
var view = uxroot + '/projects/';


var levelthree = RegExp(/^\/([\w\-]+)\/([\w\-]+)\/([\w\-]+)/);
var leveltwo = RegExp(/^\/([\w\-]+)\/([\w\-]+)/);
var levelone = RegExp(/^\/([\w\-]+)/);
var levelbase = '/';


router.get(levelthree, function(req, res, next) {

  global.pagetree = req.params;

  res.render('empty', { page: '/pages/' + pagetree[0] + '/' + pagetree[1] + '/' + pagetree[2] });

});


router.get(leveltwo, function(req, res, next) {

  global.pagetree = req.params;

  res.render('empty', { page: '/pages/' + pagetree[0] + '/' + pagetree[1] });

});


router.get(levelone, function(req, res, next) {

  global.pagetree = req.params;

  res.render('horizontal', { page: '/pages/' + pagetree[0] });

});


router.get(levelbase, function(req, res, next) {

  global.pagetree = req.params;

  res.render('horizontal', { page: '/pages/home' });

});


module.exports = router;
