/* =============================================================================
   REACT ENTRY POINT (main.jsx)
   =============================================================================
   
   This is the first JavaScript file that runs when your React app loads.
   Its only job is to:
   1. Import React and ReactDOM
   2. Import your main App component
   3. Render the App into the HTML page
   
   Think of it as the "ignition key" that starts your React engine.
   ============================================================================= */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // Global styles we defined earlier

// ReactDOM.createRoot() creates a "root" where React will render
// document.getElementById('root') finds the <div id="root"> in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
    // StrictMode helps catch potential problems during development
    // It doesn't affect production builds
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
