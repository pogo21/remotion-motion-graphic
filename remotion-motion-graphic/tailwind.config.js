/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffd",
          300: "#7cc5fc",
          400: "#36a9f8",
          500: "#0c8ee9",
          600: "#0070c7",
          700: "#0159a1",
          800: "#064c85",
          900: "#0b406f",
        },
      },
    },
  },
  plugins: [],
};
