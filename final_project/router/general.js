const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
      }
      return res.status(404).json({ message: "Book not found" });
    });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Return all books that match the given author (case-insensitive)
  const requestedAuthor = req.params.author.toLowerCase();

  // Obtain all keys (ISBNs) for the 'books' object
  const isbns = Object.keys(books);

  // Collect matching books
  const matchingBooks = {};

  isbns.forEach((isbn) => {
    const bookAuthor = books[isbn].author.toLowerCase();
    if (bookAuthor === requestedAuthor) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  return res.status(200).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Return all books that match the given title (case-insensitive)
  const requestedTitle = req.params.title.toLowerCase();

  // Obtain all keys (ISBNs) for the 'books' object
  const isbns = Object.keys(books);

  // Collect matching books
  const matchingBooks = {};

  isbns.forEach((isbn) => {
    const bookTitle = books[isbn].title.toLowerCase();
    if (bookTitle === requestedTitle) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  return res.status(200).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 // Return reviews for the given ISBN
 const isbn = req.params.isbn;

 if (books[isbn]) {
   return res.status(200).json(books[isbn].reviews);
 }

 return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
