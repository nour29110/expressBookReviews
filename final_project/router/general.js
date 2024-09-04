const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const findIsbn = await books[isbn];
  if (findIsbn) {
    res.send(findIsbn);
  } else {
    res.send("isbn is not matching with the book list");
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const bookList = await Object.values(books);
  const findByAuthor = await bookList.filter((book) => book.author === author);
  if (findByAuthor.length > 0) {
    res.send(findByAuthor);
  } else {
    res.send("Book is not found for this author");
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const bookList = await Object.values(books);
  const findByTitle = await bookList.filter((book) => book.title === title);
  if (findByTitle.length > 0) {
    res.send(findByTitle);
  } else {
    res.send("Book is not found for this title");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const review = books[isbn]?.reviews;
  if (review) {
    res.send(review);
  } else {
    res.send("Review is not found for this isbn");
  }
});

module.exports.general = public_users;
