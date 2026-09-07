import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowUp, Sparkles } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [showTop, setShowTop] = useState(false)

  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Lost & Found', href: '/lost-found' },
    { name: 'Community', href: '/community' },
    { name: 'Placements', href: '/placement-news' },
    { name: 'Resume Analyzer', href: '/resume-analyzer' }
  ]

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'FAQ', href: '/faq' }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' }
  ]

  return (
    <footer className="relative overflow-hidden bg-midnight-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
                <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-bold">Campus Buddy</span>
            </div>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-white/55">
              One intelligent companion for campus life — events, community, lost &amp; found,
              placements, and an AI resume coach, brought together in a single product.
            </p>
            <a href="mailto:adhilriju111@gmail.com" className="inline-flex items-center gap-2.5 text-sm text-white/70 transition-colors hover:text-white">
              <Mail className="h-4 w-4 text-brand-400" />
              adhilriju111@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide2 text-white/40">Product</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-white/60 transition-colors duration-200 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide2 text-white/40">Support</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-white/60 transition-colors duration-200 hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social + Newsletter */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <div className="flex items-center gap-5">
            <span className="text-sm text-white/40">Follow us</span>
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-sm items-center gap-2 sm:w-auto">
            <input
              type="email"
              placeholder="you@university.edu"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-brand-400"
            />
            <button type="submit" className="btn-primary flex-shrink-0 !py-2">
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-xs text-white/40">© {currentYear} Campus Buddy. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-xs text-white/40 transition-colors hover:text-white">Privacy Policy</a>
            <a href="/terms" className="text-xs text-white/40 transition-colors hover:text-white">Terms of Service</a>
            <a href="/cookies" className="text-xs text-white/40 transition-colors hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`no-print fixed bottom-8 right-8 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 ${
          showTop ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4.5 w-4.5" />
      </button>
    </footer>
  )
}

export default Footer
