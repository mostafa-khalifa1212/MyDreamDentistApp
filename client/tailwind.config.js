/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196F3',
          dark: '#1976D2',
          light: '#64B5F6'
        },
        secondary: {
          DEFAULT: '#64B5F6',
          dark: '#42A5F5',
          light: '#90CAF9'
        },
        accent: {
          DEFAULT: '#03A9F4',
          dark: '#0288D1',
          light: '#4FC3F7'
        },
        success: '#4CAF50',
        warning: '#FFC107',
        danger: '#F44336',
        light: '#F5F5F5',
        dark: '#333333'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        content: ['Roboto', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '8px'
      }
    },
  },
  plugins: [],
  // Add this to make Tailwind work alongside your existing CSS
  corePlugins: {
    preflight: false,
  },
}