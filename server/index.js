require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection Fallback Logic
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maggi-hub';
let useMockDB = true; // Default to mock for instant usability

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log('🍜 Connected to MongoDB');
        useMockDB = false; // Successfully connected, switch to real DB
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️ Staying on in-memory Mock Database.');
    });

// Global in-memory storage
global.mockOrders = [];

// Inject mock DB check into routes
app.use((req, res, next) => {
    req.useMockDB = useMockDB;
    next();
});

// Routes
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Room 449 Maggi Hub is running!' });
});

// Admin password verification
app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'room449';

    if (password === adminPassword) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
    console.log(`📦 API: http://localhost:${PORT}/api/orders`);
});
