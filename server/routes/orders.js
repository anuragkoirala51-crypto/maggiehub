const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Price mapping
const PRICES = {
    'The Classic Boil': 25,
    'The Lachit Fried': 35
};

// Create new order
// Create new order
router.post('/', async (req, res) => {
    try {
        const { itemType, quantity, roomNumber, specialInstructions, status } = req.body;

        if (!itemType || !quantity || !roomNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const price = (PRICES[itemType] || 0) * quantity;
        const orderData = {
            itemType,
            quantity,
            roomNumber: roomNumber || 'Pending',
            specialInstructions: specialInstructions || '',
            price,
            status: status || 'Pending',
            timestamp: new Date()
        };

        if (req.useMockDB) {
            const newOrder = {
                ...orderData,
                _id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                orderId: Date.now().toString().slice(-6).toUpperCase()
            };
            global.mockOrders.unshift(newOrder);
            return res.status(201).json(newOrder);
        }

        const order = new Order(orderData);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        if (req.useMockDB) {
            return res.json(global.mockOrders);
        }
        const orders = await Order.find().sort({ timestamp: -1 }).limit(100);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get today's orders (for admin)
router.get('/today', async (req, res) => {
    try {
        if (req.useMockDB) {
            return res.json(global.mockOrders);
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const orders = await Order.find({
            timestamp: { $gte: startOfDay }
        }).sort({ timestamp: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Analytics
router.get('/analytics', async (req, res) => {
    try {
        let todayOrders = [];
        if (req.useMockDB) {
            // Exclude "In Cart" from mock analytics
            todayOrders = global.mockOrders.filter(o => o.status !== 'In Cart');
        } else {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            // Exclude "In Cart" from real DB analytics
            todayOrders = await Order.find({
                timestamp: { $gte: startOfDay },
                status: { $ne: 'In Cart' }
            });
        }

        const stats = {
            totalOrders: todayOrders.length,
            totalMaggis: todayOrders.reduce((s, o) => s + (o.quantity || 0), 0),
            totalRevenue: todayOrders.reduce((s, o) => s + (o.price || 0), 0),
            pendingCount: todayOrders.filter(o => o.status === 'Pending').length,
            cookingCount: todayOrders.filter(o => o.status === 'Cooking').length
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update status and details
router.patch('/:id', async (req, res) => {
    try {
        const { status, roomNumber, specialInstructions } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (roomNumber) updateData.roomNumber = roomNumber;
        if (specialInstructions !== undefined) updateData.specialInstructions = specialInstructions;

        if (req.useMockDB) {
            const idx = global.mockOrders.findIndex(o => o._id === req.params.id);
            if (idx === -1) return res.status(404).json({ error: 'Order not found' });

            global.mockOrders[idx] = { ...global.mockOrders[idx], ...updateData };
            return res.json(global.mockOrders[idx]);
        }

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        if (req.useMockDB) {
            global.mockOrders = global.mockOrders.filter(o => o._id !== req.params.id);
            return res.json({ success: true });
        }
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
