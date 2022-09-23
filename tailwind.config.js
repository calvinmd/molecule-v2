module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    fontSize: {
      sm: ['12px', '23px'],
      base: ['14px', '27px'],
      lg: ['16px', '32px'],
    },
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'black-1': '#25272e',
        'black-2': '#111215',
        'black-3': '#1C1D22',
        'purple-1': '#9C4FFF',
        'red-1': '#DD3A3A',
        'red-2': '#FE4545',
        'red-3': '#EB5757',
        'green-1': '#12A656',
        'beige-1': '#FCFAF6',
        'sidebar-dark': '#0F0B1C',
      },
      backgroundImage: {},
    },
  },
  plugins: [require('flowbite/plugin'), require('tailwind-scrollbar')],
};
