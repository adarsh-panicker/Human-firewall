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
        navy: {
          950: '#070C18',
          900: '#0B132B',
          850: '#0F172A',
          800: '#1E293B',
          750: '#283548',
          700: '#334155',
          600: '#475569',
        },
        cyber: {
          teal: '#14B8A6',
          cyan: '#06B6D4',
          cyanLight: '#22D3EE',
          amber: '#F59E0B',
          coral: '#EF4444',
          violet: '#8B5CF6',
          emerald: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}
