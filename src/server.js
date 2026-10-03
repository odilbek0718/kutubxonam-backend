require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const historyRoutes = require('./routes/history');
const studentRoutes = require('./routes/students');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' })); // 5mb - kitob muqovasi rasm (base64) sig'ishi uchun

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/students', studentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Frontend statik fayllarni uzatish
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// SPA fallback - /api/* dan boshqa barcha yo'llar index.html'ga yo'naltiriladi
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Topilmadi' });
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Umumiy xatolarni ushlash
app.use((err, req, res, next) => {
  console.error('Kutilmagan xato:', err);
  res.status(500).json({ error: 'Server xatosi yuz berdi' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n📚 Kutubxonam server ${PORT}-portda ishga tushdi`);
  console.log(`   Brauzerda oching: http://localhost:${PORT}\n`);
});
