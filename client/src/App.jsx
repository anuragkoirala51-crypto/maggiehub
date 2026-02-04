/* =============================================================================
   APP.JSX - THE MAIN APPLICATION COMPONENT
   =============================================================================
   
   This is the "brain" of your React application. It:
   1. Sets up routing (navigation between pages)
   2. Wraps everything in necessary providers
   3. Defines which component shows on which URL path
   
   REACT ROUTER CONCEPTS:
   - BrowserRouter: Enables URL-based navigation
   - Routes: Container for all your route definitions
   - Route: Maps a URL path to a component
   
   ============================================================================= */

import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import our page components
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'

function App() {
    return (
        // BrowserRouter enables client-side routing
        // This means page changes happen without full page reloads
        <BrowserRouter>
            <Routes>
                {/* 
          Route definitions:
          - path="/" → Shows HomePage (customer ordering page)
          - path="/admin" → Shows AdminPage (kitchen dashboard)
        */}
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
