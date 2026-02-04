/* =============================================================================
   HOME PAGE - MAIN CUSTOMER ORDERING PAGE
   =============================================================================
   
   This is the main page customers see when they visit the app.
   It orchestrates all the components and manages the ordering state.
   
   PAGE STRUCTURE:
   1. Header - Sticky navigation with logo and TU branding
   2. Hero - Eye-catching headline and stats
   3. Menu Section - Glassmorphism cards for each Maggi type
   4. Order Form - Checkout with room number input
   
   STATE MANAGEMENT:
   - orderItems: Array of selected items with quantities
   - selectedCard: Which menu card is currently expanded
   
   This pattern is called "lifting state up" - the parent component
   holds the state that needs to be shared between children.
   
   ============================================================================= */

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Hero from '../components/Hero'
import MenuCard from '../components/MenuCard'
import OrderForm from '../components/OrderForm'
import './HomePage.css'

// Menu data - in production, this could come from an API
const MENU_ITEMS = [
    {
        id: 1,
        name: 'The Classic Boil',
        type: 'boiled',
        price: 25,
        description: 'The OG comfort food. Perfectly boiled noodles in our signature masala water, just like home made it.',
        tags: ['Comfort', 'Classic', 'Quick']
    },
    {
        id: 2,
        name: 'The Lachit Fried',
        type: 'fried',
        price: 35,
        description: 'Elevated street-style Maggi. Tossed with veggies, extra spices, and that perfect char.',
        tags: ['Spicy', 'Loaded', 'Premium']
    }
]

function HomePage() {
    // State for managing orders
    const [orderItems, setOrderItems] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)
    const [orderPlaced, setOrderPlaced] = useState(false)

    // Add item to order
    const handleAddToOrder = async (item) => {
        setOrderItems(prev => [...prev, item])
        setSelectedCard(null) // Collapse the card after adding

        // Proactive: Send "In Cart" notification to server so admin sees it!
        try {
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemType: item.name,
                    quantity: item.quantity,
                    roomNumber: '...', // Placeholder until checkout
                    status: 'In Cart'
                })
            })
        } catch (err) {
            console.error('Failed to notify admin of cart action:', err)
        }
    }

    // Remove item from order
    const handleRemoveItem = (index) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index))
    }

    // Clear entire order
    const handleClearOrder = () => {
        setOrderItems([])
        setOrderPlaced(false)
    }

    // Handle order completion
    const handleOrderComplete = () => {
        setOrderPlaced(true)
    }

    return (
        <div className="home-page">
            <Header />
            <Hero />

            {/* Menu Section */}
            <section id="menu" className="menu-section">
                <div className="container">
                    {/* Section Header */}
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Our Menu</h2>
                        <p>Choose your late-night fuel</p>
                    </motion.div>

                    {/* Menu Grid */}
                    <div className="menu-grid">
                        {MENU_ITEMS.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <MenuCard
                                    item={item}
                                    isExpanded={selectedCard === item.id}
                                    onExpand={() => setSelectedCard(item.id)}
                                    onDeselect={() => setSelectedCard(null)}
                                    onAdd={handleAddToOrder}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Order Section - Only shows when items are in cart */}
            {(orderItems.length > 0 || orderPlaced) && (
                <section id="order" className="order-section">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <OrderForm
                                orderItems={orderItems}
                                onRemoveItem={handleRemoveItem}
                                onOrderComplete={handleOrderComplete}
                                onClearOrder={handleClearOrder}
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>Made with 🍜 in Room 449, Lachit Men's Hostel</p>
                    <p className="footer-sub">Tezpur University • Late Night Fuel Since 2024</p>
                </div>
            </footer>
        </div>
    )
}

export default HomePage
