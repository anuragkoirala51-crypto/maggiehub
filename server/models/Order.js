const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
    enum: ['The Classic Boil', 'The Lachit Fried']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxLength: 200
  },
  status: {
    type: String,
    enum: ['In Cart', 'Pending', 'Cooking', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Virtual for order ID display
orderSchema.virtual('orderId').get(function () {
  return this._id.toString().slice(-6).toUpperCase();
});

orderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
