module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your source files
  ],
  theme: {
    extend: {
      screens: {
        'sm' : '640px',
        'xs': '480px',  // Custom breakpoint for extra small screens
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
      fontWeight: {
        extraThick: '950',}
    }, // Extend Tailwind's default theme if needed
  },
  plugins: [],
};
