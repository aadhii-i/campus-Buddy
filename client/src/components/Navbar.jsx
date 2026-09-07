import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, LogIn, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'Lost & Found', href: '/lost-found' },
  { name: 'Community', href: '/community' },
  { name: 'Placements', href: '/placement-news' },
  { name: 'Resume AI', href: '/resume-analyzer' },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, logout, showLoginModal, openLoginModal, closeLoginModal } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-3 pt-3 sm:px-4">
        <nav
          className={`w-full max-w-6xl rounded-2xl border transition-all duration-300 ${
            scrolled
              ? 'border-midnight-100 bg-white/80 shadow-card backdrop-blur-xl'
              : 'border-transparent bg-white/40 backdrop-blur-md'
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow transition-transform duration-300 group-hover:-rotate-6">
                <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-[1.05rem] font-bold tracking-tight text-midnight-900">
                Campus Buddy
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAVIGATION.map((item) => {
                const active = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                      active ? 'text-brand-700' : 'text-midnight-500 hover:text-midnight-900'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-brand-50"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-midnight-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-midnight-700">{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    aria-label="Log out"
                    title="Log out"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-midnight-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={openLoginModal} className="btn-primary !py-2">
                  <LogIn className="h-4 w-4" />
                  Log in
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-midnight-600 transition-colors hover:bg-midnight-50 lg:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden lg:hidden"
              >
                <div className="space-y-1 border-t border-midnight-100 px-3 pb-4 pt-3">
                  {NAVIGATION.map((item) => {
                    const active = location.pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                          active ? 'bg-brand-50 text-brand-700' : 'text-midnight-600 hover:bg-midnight-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )
                  })}

                  <div className="mt-2 border-t border-midnight-100 pt-3">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-midnight-600 hover:bg-midnight-50"
                        >
                          <User className="h-4 w-4" /> Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" /> Log out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          openLoginModal()
                          setIsMenuOpen(false)
                        }}
                        className="btn-primary w-full !py-2.5"
                      >
                        <LogIn className="h-4 w-4" /> Log in
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  )
}

export default Navbar
