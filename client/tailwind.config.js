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
        // Refined indigo/violet brand accent — replaces flat `blue-600`.
        brand: {
          50: '#f2f1ff',
          100: '#e6e3ff',
          200: '#d0caff',
          300: '#aea3ff',
          400: '#8b78fb',
          500: '#6c53f0',
          600: '#5b3edb',
          700: '#4a30b8',
          800: '#3c2896',
          900: '#302178',
          950: '#1d1350',
        },
        // Deep navy/midnight scale for dark sections and emphasis surfaces.
        midnight: {
          50: '#f4f6fb',
          100: '#e6eaf5',
          200: '#c6cee3',
          300: '#96a3c4',
          400: '#5d6b98',
          500: '#3a4570',
          600: '#262f54',
          700: '#1a2140',
          800: '#111527',
          850: '#0c0f1d',
          900: '#080a15',
          950: '#04050c',
        },
        // Sparing vibrant accent — AI moments, "new"/"live" highlights only.
        glow: {
          300: '#7cf5e0',
          400: '#3fe8cb',
          500: '#14ccae',
          600: '#0aa892',
        },
        // Neutral content surfaces (kept close to slate so existing gray-*
        // usages still read correctly, but tuned slightly cooler/warmer).
        surface: {
          0: '#ffffff',
          50: '#f8f9fc',
          100: '#f1f2f8',
          200: '#e4e6f0',
        },
      },
      boxShadow: {
        // Soft, slightly tinted shadows instead of default flat gray ones.
        soft: '0 1px 2px 0 rgba(18, 21, 45, 0.04), 0 1px 1px 0 rgba(18, 21, 45, 0.03)',
        card: '0 1px 2px rgba(16, 19, 43, 0.04), 0 8px 24px -8px rgba(16, 19, 43, 0.10)',
        'card-hover': '0 4px 10px rgba(16, 19, 43, 0.06), 0 16px 40px -12px rgba(16, 19, 43, 0.18)',
        glow: '0 0 0 1px rgba(108, 83, 240, 0.15), 0 8px 30px -6px rgba(108, 83, 240, 0.35)',
        'inner-line': 'inset 0 0 0 1px rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(60% 50% at 15% 10%, rgba(108,83,240,0.10) 0%, rgba(108,83,240,0) 60%), radial-gradient(50% 40% at 90% 15%, rgba(20,204,174,0.10) 0%, rgba(20,204,174,0) 60%)',
        'mesh-dark': 'radial-gradient(60% 60% at 20% 0%, rgba(108,83,240,0.35) 0%, rgba(108,83,240,0) 60%), radial-gradient(45% 45% at 100% 20%, rgba(20,204,174,0.18) 0%, rgba(20,204,174,0) 60%)',
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
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
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer': 'shimmer 2.4s linear infinite',
        'marquee': 'marquee 32s linear infinite',
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
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
