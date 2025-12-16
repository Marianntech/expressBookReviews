const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
 // Prefer token from session (set during login), fallback to Authorization header.
 const sessionAuth = req.session && req.session.authorization;
 let token = sessionAuth && sessionAuth.accessToken;

 if (!token && req.headers.authorization) {
   // Expected format: "Bearer <token>"
   const authHeader = req.headers.authorization;
   token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
 }

 if (!token) {
   // No token provided -> user is not authenticated
   return res.status(401).json({ message: "Missing access token" });
 }

 try {
   // Verify JWT signature and validity
   const decoded = jwt.verify(token, "access");

   // Attach decoded token payload for downstream handlers (optional)
   req.user = decoded;

   return next();
 } catch (err) {
   // Invalid/expired token
   return res.status(401).json({ message: "Invalid access token" });
 }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
