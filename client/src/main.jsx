import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        gutter={10}
        containerStyle={{ top: 88 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#FCFFD7',
            border: '1px solid #1A1A1A',
            borderRadius: '14px',
            padding: '10px 14px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 24px 60px -28px rgba(26, 26, 26, 0.45)',
          },
          success: { iconTheme: { primary: '#F4FFA9', secondary: '#1A1A1A' } },
          error: { iconTheme: { primary: '#F87171', secondary: '#1A1A1A' } },
          loading: { iconTheme: { primary: '#DCD0FF', secondary: '#1A1A1A' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)