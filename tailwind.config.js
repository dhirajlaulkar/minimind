/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neo: {
          sunshine: '#FDE047',
          pink: '#F472B6',
          cyan: '#22D3EE',
          purple: '#A855F7',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'Arial', 'Helvetica', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.02em',
        neo: '0.05em',
      },
      boxShadow: {
        neo: '4px 4px 0 #000000',
        'neo-md': '6px 6px 0 #000000',
        'neo-lg': '8px 8px 0 #000000',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [],
}

