/* =============================================================================
   HEADER COMPONENT
   =============================================================================
   
   The sticky navigation bar that stays at the top of the screen.
   
   DESIGN NOTES:
   - Minimalist design with just the logo and TU branding
   - Uses glassmorphism for the frosted glass effect
   - position: sticky keeps it visible while scrolling
   
   FRAMER MOTION:
   - motion.header: Animated version of <header>
   - initial/animate: Defines the animation from → to states
   
   ============================================================================= */

import { motion } from 'framer-motion'
import './Header.css'

function Header() {
    return (
        <motion.header
            className="header"
            // Animation: Fade in and slide down from top
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="header-container">
                {/* Left Side: Room 449 Logo */}
                <motion.div
                    className="logo"
                    // Subtle hover animation
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="logo-number">449</span>
                    <span className="logo-text">Maggi Hub</span>
                </motion.div>

                {/* Right Side: Tezpur University Branding */}
                <div className="header-right">
                    <span className="tu-badge">Tezpur University</span>
                </div>
            </div>
        </motion.header>
    )
}

export default Header
