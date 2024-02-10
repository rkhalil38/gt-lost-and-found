/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
        'mainTheme': '#0e1116',
        'gtGold': '#C29B0C',
        'gtBlue': '#003057',
        'mainHover': '#212733',
        'gtGoldHover': '#A1800A',
      },
    },
    transitionDuration: {
      '200': '200ms',
      '300': '300ms',
      '400': '400ms',
      '500': '500ms',
      '600': '600ms',
      '700': '700ms',
      '800': '800ms',
      
    }
  },
  plugins: [],
};
