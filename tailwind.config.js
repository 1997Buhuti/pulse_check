/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0e",
        primary: "#87adff",
        'primary-container': "#6f9fff",
        secondary: "#bd82ff",
        'secondary-container': "#6807ba",
        tertiary: "#ff6a9c",
        'tertiary-container': "#ff0580",
        surface: "#0e0e0e",
        'surface-low': "#131313",
        'surface-container': "#1a1919",
        'surface-high': "#201f1f",
        'surface-bright': "#2c2c2c",
        outline: "#777575",
        'outline-variant': "#494847",
        'on-surface': "#ffffff",
        'on-surface-variant': "#adaaaa",
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(135, 173, 255, 0.1), rgba(189, 130, 255, 0.1))',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
