/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b1326",
        surface: {
          DEFAULT: "#0b1326",
          low: "#131b2e",
          container: "#171f33",
          high: "#222a3d",
          highest: "#2d3449",
          bright: "#31394d",
          lowest: "#060e20",
        },
        primary: {
          DEFAULT: "#c0c1ff",
          container: "#8083ff",
        },
        secondary: {
          DEFAULT: "#4edea3",
          container: "#00a572",
        },
        tertiary: {
          DEFAULT: "#ffb2b7",
          container: "#ff516a",
        },
        outline: {
          DEFAULT: "#908fa0",
          variant: "#464554",
        },
        'on-surface': "#dae2fd",
        'on-surface-variant': "#c7c4d7",
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(135, 173, 255, 0.1), rgba(189, 130, 255, 0.1))',
        'gradient-primary': 'linear-gradient(to right, #4f46e5, #10b981)',
        'gradient-surface': 'linear-gradient(to bottom right, #131b2e, #0b1326)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
