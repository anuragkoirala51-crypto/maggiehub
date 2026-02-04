import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// =============================================================================
// VITE CONFIGURATION
// =============================================================================
// Vite is a modern build tool that's much faster than Create React App's webpack.
// It uses ES modules for instant hot reload during development.
// =============================================================================

export default defineConfig({
    plugins: [react()],

    // Server configuration for development
    server: {
        port: 3000,  // Frontend runs on port 3000

        // Proxy API requests to our backend server
        // This solves CORS issues during development
        proxy: {
            '/api': {
                target: 'http://localhost:5001',  // Updated to avoid macOS conflict
                changeOrigin: true,
            }
        }
    }
})
