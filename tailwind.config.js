/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yt: {
          red: '#7C3AED',
          'red-dark': '#6D28D9',
          'red-hover': '#5B21B6',
          bg: '#ffffff',
          'bg-dark': '#0f0f0f',
          card: '#f9f9f9',
          'card-dark': '#272727',
          'hover': '#f2f2f2',
          'hover-dark': '#3f3f3f',
          border: '#e5e5e5',
          'border-dark': '#303030',
          text: '#0f0f0f',
          'text-dark': '#f1f1f1',
          'text-secondary': '#606060',
          'text-secondary-dark': '#aaaaaa',
          'blue': '#3ea6ff',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite linear',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
