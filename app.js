const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
let sequelize = require('./models').sequelize; //import Sequelize


// Initalize main and book routes
const routes = require('./routes/index');
const books = require('./routes/books');
const { isBuffer } = require('util');

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("404 error handler called")
  const err = new Error;
    err.status = 404;
    err.message = "Oops! The page you requested seems to not exist!"
  res.status(404).render('notFound', {err});
});

// error handler
app.use(function(err, req, res, next) {
  console.log("Global handler called");
  if(err.status === 404) {
    console.log('404 handler called');
    res.status(404).render('notFound', {err});
  } else {
    const status = err.status || 500;
    res.status(status);
    res.render('error', {err});
  }
});



module.exports = app;
