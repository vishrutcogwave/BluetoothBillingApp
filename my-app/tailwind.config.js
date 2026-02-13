/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",    // small phones
        md: "768px",    // tablets (portrait)
        lg: "1024px",   // laptops / small kiosks
        xl: "1280px",   // larger kiosks / desktop screens
        kiosk: "1920px" // full HD large kiosk / 22"+ screens
      },
    },
  },
  plugins: [],
}
