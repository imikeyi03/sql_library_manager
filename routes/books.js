const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


/* Handler function */
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
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('books', {books})
}));



// GET REQUEST: Display the create new book view
router.get('/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "New Book" });
}));



// GET REQUEST: Display book detail form by primary key
router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  if(book) {
    await book.update(req.body);
    await res.render('update-book', {book, title: `Update Book - ${book.title}`});
  } else {
    const error = new Error(`Looks like the book ID ${req.params.id} doesn't exist in our records`)
    error.status = 404;
    throw error;
  }

}));




// POST REQUEST: Insert newly created book into the database
router.post('/new', asyncHandler(async (req, res, next) => {
  let newBook;

  try {
    newBook = await Book.create(req.body);
    res.redirect('/books');

  } catch (error) {
      if(error.name === 'SequelizeValidationError') {
        console.log(req.body)
        newBook = await Book.build(req.body);
        res.render('new-book', { newBook, errors: error.errors})
      } else {
        throw error;
      }
  }
}));

// POST REQUEST: Update book details in the database
router.post('/:id', asyncHandler(async (req, res) => {
  let updateBook;
  try {
      updateBook = await Book.findByPk(req.params.id);
      if (updateBook) {
          await updateBook.update(req.body);
          res.redirect("/books");
      } else {
          throw error;
      }
   } catch (error) {
       console.log(error.name);
       console.log(req.params.id);
          if(error.name === "SequelizeValidationError") {
              book = await Book.build(req.body);
              book.id = req.params.id;
              res.render(`update-book`, {book, errors: error.errors })
          } else {
              throw error;
          }
      }
}));



// POST REQUEST: Delete book in the database
router.post('/:id/delete', asyncHandler(async (req, res) => {
    
  const deleteBook = await Book.findByPk(req.params.id);
    if(deleteBook) {
      await deleteBook.destroy();
      await res.redirect('/books');
    } else {
        const error = new Error(`Looks like the book ID ${req.params.id} doesn't exist in our records`)
        error.status = 404;
        throw error;
    }
  }));



module.exports = router;
