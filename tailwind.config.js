/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f25648',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#666666',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f4f2e9',
          foreground: '#666666',
        },
      }
    },
  },
  plugins: [],
}
