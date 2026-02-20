export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        serif: ["Zilla Slab", "serif"],
        mono: ["Courier New", "monospace"],
      },
      backgroundImage: (theme) => ({
        "gradient-gray": `linear-gradient(180deg, ${theme(
          "colors.gray.800",
        )} 0%, ${theme("colors.gray.50")} 100%)`,
      }),
      colors: {
        whatsapp: "#25D366",
        primary: {
          50: "#E6E7F4",
          100: "#C0C2E4",
          200: "#9A9DD3",
          300: "#7478C1",
          400: "#4F53AF",
          500: "#2E3192",
          600: "#292C82",
          700: "#22246E",
          800: "#1B1C59",
          900: "#151545",
        },
        secondary: {
          50: "#FCEDE3",
          100: "#F7D1B5",
          200: "#F1B286",
          300: "#EB9357",
          400: "#E57428",
          500: "#E66704",
          600: "#CF5C04",
          700: "#B04E03",
          800: "#8F3F02",
          900: "#733302",
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
