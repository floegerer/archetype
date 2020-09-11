// Require


if (typeof(project)==='undefined') project = process.argv[2];
if (typeof(process.argv[3])!=='undefined') { envtype = process.argv[3]; }
else { envtype = "development"; }


// Load modules


var express = require('express');
var less = require('less-files');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var readdirp = require('readdirp');
var wrench = require("wrench");
var getfiletree = require("./core/modules/getfiletree");
var getfiles = require("./core/modules/getfiles");
var bowser = require("bowser");


// Globals


global.uxroot = path.normalize(path.resolve('./'));
global.uxproject = uxroot + '/projects/' + project + '/';
global.uxcore = uxroot + '/core/';
global.uxcomponents = uxroot + '/core/components/';
global.getfiles = getfiles;
global.bowser = bowser;


// Variables


var routes = require(uxproject + 'config/routes');
var users = require(uxroot + '/core/routes/users');
var cacheTime = 86400000*7;
var app = express();
if (envtype === "development") { cacheTime = 10; }


// App set


app.set('env', envtype);
app.set('views', uxroot + '/core/templates');
app.set('view engine', 'ejs');


// App use


app.use(favicon(uxproject + 'src/img/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/projects/' + project + '/theme', express.static(uxproject + 'theme',{ maxAge: cacheTime }));
app.use('/projects/' + project + '/components', express.static(uxproject + 'components',{ maxAge: cacheTime }));
app.use(express.static(uxproject + 'src',{ maxAge: cacheTime }));
app.use('/', routes);
app.use('/users', users);


// Catch 404 and forward to error handler


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Dev Error handlers (stacktrace)


if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

}


// Dev Live Reload


if (app.get('env') === 'development') {

  livereload = require('better-livereload');

  server = livereload.createServer({exts: ['less', 'css', 'ejs', 'js'], applyJSLive: true});
  server.watch( uxproject + 'theme');
  server.watch( uxproject + 'src/css');
  server.watch( uxproject + 'src/js');
  server.watch( uxproject + 'pages/');
  server.watch( uxproject + 'components/');
  server.watch( uxproject + 'layout/');
  server.watch( uxcomponents + '');

}


// Production error handler (no stacks)


if (app.get('env') === 'production') {

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

}


// Export module


if (app.get('env') === 'production') {

less.file(uxproject + 'theme/theme.less', uxproject + 'src/css/main.css', function(err, result) {
  console.log("Error: " + err);
})

var server = http.createServer(app);
server.listen(8080);
console.log("Server listening to port 8080");

}


// Filetree test


var pagepath = uxproject + 'pages/';
global.filetree = getfiletree.filetree(pagepath);

var gallerypath = uxproject + 'src/gallery/';
global.images = getfiles.files(gallerypath);


module.exports = app;
