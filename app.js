var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs')

//Routes files
var api = require('./routes/api');
var public = require('./routes/public')
var admin = require('./routes/admin')

var app = express();

// mongodb connection
var mongoose = require('mongoose')
var config = JSON.parse(fs.readFileSync("config.json"))

user_str = ""

if(!config.mongodb.user == "" && !config.mongodb.pwd == "")
  user_str = config.mongodb.user + ":" + config.mongodb.pwd + "@"

if(config.mongodb.port == "")
config.mongodb.port = 27017

mongoose.connect('mongodb://' + user_str + config.mongodb.hostname + ":" + config.mongodb.port + "/" + config.mongodb.database)
let mongodb_conn = mongoose.connection

// sass support
var sass = require('node-sass-middleware')

app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compressed'
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// cors support
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', public)
app.use('/api', api);
app.use('/admin', admin)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
