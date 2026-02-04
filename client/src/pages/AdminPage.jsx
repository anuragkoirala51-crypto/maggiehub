/* =============================================================================
   ADMIN PAGE - KITCHEN DASHBOARD
   =============================================================================
   
   The password-protected "Kitchen View" for Room 449 residents.
   
   CORE FEATURES:
   1. Password protection screen
   2. Live order feed (auto-updates)
   3. Status update buttons (Pending → Cooking → Out for Delivery → Delivered)
   4. Daily analytics (Total sold, Today's revenue)
   
   STATE MANAGEMENT:
   - isAuthenticated: Whether the user entered the correct password
   - orders: List of all orders from the database
   - analytics: Summary data for the top header
   
   ============================================================================= */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './AdminPage.css'

function AdminPage() {
    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState(null)

    // Data state
    const [orders, setOrders] = useState([])
    const [analytics, setAnalytics] = useState({ totalOrders: 0, totalRevenue: 0, totalMaggis: 0 })
    const [isLoading, setIsLoading] = useState(false)

    // 1. Password Verification
    const handleLogin = async (e) => {
        e.preventDefault()
        setAuthError(null)

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            const data = await response.json()
            if (data.success) {
                setIsAuthenticated(true)
            } else {
                setAuthError('Access Denied. Wrong Password.')
            }
        } catch (err) {
            setAuthError('Connection error.')
        }
    }

    // 2. Fetch Data (Orders + Analytics)
    const fetchData = async () => {
        if (!isAuthenticated) return

        try {
            const [ordersRes, analyticsRes] = await Promise.all([
                fetch('/api/orders/today'),
                fetch('/api/orders/analytics')
            ])

            const ordersData = await ordersRes.json()
            const analyticsData = await analyticsRes.json()

            setOrders(ordersData)
            setAnalytics(analyticsData)
        } catch (err) {
            console.error('Fetch error:', err)
        }
    }

    // 3. Update Order Status
    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            // Refresh data after update
            fetchData()
        } catch (err) {
            console.error('Update error:', err)
        }
    }

    // 4. Delete Order
    const deleteOrder = async (id) => {
        if (!window.confirm('Delete this order?')) return
        try {
            await fetch(`/api/orders/${id}`, { method: 'DELETE' })
            fetchData()
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    // Poll for new orders every 10 seconds
    useEffect(() => {
        if (isAuthenticated) {
            fetchData()
            const interval = setInterval(fetchData, 10000)
            return () => clearInterval(interval)
        }
    }, [isAuthenticated])

    // --- RENDER PHASES ---

    // LOGIN SCREEN
    if (!isAuthenticated) {
        return (
            <div className="admin-login-page">
                <motion.div
                    className="login-card glass-card"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <h2>Kitchen Dashboard</h2>
                    <p>Room 449 Authorization Required</p>

                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            className="input"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        {authError && <p className="error-text">{authError}</p>}
                        <button className="btn btn-primary">Login</button>
                    </form>
                </motion.div>
            </div>
        )
    }

    // MAIN DASHBOARD
    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="container flex-between">
                    <div className="admin-logo">
                        <span className="gold">449</span> Kitchen
                    </div>

                    {/* Analytics Overview */}
                    <div className="analytics-bar">
                        <div className="analytic-item">
                            <span className="label">Orders</span>
                            <span className="value">{analytics.totalOrders}</span>
                        </div>
                        <div className="analytic-item">
                            <span className="label">Maggis</span>
                            <span className="value">{analytics.totalMaggis}</span>
                        </div>
                        <div className="analytic-item">
                            <span className="label">Revenue</span>
                            <span className="value">₹{analytics.totalRevenue}</span>
                        </div>
                    </div>

                    <button className="btn btn-secondary btn-sm" onClick={() => setIsAuthenticated(false)}>Logout</button>
                </div>
            </header>

            <main className="admin-main container">
                <div className="feed-header">
                    <h2>Live Orders</h2>
                    <span className="live-status">Auto-refreshing every 10s</span>
                </div>

                <div className="order-grid">
                    <AnimatePresence>
                        {orders.length === 0 ? (
                            <p className="no-orders">No orders today. Get cooking! 🍜</p>
                        ) : (
                            orders.map(order => (
                                <motion.div
                                    key={order._id}
                                    className={`admin-order-card glass-card ${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                >
                                    <div className="order-card-header">
                                        <span className="admin-order-id">#{order.orderId}</span>
                                        <div className="status-container">
                                            {order.status === 'In Cart' && <span className="pulse-dot"></span>}
                                            <span className={`badge badge-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-details">
                                        <div className="order-main-info">
                                            <span className="admin-qty">{order.quantity}x</span>
                                            <span className="admin-item">{order.itemType}</span>
                                        </div>
                                        <div className="admin-room">
                                            {order.status === 'In Cart' ? '📝 Choosing...' : `Room ${order.roomNumber}`}
                                        </div>
                                        {order.specialInstructions && (
                                            <div className="admin-note">"{order.specialInstructions}"</div>
                                        )}
                                    </div>

                                    <div className="order-actions">
                                        {order.status === 'In Cart' && (
                                            <button className="btn btn-secondary" disabled>
                                                Waiting for Checkout...
                                            </button>
                                        )}
                                        {order.status === 'Pending' && (
                                            <button className="btn btn-primary" onClick={() => updateStatus(order._id, 'Cooking')}>
                                                Start Cooking
                                            </button>
                                        )}
                                        {order.status === 'Cooking' && (
                                            <button className="btn btn-success" onClick={() => updateStatus(order._id, 'Out for Delivery')}>
                                                Out for Delivery
                                            </button>
                                        )}
                                        {order.status === 'Out for Delivery' && (
                                            <button className="btn btn-delivered" onClick={() => updateStatus(order._id, 'Delivered')}>
                                                Mark Delivered
                                            </button>
                                        )}
                                        {(order.status === 'Delivered' || order.status === 'In Cart') && (
                                            <button className="btn btn-danger" onClick={() => deleteOrder(order._id)}>
                                                {order.status === 'In Cart' ? 'Clear' : 'Archive'}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}

export default AdminPage
