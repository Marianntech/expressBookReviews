const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
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

// Task 10: Get all books using async/await with Axios
public_users.get("/async/books", async (req, res) => {
    try {
      // Call the existing endpoint using Axios (async/await)
      const response = await axios.get("http://localhost:5000/");
      return res.status(200).json(response.data);
    } catch (error) {
      // Return a generic error response
      return res.status(500).json({ message: "Error fetching books" });
    }
  });
// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get("/async/isbn/:isbn", async (req, res) => {
    try {
      const isbn = req.params.isbn;
  
      // Call the existing ISBN endpoint
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book not found" });
    }
  });

 // Task 12: Get book details based on Author using async/await with Axios
public_users.get("/async/author/:author", async (req, res) => {
    try {
      const author = req.params.author;
  
      // Call the existing Author endpoint
      const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
  
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Author not found" });
    }
  }); 
  // Task 13: Get book details based on Title using async/await with Axios
public_users.get("/async/title/:title", async (req, res) => {
    try {
      const title = req.params.title;
  
      // Call the existing Title endpoint
      const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
  
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Title not found" });
    }
  });
  
module.exports.general = public_users;
