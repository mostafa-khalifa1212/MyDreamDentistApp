/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#FCF7FF',
          100: '#f5f0f9',
          200: '#e7ddf0',
          300: '#C5BAC9',
          400: '#A499AE',
          500: '#8E7C93',
          600: '#6e5e73',
          700: '#4F4356',
          800: '#342C39',
          900: '#201A23',
          950: '#000009',
        },
      },
      fontFamily: {
        sans: [
          'Helvetica Neue',
          'Helvetica',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
      borderWidth: ['hover', 'focus'],
    },
  },
  plugins: [],
  important: true, // This ensures Tailwind classes take precedence
  corePlugins: {
    preflight: false,
  }
};

