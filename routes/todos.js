const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { ensureAuth } = require('../middleware/auth');

router.use(ensureAuth); // Protect all routes in this file

// 1. READ: Get all todos for logged-in user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.session.user.id }).sort({ createdAt: -1 });
    res.render('index', { todos });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 2. CREATE: Add a new todo
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') return res.redirect('/todos');

  try {
    await Todo.create({
      title: title.trim(),
      user: req.session.user.id
    });
    res.redirect('/todos');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 3. UPDATE: Toggle status / Edit title
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.id || req.params.id, user: req.session.user.id });
    if (!todo) return res.status(404).send('Task not found');

    if (req.body.title !== undefined) {
      todo.title = req.body.title.trim();
    }
    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed === 'true' || req.body.completed === true;
    }

    await todo.save();
    res.redirect('/todos');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 4. DELETE: Remove todo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
    res.redirect('/todos');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;