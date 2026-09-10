/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#F3F4F1',
        surface: '#FFFFFF',
        border: {
          DEFAULT: '#DDDEDA',
          strong: '#C6C8C1',
        },
        brand: {
          DEFAULT: '#23261F',
          secondary: '#62655C',
          muted: '#9A9C93',
        },
        orionBlue: {
          bg: '#E6F1FB',
          text: '#0C447C',
          border: '#85B7EB',
        },
        orionAmber: {
          bg: '#FAEEDA',
          text: '#854F0B',
          border: '#EF9F27',
        },
        orionGreen: {
          bg: '#EAF3DE',
          text: '#27500A',
          border: '#97C459',
        },
        orionRed: {
          bg: '#FCEBEB',
          text: '#791F1F',
          border: '#F09595',
        },
      },
      borderRadius: {
        app: '12px',
        card: '8px',
      },
    },
  },
  plugins: [],
}
