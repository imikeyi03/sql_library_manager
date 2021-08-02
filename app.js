const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// Initalize main and book routes
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);
app.use('/books', books);


// IIFE to test connection to DB
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }) ();

//Catches 404 errors
app.use(function(req, res, next) {
  const err = new Error;
    err.status = 404;
    err.message = "Oops! Page does not exist!"
  res.status(404).render('page-not-found', {err});
});

//Global error handler
app.use(function(err, req, res, next) {
  if(err.status === 404){
    res.status(404).render('page-not-found', {err});
  } else {
    const status = err.status || 500;
    res.status(status);
    res.render('error', {err});
  }
});




module.exports = app;
