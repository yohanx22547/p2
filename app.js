require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Database Connection 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true })); // Parse Form Data
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); // Supports PUT and DELETE from HTML Forms

// Session Management (Authentication)
app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key_change_in_production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents XSS attacks on cookies
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Global Variables for Templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/todos', require('./routes/todos'));

app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/todos');
  res.redirect('/auth/login');
});

// Route for Interactive Report
app.get('/report', (req, res) => {
  res.render('report');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));