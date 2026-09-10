/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#15161C',
        canvas: '#15161C',
        sidebar: '#15161C',
        primary: '#7C5CFC',
        accent: '#7C5CFC',
        'accent-purple': '#7C5CFC',
        secondary: '#2ED47A',
        'accent-green': '#2ED47A',
        success: '#2ED47A',
        teal: '#1CC7C2',
        'accent-teal': '#1CC7C2',
      },
    },
  },
  plugins: [],
}

