/* =============================================================================
   MENU CARD COMPONENT
   =============================================================================
   
   A glassmorphism card for each Maggi type.
   
   KEY DESIGN ELEMENTS:
   1. Glassmorphism: Frosted glass effect using backdrop-filter
   2. Hover elevation: Card lifts and glows on hover
   3. Fluid expansion: Clicking expands the card to show order options
   
   COMPONENT ARCHITECTURE:
   - Receives menu item data as props (name, price, description, image)
   - Has local state for quantity selection
   - Calls onSelect callback when user wants to order
   
   ============================================================================= */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MenuCard.css'

function MenuCard({ item, onAdd, isExpanded, onExpand, onDeselect }) {
    // Local state for quantity within this card
    const [quantity, setQuantity] = useState(1)

    // Handle quantity changes with min/max bounds
    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, Math.min(10, prev + delta)))
    }

    // When user confirms selection
    const handleAddToOrder = () => {
        onAdd({ ...item, quantity })
        setQuantity(1) // Reset for next time
    }

    return (
        <motion.div
            className={`menu-card ${isExpanded ? 'selected' : ''}`}
            // Layout animation for smooth expand/collapse
            layout
            // Hover effects
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* Card Header - Always visible */}
            <div className="card-header">
                {/* Price Badge */}
                <div className="price-badge">
                    <span className="currency">₹</span>
                    <span className="amount">{item.price}</span>
                </div>

                {/* Maggi Type Label */}
                <div className="item-type">
                    {item.type === 'boiled' ? '🍜' : '🔥'}
                </div>
            </div>

            {/* Card Content */}
            <div className="card-content">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>

                {/* Tags */}
                <div className="item-tags">
                    {item.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Expandable Order Section */}
            <AnimatePresence>
                {isExpanded ? (
                    <motion.div
                        className="order-section"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Quantity Selector */}
                        <div className="quantity-selector">
                            <button
                                className="qty-btn"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                                className="qty-btn"
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= 10}
                            >
                                +
                            </button>
                        </div>

                        {/* Total Price */}
                        <div className="item-total">
                            Total: <span className="total-amount">₹{item.price * quantity}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="card-actions">
                            <button className="btn btn-secondary" onClick={onDeselect}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleAddToOrder}>
                                Add to Order
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        className="select-btn"
                        onClick={onExpand}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Select
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default MenuCard
