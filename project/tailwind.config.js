/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        bowling: {
          lane: '#8B4513',
          pin: '#F5F5DC',
          ball: '#1a1a1a',
        }
      },
      animation: {
        'roll': 'roll 2s ease-in-out infinite',
      },
      keyframes: {
        roll: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '50%': { transform: 'translateX(20px) rotate(180deg)' },
        }
      }
    },
  },
  plugins: [],
}