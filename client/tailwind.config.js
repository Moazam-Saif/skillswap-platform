export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kranky: ['Kranky', 'cursive'],
        lemon: ['Lemon', 'serif'],
        josefin: ['Josefin Sans', 'sans-serif']
      },
      boxShadow: {
        'custom': '0px 2px 2px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
}