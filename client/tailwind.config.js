// tailwind.config.js
module.exports = {
    darkMode: 'class', // Enables class-based dark mode
    theme: {
      extend: {
        colors: {
          cream: '#FCF7FF',
          accent: '#C5BAC9',
          darkText: '#201A23',
          night: '#000009',
          secondary: '#8E7C93',
        },
        fontFamily: {
          // Optionally include modern fonts from Google Fonts
          // I recommend trying "Inter", "Poppins", or "Roboto" for a modern feel.
          sans: ['Inter', 'system-ui', 'sans-serif'],
          // Provide alternative options if required:
          // sans: ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };

