/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // The template's design tokens (see the course design reference).
      colors: {
        page: '#fafafa',
        ink: '#222222',
        chrome: '#181818',
        caption: '#464646',
        meta: '#969595',
        brand: '#de3917',
      },
      boxShadow: {
        card: '0 1px 2px rgba(34,25,25,0.4)',
      },
      fontFamily: {
        sans: ['"PT Sans Narrow"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['Overlock', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
