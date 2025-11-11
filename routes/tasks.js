// routes/tasks.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');

const DEMO_USER = 'demo-user';

router.get('/', async (req, res) => {
  try {
    const filter = { userId: DEMO_USER };
    if (req.query.completed !== undefined) filter.completed = req.query.completed === 'true';
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error('GET /api/tasks', err);
    res.status(500).json({ success: false, error: 'Server error while fetching tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    const task = new Task({
      userId: DEMO_USER,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate ? new Date(dueDate) : null
    });
    await task.save();
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    console.error('POST /api/tasks', err);
    res.status(500).json({ success: false, error: 'Server error while creating task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid task id' });
    }
    const allowed = ['title','description','completed','dueDate'];
    const updates = {};
    for (let k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
    if (updates.title) updates.title = updates.title.trim();
    if (updates.description) updates.description = updates.description.trim();
    if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
    const task = await Task.findOneAndUpdate({ _id: id, userId: DEMO_USER }, { $set: updates }, { new: true });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    console.error('PUT /api/tasks/:id', err);
    res.status(500).json({ success: false, error: 'Server error while updating task' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, error: 'Invalid task id' });
    const task = await Task.findOneAndDelete({ _id: id, userId: DEMO_USER });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    console.error('DELETE /api/tasks/:id', err);
    res.status(500).json({ success: false, error: 'Server error while deleting task' });
  }
});

module.exports = router;
