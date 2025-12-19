const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if the username does NOT already exist
  return users.findIndex((user) => user.username === username) === -1;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match the stored records
  return users.some((user) => user.username === username && user.password === password);
}
// Register a new user
regd_users.post("/register", (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;
  
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username is available
    if (!isValid(username)) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    // Register the user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
//only registered users can login
regd_users.post("/login", (req,res) => {
  // Read username and password from request body
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate user credentials
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT access token
  const accessToken = jwt.sign(
    { username },
    "access",
    { expiresIn: "1h" }
  );

  // Save token in session (required for /customer/auth/* routes)
  req.session.authorization = { accessToken, username };

  return res.status(200).json({
    message: "Login successful",
    token: accessToken
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // ISBN from route params
  const isbn = req.params.isbn;

  // Review text from query string: /auth/review/:isbn?review=...
  const review = req.query.review;

  // Username stored in session during login
  const sessionAuth = req.session && req.session.authorization;
  const username = sessionAuth && sessionAuth.username;

  // Validate login/session
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Validate input
  if (!review) {
    return res.status(400).json({ message: "Review query parameter is required" });
  }

  // Validate book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure reviews object exists
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review for this username
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});
// Delete a book review (logged-in users can delete only their own reviews)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // ISBN from route params
    const isbn = req.params.isbn;
  
    // Username stored in session during login
    const sessionAuth = req.session && req.session.authorization;
    const username = sessionAuth && sessionAuth.username;
  
    // Validate login/session
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    // Validate book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Validate reviews exist
    if (!books[isbn].reviews || typeof books[isbn].reviews !== "object") {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  
    // Validate user has a review to delete
    if (!(username in books[isbn].reviews)) {
      return res.status(404).json({ message: "No review found for this user" });
    }
  
    // Delete only the logged-in user's review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
