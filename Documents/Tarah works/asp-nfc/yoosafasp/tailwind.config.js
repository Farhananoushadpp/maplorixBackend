/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      backgroundImage: (theme) => ({
        "gradient-gray": `linear-gradient(180deg, ${theme(
          "colors.gray.800"
        )} 0%, ${theme("colors.gray.50")} 100%)`,
      }),
      colors: {
        whatsapp: "#25D366",
        primary: {
          50: "#FCEBEE",
          100: "#F8CCD3",
          200: "#F2A9B5",
          300: "#EC8696",
          400: "#E6647A",
          500: "#CC2036", // base
          600: "#B31C30",
          700: "#9A1829",
          800: "#811423",
          900: "#690F1C",
        },
        secondary: {
          50: "#FDE9DE",
          100: "#FBC9B1",
          200: "#F9A884",
          300: "#F68857",
          400: "#F47036",
          500: "#F26722",
          600: "#CF561D",
          700: "#AD4618",
          800: "#8A3713",
          900: "#6A2A0E",
        },
      },
      animation: {
        slideDown: "slideDown 0.5s ease-in-out forwards",
        MenuSlideDown: "MenuSlideDown 0.5s ease-in-out forwards",
      },
      fontSize: {
        "xs-custom": "10px",
      },
      keyframes: {
        slideDown: {
          "0%": {
            transform: "translateY(-100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
};
