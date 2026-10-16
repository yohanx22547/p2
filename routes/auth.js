const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ensureGuest } = require('../middleware/auth');

// Register Page
router.get('/register', ensureGuest, (req, res) => {
  res.render('register', { error: null });
});

// Register Action
router.post('/register', ensureGuest, async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { error: 'Username already taken' });
    }
    
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    req.session.user = { id: user._id, username: user.username };
    res.redirect('/todos');
  } catch (err) {
    res.render('register', { error: 'An error occurred during registration' });
  }
});

// Login Page
router.get('/login', ensureGuest, (req, res) => {
  res.render('login', { error: null });
});

// Login Action
router.post('/login', ensureGuest, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    req.session.user = { id: user._id, username: user.username };
    res.redirect('/todos');
  } catch (err) {
    res.render('login', { error: 'An error occurred during login' });
  }
});

// Logout Action
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;