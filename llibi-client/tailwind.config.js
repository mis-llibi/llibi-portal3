const defaultTheme = require('tailwindcss/defaultTheme')
const withMT = require('@material-tailwind/react/utils/withMT')

module.exports = withMT({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        fontFamily: {
          poppins: ['Poppins'],
        },
      },
      colors: {
        'fav-black': '#424242',
        'fav-subtitle': '#64748b',

        'fav-blue-light': '#2563eb',
        'fav-blue-dark': '#1d4ed8',

        'fav-red-light': '#e11d48',
        'fav-red-dark': '#be123c',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
})
