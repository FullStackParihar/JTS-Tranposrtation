module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your source files
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'xs': '480px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        raleway: ['Raleway', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        barlow: ['Barlow Condensed', 'sans-serif'],
      },
      animation: {
        fadeInLeft: 'fadeInLeft 0.8s ease-in-out forwards',
      },
      keyframes: {
        fadeInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      fontWeight: {
        extraThick: '950',
      }
    }, // Extend Tailwind's default theme if needed
  },
  plugins: [],
};
