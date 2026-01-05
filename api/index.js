// نقطة الدخول الرئيسية للـ API
const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const sectionsRoutes = require('./sections');
const apisRoutes = require('./apis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/apis', apisRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MonteDev API is running' });
});

module.exports = app;
