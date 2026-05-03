/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0EB',
        oatmeal: '#D4C5B2',
        ash: '#8A8A8A',
        charcoal: '#2A2A2A',
        warmblack: '#0F0F0F',
        clay: '#B5634B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
