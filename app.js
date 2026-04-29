require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
app.use(session({
  secret: process.env.SESSION_SECRET || 'preloved-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
 
// global variable untuk semua views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});
 
const router = require('./routes');
app.use('/', router);
 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});