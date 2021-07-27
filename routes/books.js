const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const books = await Book.findAll();
  res.render('books', {books})
});

module.exports = router;
