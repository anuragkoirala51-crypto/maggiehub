/* =============================================================================
   ORDER FORM COMPONENT
   =============================================================================
   
   The checkout form where users enter their room number and submit orders.
   
   KEY FEATURES:
   1. Order summary showing selected items
   2. Room number input (the most crucial field)
   3. Optional special instructions
   4. Animated submit button with loading/success states
   
   STATE MANAGEMENT:
   - Receives orderItems from parent (HomePage)
   - Local state for form fields (roomNumber, instructions)
   - Handles form submission and API calls
   
   ============================================================================= */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './OrderForm.css'

function OrderForm({ orderItems, onRemoveItem, onOrderComplete, onClearOrder }) {
    // Form state
    const [roomNumber, setRoomNumber] = useState('')
    const [specialInstructions, setSpecialInstructions] = useState('')

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState(null)

    // Calculate total price
    const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Form validation
    const isValid = roomNumber.trim().length > 0 && orderItems.length > 0

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isValid) return

        setIsSubmitting(true)
        setError(null)

        try {
            // Update each item from 'In Cart' to 'Pending'
            for (const item of orderItems) {
                const url = item._id ? `/api/orders/${item._id}` : '/api/orders';
                const method = item._id ? 'PATCH' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        itemType: item.name,
                        quantity: item.quantity,
                        roomNumber: roomNumber.trim(),
                        specialInstructions: specialInstructions.trim(),
                        status: 'Pending' // Finalize order
                    })
                })

                if (!response.ok) {
                    throw new Error('Failed to place order')
                }
            }

            // Success!
            setIsSuccess(true)
            onOrderComplete()

            // Reset form after delay
            setTimeout(() => {
                setRoomNumber('')
                setSpecialInstructions('')
                onClearOrder()
            }, 3000)

        } catch (err) {
            setError('Something went wrong. Please try again.')
            console.error('Order error:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // If order was successful, show confirmation
    if (isSuccess) {
        return (
            <motion.div
                className="order-success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <div className="success-icon">✓</div>
                <h3>Order Placed!</h3>
                <p>Your Maggi is being prepared in Room 449</p>
                <p className="room-confirm">Delivering to Room <strong>{roomNumber}</strong></p>

                {/* UPI Payment Section */}
                <div className="payment-section">
                    <p className="payment-label">Pay via UPI</p>
                    <div className="qr-placeholder">
                        {/* Replace with actual QR code */}
                        <div className="qr-code">
                            <span>UPI QR Code</span>
                            <small>Scan to pay ₹{totalPrice}</small>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.form
            className="order-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3 className="form-title">Your Order</h3>

            {/* Order Items Summary */}
            <div className="order-items">
                <AnimatePresence>
                    {orderItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="order-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="item-info">
                                <span className="item-qty">{item.quantity}x</span>
                                <span className="item-name">{item.name}</span>
                            </div>
                            <div className="item-price">₹{item.price * item.quantity}</div>
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => onRemoveItem(index)}
                            >
                                ×
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Total */}
            <div className="order-total">
                <span>Total</span>
                <span className="total-amount">₹{totalPrice}</span>
            </div>

            {/* Room Number Input - MOST IMPORTANT */}
            <div className="input-group">
                <label htmlFor="roomNumber">Room Number *</label>
                <input
                    id="roomNumber"
                    type="text"
                    className="input input-large"
                    placeholder="e.g., 203"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    autoComplete="off"
                />
            </div>

            {/* Special Instructions */}
            <div className="input-group">
                <label htmlFor="instructions">Special Instructions (optional)</label>
                <textarea
                    id="instructions"
                    className="input"
                    placeholder="Extra spicy, no onions, etc."
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                />
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    className="error-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error}
                </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
                type="submit"
                className={`btn btn-primary submit-btn ${isSubmitting ? 'btn-loading' : ''}`}
                disabled={!isValid || isSubmitting}
                whileHover={isValid ? { scale: 1.02 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
            >
                {isSubmitting ? 'Placing Order...' : `Place Order • ₹${totalPrice}`}
            </motion.button>
        </motion.form>
    )
}

export default OrderForm
