// src/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');


// NOTE: require from src -> routes inside src
const tasksRouter = require('../routes/tasks'); // ← use ./routes/tasks if tasks.js is under src/routes

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/lifehub')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Connection error:', err));

app.use(cors());
app.use(express.json());

// Provide an /api root so GET /api responds
app.get('/api', (req, res) => {
  res.json({ ok: true, message: 'LifeHub API root. Try /api/health or /api/tasks' });
});

app.use('/api/tasks', tasksRouter); // tasksRouter handles routes under /api/tasks

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 LifeHub server running at http://localhost:${PORT}`);
});
