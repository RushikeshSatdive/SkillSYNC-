/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          50: '#F5F7FA',
          100: '#E9EDF4',
          200: '#CBD4E3',
          300: '#9FAEC6',
          400: '#6B7E9C',
          500: '#46587A',
          600: '#2E3E5C',
          700: '#1E2B44',
          800: '#141E33',
          900: '#0B1220',
          950: '#070B14',
        },
        brand: {
          50: '#EEF0FF',
          100: '#E0E3FF',
          200: '#C6CBFF',
          300: '#A3A9FF',
          400: '#8183FC',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#372FA8',
          900: '#2E2A85',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        teal: {
          50: '#ECFDF7',
          100: '#D0FBEC',
          300: '#6EE7C4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        amberx: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px -12px rgba(16,24,40,.14)',
        card: '0 1px 3px rgba(16,24,40,.06), 0 18px 40px -24px rgba(16,24,40,.24)',
        lift: '0 24px 60px -28px rgba(79,70,229,.45)',
        glow: '0 0 0 1px rgba(99,102,241,.25), 0 18px 50px -20px rgba(99,102,241,.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%,100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-16px) scale(1.02)' },
        },
        dash: {
          to: { strokeDashoffset: '-1000' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(.85)', opacity: '.7' },
          '70%': { transform: 'scale(1.35)', opacity: '0' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(24px,-18px) scale(1.06)' },
          '66%': { transform: 'translate(-18px,14px) scale(.96)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        dash: 'dash 22s linear infinite',
        shimmer: 'shimmer 1.8s infinite',
        'pulse-ring': 'pulseRing 2.6s cubic-bezier(.4,0,.6,1) infinite',
        'fade-up': 'fadeUp .5s cubic-bezier(.16,1,.3,1) both',
        'fade-in': 'fadeIn .35s ease both',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'spin-slow': 'spinSlow 18s linear infinite',
        blob: 'blob 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
