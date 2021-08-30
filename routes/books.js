var express = require('express');
var router = express.Router();
const { Book } = require('../models')

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

/* GET books page. */
router.get('/', asyncHandler(async function(req, res, next) {
  const books = await Book.findAll();
  console.log(books)
  res.render('layout', { books, title: "All Books" })
}));

/* GET create new books page. */
router.get('/new', asyncHandler(async function(req, res, next) {
  res.render('new-book', { title: "Create New Book" })
}));

/* POST create new books page. */
router.post('/new', asyncHandler(async function(req, res, next) {
  let book
  try {
    book = await Book.create(req.body)
    res.redirect("/books")
  } catch (err) {
    console.log(err.name)
    if (err.name === "SequelizeValidationError") {
      book = await Book.build(req.body)
      res.render("new-book", { book, errors: err.errors, title: "Create New Book" })
    }
  }
}));

/* GET book detail form page. */
router.get('/:id', asyncHandler(async function(req, res, next) {
  const book = await Book.findByPk(req.params.id)
  console.log(book)
  if (book) {
    res.render('update-book', { book, title: "Book Detail Form" })
  } else {
    res.render('page-not-found', { title: "Page Not Found" })
  }
}));

/* POST book detail form page. */
router.post('/:id', asyncHandler(async function(req, res, next) {
  let book
  try {
    book = await Book.findByPk(req.params.id)
    if (book) {
      await book.update(req.body)
      res.redirect("/books/" + req.params.id)
    } else {
      res.render("error")
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      book = await Book.build(req.body)
      book.id = req.params.id
      res.render("update-book", { book, errors: err.errors, title: "Book Detail Form" })
    }
  }
}));

module.exports = router;
