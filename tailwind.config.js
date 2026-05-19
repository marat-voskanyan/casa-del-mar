const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#E8ECF0',
          100: '#C5CDD7',
          200: '#9FAEBD',
          300: '#7990A3',
          400: '#5E7889',
          500: '#3D5A72',
          600: '#2C4560',
          700: '#1A3349',
          800: '#122535',
          900: '#0D1F2D',
          DEFAULT: '#0D1F2D',
        },
        sand: {
          50:  '#FDFAF5',
          100: '#FAF5EC',
          200: '#F2EBD9',
          300: '#E8D9BF',
          400: '#D9C4A0',
          500: '#C9AD80',
          600: '#B09262',
          700: '#8F7449',
          800: '#6E5734',
          900: '#4D3A21',
          DEFAULT: '#F2EBD9',
        },
        gold: {
          50:  '#FBF6E8',
          100: '#F5E9C2',
          200: '#EDD68A',
          300: '#DFB94A',
          400: '#D4A030',
          500: '#C9A84C',
          600: '#B08C30',
          700: '#8F701F',
          800: '#6E5412',
          900: '#4D3A08',
          DEFAULT: '#C9A84C',
        },
        cream: '#F2EBD9',
        dark: '#1A1A2E',
      },
      fontFamily: {
        serif:  ['var(--font-playfair)', ...fontFamily.serif],
        sans:   ['var(--font-inter)', ...fontFamily.sans],
        accent: ['var(--font-montserrat)', ...fontFamily.sans],
      },
      boxShadow: {
        'card':       '0 2px 20px rgba(13,31,45,0.07)',
        'card-hover': '0 12px 40px rgba(13,31,45,0.15)',
        'gold':       '0 4px 24px rgba(201,168,76,0.25)',
        'nav':        '0 8px 32px rgba(13,31,45,0.3)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'hero-pulse': {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)' },
          '33%':      { transform: 'scale(1.05) translate(2%, -2%)' },
          '66%':      { transform: 'scale(0.97) translate(-1%, 1%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-20px) rotate(3deg)' },
          '66%':      { transform: 'translateY(-10px) rotate(-2deg)' },
        },
        'count-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':      'fade-up 0.7s ease forwards',
        'fade-in':      'fade-in 0.5s ease forwards',
        'fade-up-d1':   'fade-up 0.7s 0.15s ease forwards',
        'fade-up-d2':   'fade-up 0.7s 0.30s ease forwards',
        'fade-up-d3':   'fade-up 0.7s 0.45s ease forwards',
        'fade-up-d4':   'fade-up 0.7s 0.60s ease forwards',
        'hero-pulse':   'hero-pulse 18s ease-in-out infinite',
        float:          'float 8s ease-in-out infinite',
        'float-slow':   'float 12s ease-in-out infinite',
        'count-up':     'count-up 0.6s ease forwards',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
