const express = require('express');
const router = express.Router();


/* GET home page then redirect to /books view */
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

module.exports = router;
