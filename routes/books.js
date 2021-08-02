const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}


// GET REQUEST: Retrieve all books and display them using the books view
router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  res.render('books', {books})
}));


// GET REQUEST: Display the create new book view
router.get('/new', asyncHandler(async (req, res, next) => {
  res.render('new-book', { book: {}, title: "New Book" });
}));

// POST REQUEST: Insert newly created book into the database
router.post('/new', asyncHandler(async (req, res, next) => {
  let newBook;

  try {
    newBook = await Book.create(req.body);
    await res.redirect('/books');

  } catch (error) {
      if(error.name === 'SequelizeValidationError') {
        console.log(req.body)
        newBook = await Book.build(req.body);
        res.render('new-book', {newBook, errors: error.errors})
      } else {
        throw error;
      }
  }
}));


// GET REQUEST: Display book detail form by primary key
router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  if(book) {
    await book.update(req.body);
    res.render('update-book', {book, title: `Update Book - ${book.title}`});
  } else {
    const error = new Error(`Looks like the book ID ${req.params.id} doesn't exist in our records`)
    error.status = 404;
    throw error;
  }

}));


module.exports = router;
