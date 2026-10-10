/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '13': '3.25rem',
      },
      fontFamily: {
        // Body copy — highly readable, neutral.
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Editorial display face for headings/statements — distinct from the
        // generic "Inter everywhere" look the redesign is fixing.
        display: ['"Sora"', '"Inter"', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        /* ------------------------------------------------------------------
           Campus Buddy design system. Source of truth for the palette:
             brand-primary      #1A1A1A  ink — text, dark surfaces, primary buttons
             brand-accent       #FCFFD7  cream — page + light surfaces
             brand-lilac        #DCD0FF  secondary buttons, AI accents, selection
             neutral-background #FCFFD7  app background
             surface-highlight  #F4FFA9  lime — active states, key highlights
           The numeric scales below are tonal variations of those five colors
           so existing utility classes (midnight-*, brand-*, glow-*, surface-*)
           resolve to the new identity instead of the old indigo/navy/teal.
           ------------------------------------------------------------------ */

        // Ink scale — warm neutrals built from #1A1A1A, tuned to sit on cream.
        midnight: {
          50: '#F6F8E6',
          100: '#ECEFD6',
          200: '#DCDFC4',
          300: '#BDBFA8',
          400: '#76786C',
          500: '#5C5D55',
          600: '#46473F',
          700: '#33342F',
          800: '#252523',
          850: '#1F1F1E',
          900: '#1A1A1A',
          950: '#111111',
        },
        // Lilac scale — #DCD0FF sits at 200. Deep shades exist only for text
        // that must stay readable on cream/lilac surfaces.
        brand: {
          primary: '#1A1A1A',
          accent: '#FCFFD7',
          lilac: '#DCD0FF',
          50: '#F7F4FF',
          100: '#EEE8FF',
          200: '#DCD0FF',
          300: '#C8B8FB',
          400: '#AE98F0',
          500: '#8F75DC',
          600: '#6F56BE',
          700: '#563F9C',
          800: '#41307A',
          900: '#2E2257',
          950: '#1D1538',
        },
        // Lime scale — #F4FFA9 sits at 400. 600/700 are dark olive tones used
        // only for small text on light surfaces where lime would be illegible.
        glow: {
          200: '#FAFFD9',
          300: '#F8FFC6',
          400: '#F4FFA9',
          500: '#E8F57E',
          600: '#5B6600',
          700: '#454D00',
        },
        // Cream surfaces. 50 is the page; 0 is the slightly lifted card paper.
        surface: {
          0: '#FFFFF4',
          50: '#FCFFD7',
          100: '#F5F8C9',
          200: '#EBEEBB',
          highlight: '#F4FFA9',
        },
        neutral: {
          background: '#FCFFD7',
        },
      },
      boxShadow: {
        // Flat, editorial surfaces: separation comes from borders, shadows are
        // reserved for floating layers (menus, modals, toasts).
        soft: '0 1px 0 0 rgba(26, 26, 26, 0.04)',
        card: '0 1px 0 0 rgba(26, 26, 26, 0.04)',
        'card-hover': '0 18px 40px -24px rgba(26, 26, 26, 0.35)',
        float: '0 24px 60px -28px rgba(26, 26, 26, 0.45)',
        glow: '0 0 0 0 rgba(0, 0, 0, 0)',
        'inner-line': 'inset 0 0 0 1px rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        // Fine dot grid instead of the old purple/teal mesh gradients.
        'mesh-light': 'radial-gradient(rgba(26,26,26,0.07) 1px, transparent 1px)',
        'mesh-dark': 'radial-gradient(rgba(252,255,215,0.08) 1px, transparent 1px)',
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        dots: '22px 22px',
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter: '-0.03em',
        wide2: '0.14em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer': 'shimmer 2.4s linear infinite',
        // Marquee animations live in index.css (.animate-marquee /
        // .animate-marquee-reverse) so they can carry hover + reduced-motion rules.
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
