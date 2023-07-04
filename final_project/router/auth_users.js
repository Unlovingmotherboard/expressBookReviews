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

  const bookISBN = req.params.isbn;
  const userReview = req.body.userReview;
  const loggedInUserName = req.session.authorization.userName;
  const foundBookReview = books[bookISBN];

  if(!foundBookReview) {
    return res.status(404).json("No book with that ISBN found")
  }

  if (!(books[bookISBN].reviews.reviwer === loggedInUserName)) {
    console.log("Unique review for this book by: " + loggedInUserName)
    books[bookISBN].reviews = { "reviwer": loggedInUserName, "review": userReview }; //Need to fix this. Code is overwritting all reviews
  } else {
    console.log("Updating your review to: " + userReview);
    books[bookISBN].reviews.review = userReview;
  }

  return res.status(300).json(books[bookISBN].reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => { 

  const bookISBN = req.params.isbn;
  const loggedInUserName = req.session.authorization.userName;

  //Code needs to find the review that matches the username and delete just that review
  // You may want to change the way reviews are stored to an array


});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
