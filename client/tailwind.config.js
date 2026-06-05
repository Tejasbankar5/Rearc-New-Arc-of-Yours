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
        background: '#030305',
        surface: '#0A0A0F',
        surfaceHighlight: '#11111A',
        primary: '#A855F7', // Neon Purple
        primaryDark: '#7E22CE',
        secondary: '#F97316', // Neon Orange
        accent: '#3B82F6', // Blue
        textMain: '#F8FAFC',
        textMuted: '#94A3B8',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        faction: {
          dsa: '#F97316',
          mlops: '#3B82F6',
          mentor: '#A855F7',
          focus: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'], // For the handwriting text
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'beast-gradient': 'linear-gradient(135deg, #A855F7 0%, #F97316 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(16,16,24,0.8) 0%, rgba(10,10,15,0.9) 100%)',
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'core-pulse': 'corePulse 4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 15px rgba(168, 85, 247, 0.3))' },
          '50%': { filter: 'brightness(1.3) drop-shadow(0 0 35px rgba(168, 85, 247, 0.7))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        corePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
