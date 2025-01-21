module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your source files
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    }, // Extend Tailwind's default theme if needed
  },
  plugins: [],
};
