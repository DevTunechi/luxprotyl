import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        outfit:   ['var(--font-outfit)',   'Outfit',           'sans-serif'],
        mono:     ['var(--font-mono)',     'DM Mono',          'monospace'],
      },
      colors: {
        forest:  { DEFAULT: '#0A1F12', mid: '#122B1C', light: '#1A3D28' },
        burg:    { DEFAULT: '#5C1A28', light: '#7D2438' },
        gold:    { DEFAULT: '#C9943A', light: '#E3B86A', pale: '#F5E6C8' },
        cream:   { DEFAULT: '#F5EDD8', dim: '#E8DCBF' },
      },
      borderRadius: { lg: '12px', xl: '16px', '2xl': '20px' },
      boxShadow: {
        gold:    '0 6px 24px rgba(201,148,58,0.25)',
        'gold-lg':'0 12px 40px rgba(201,148,58,0.35)',
        glass:   '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        shimmer:   'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
