import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import LostFound from './pages/LostFound'
import Community from './pages/Community'
import PlacementNews from './pages/PlacementNews'
import Profile from './pages/Profile'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/community" element={<Community />} />
            <Route path="/placement-news" element={<PlacementNews />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App