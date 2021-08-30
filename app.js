var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

const db = require('./models/index')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');
    await db.sequelize.sync();
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();


app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = new Error()
  error.status = 404
  error.message = "404 Error: Page Not Found"
  next(error);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.error = err
  if(!err.status) {
    err.status = 500
    err.message = "500 Error: Internal Server Error."

    console.log(err.status, err.message)

    res.render('error', { err, title: "Page Not Found" })
  } else {
    console.log(err.status, err.message)

    res.status(err.status || 500);
    res.render('page-not-found', {err, title: "Page Not Found" });
  }
});

module.exports = app;
