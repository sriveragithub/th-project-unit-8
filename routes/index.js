var express = require('express');
var router = express.Router();
const { Book } = require('../models')

/* GET home page. */
router.get('/', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('/books')
});

/* GET books page. */
router.get('/books', async function(req, res, next) {
  const books = await Book.findAll();
  console.log(books)
  res.render('layout', { books, title: "All Books" })
});

/* GET create new books page. */
router.get('/books/new', async function(req, res, next) {
  res.render('new-book', { title: "Create New Book" })
});

/* POST create new books page. */
router.post('/books/new', async function(req, res, next) {
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
});

module.exports = router;
