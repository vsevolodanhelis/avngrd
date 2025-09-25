import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Ukrainian Banking Color Scheme
        bank: {
          bg: '#ececec',
          'bg-light': '#f5f5f5',
          'bg-dark': '#d0d0d0',
          white: '#ffffff',
          text: '#646464',
          'text-light': '#8a8a8a',
          yellow: '#ffd700',
          'yellow-dark': '#e6c200',
        },
      },
      fontFamily: {
        sans: ['Nunito Sans', 'Century Gothic', 'Futura', 'Avenir', 'Helvetica Neue', 'sans-serif'],
        century: ['Nunito Sans', 'Century Gothic', 'Futura', 'Avenir', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      spacing: {
        '12': '3rem',
        '6': '1.5rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
