const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.username === username && user.password === password) {
      return true; // Credentials match
    }
  }
  return false; // No matching credentials found

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const userName = req.body.username;
  const userPassword = req.body.password;
  const userExists = authenticatedUser(userName, userPassword);

  if (!userName || !userPassword) {
    return res.status(400).json("Password or username not inputed");
  }

  if (!userExists) {
    return res.status(400).json("No user with inputed credentials");
  } else {

    let accessToken = jwt.sign({ data: userPassword }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, userName };

    return res.status(300).json("User logged in and session auth")
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const userReview = req.body.userReview;
  let loggedInUserName = req.session.authorization.userName;
  const bookISBN = req.params.isbn;
  const foundBook = books[bookISBN];

  if(!foundBook) {
    return res.status(404).json("No book with that ISBN found")
  }

  if (!(books[bookISBN].reviews[loggedInUserName] === loggedInUserName)) {
    books[bookISBN].reviews[loggedInUserName] = userReview;
    return res.status(300).json(books[bookISBN]);
  } 

});


regd_users.delete("/auth/review/:isbn", (req, res) => { 
  const bookISBN = req.params.isbn; //Getting the books ISBN from the req params
  const loggedInUserName = req.session.authorization.userName; // Getting the username from the current session 

  if(!books[bookISBN]) {
    return res.status(404).json("No book with that ISBN found");
  }
  // const foundBookReviews = books[bookISBN].reviews;
  if(books[bookISBN].reviews.hasOwnProperty(loggedInUserName)) {
    delete books[bookISBN].reviews[loggedInUserName];
    return res.status(300).json("Deleted the review");
  }
  return res.status(300).json(books[bookISBN]);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
