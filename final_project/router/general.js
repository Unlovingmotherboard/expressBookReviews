const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function isObjEmpty (obj) { return Object.keys(obj).length === 0 } 

const returnAuthorBooks = (books, author) => {
  let matchingBooks = {};

  for (key in books) {
    if (books[key].author === author) {
      matchingBooks[key] = books[key];
    }
  }
  return matchingBooks;
 };

 const returnBooksWithTitle = (books, title) => {
  let matchingBooks = {};

  for (key in books) {
    if (books[key].title === title) {
      matchingBooks[key] = books[key];
    }
  }
  return matchingBooks;
 };

 //Promise functions for our routes --
 const publicRouteGetBooks = (isObjEmpty) => {

  return new Promise((resolve, reject) => {

    if (isObjEmpty === true) {
      reject()
    }
    resolve()
  });
};

const publicRouteGetBookFromISBN = (foundBook) => {
  return new Promise((resolve, reject) => {
    if(!foundBook) {
      reject();
    }
    resolve();
  }); 
};

const publicRouteGetAuthor = (booksByAuthor, isObjEmpty) => {

  return new Promise((resolve, reject) => {

    if(isObjEmpty(booksByAuthor) === true) {
      reject();
    }
    resolve();
  });
};

const publicRouteGetTitle = (booksWithTitle, isObjEmpty) => {

  return new Promise( (resolve, reject) => {
    if(isObjEmpty(booksWithTitle) === true) {
      reject();
    }
     resolve();
  })
}


public_users.post("/register", (req,res) => {
  const userName = req.body.username;
  const userPassword = req.body.password;

  if(!userName || !userPassword) {
    return res.status(400).json("Password or username not inputed");
  }

  if(users.some(user => user.username === userName)) {
    return res.status(400).json("User already exists");
  }

  users.push({ "username": userName, "password": userPassword });

  return res.status(200).json("Succesfully registered!");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  publicRouteGetBooks(isObjEmpty)

  .then(() => {res.status(300).json({books})})
  .catch(() => {res.status(400).json("Error")})
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const bookISBN = req.params.isbn;
  const foundBook = books[bookISBN];

  publicRouteGetBookFromISBN(foundBook)
  .then(() => {res.status(300).json(foundBook)}) 
  .catch(() => {res.status(400).json("Error no book found")})
 });
  
 // Get book details based on Author
public_users.get('/author/:author',function (req, res) {
  const getAuthor = req.params.author;
  const booksByAuthor = returnAuthorBooks(books, getAuthor);

  publicRouteGetAuthor(booksByAuthor, isObjEmpty)
  .then(() => {res.status(300).json(booksByAuthor)})
  .catch(() => {res.status(404).json("No book with that author found")})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const getTitle = req.params.title;
  const booksWithTitle = returnBooksWithTitle(books, getTitle);

  publicRouteGetTitle(booksWithTitle, isObjEmpty)
  .then(() => {res.status(300).json(booksWithTitle)})
  .catch(() => {res.status(404).json("No book with that title found")})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookISBN = req.params.isbn;
  const foundBookReview = books[bookISBN];

  if(!foundBookReview) {
    return res.status(404).json("No book with that ISBN found")
  }

  return res.status(300).json(foundBookReview.reviews);
});

module.exports.general = public_users;
