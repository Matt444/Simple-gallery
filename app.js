var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.db, {useNewUrlParser: true});

var indexRouter = require('./routes/index');
var configurationRouter = require('./routes/configuration');
var apiRouter = require('./routes/api');
var addImagesRouter = require('./routes/add_images');
var editImagesRouter = require('./routes/edit_images');
var instructionRouter = require('./routes/instruction');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("db connect");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
  res.locals.path = req.path;
  next();
});

app.use('/', indexRouter);
app.use('/configuration', configurationRouter);
app.use('/api', apiRouter);
app.use('/add_images', addImagesRouter);
app.use('/edit_images', editImagesRouter);
app.use('/instruction', instructionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
