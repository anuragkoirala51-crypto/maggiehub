/* =============================================================================
   HERO COMPONENT
   =============================================================================
   
   The "above the fold" section - what users see first before scrolling.
   This is your most important real estate for making a first impression.
   
   DESIGN GOALS:
   - Big, bold headline that creates urgency/desire
   - Moody, appetizing imagery
   - Clear value proposition
   
   ANIMATION STRATEGY:
   - Staggered animations: Elements appear one after another
   - This creates a sense of narrative and guides the eye
   
   ============================================================================= */

import { motion } from 'framer-motion'
import './Hero.css'

function Hero() {
    // Animation variants for staggered children
    // containerVariants controls the parent timing
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                // staggerChildren: delay between each child animation
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }

    // Each child element uses these animation states
    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    }

    return (
        <section className="hero">
            {/* Background decorative elements */}
            <div className="hero-bg">
                <div className="hero-gradient" />
                <div className="hero-pattern" />
            </div>

            <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Status Badge - Shows the kitchen is open */}
                <motion.div className="status-badge" variants={itemVariants}>
                    <span className="status-dot" />
                    <span>Kitchen is Open</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 className="hero-title" variants={itemVariants}>
                    The Best Maggi in
                    <span className="highlight"> Tezpur University</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p className="hero-subtitle" variants={itemVariants}>
                    Room 449 is cooking. What are you craving?
                </motion.p>

                {/* CTA Button - Scrolls to menu */}
                <motion.a
                    href="#menu"
                    className="btn btn-primary hero-cta"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View Menu
                    <span className="cta-arrow">↓</span>
                </motion.a>

                {/* Trust indicators */}
                <motion.div className="hero-stats" variants={itemVariants}>
                    <div className="stat">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Maggis Served</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <span className="stat-number">5 min</span>
                        <span className="stat-label">Avg Delivery</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <span className="stat-number">Lachit</span>
                        <span className="stat-label">Hostel Only</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Hero
