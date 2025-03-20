/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  darkMode: ['class'],
  content: [
    './resources/**/*.edge',
    './resources/**/*.{js,ts,jsx,tsx,vue}',
    './inertia/**/*.{js,ts,jsx,tsx,vue}',
    './app/mails/templates/**/*.tsx',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: {
        'DEFAULT': '1rem',
        'sm': '1rem',
        '2xl': '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        climate: ['Climate Crisis', 'sans-serif'],
        garanti: ['Gantari', 'sans-serif'],
      },
      colors: {
        'brand-blue': {
          50: '#BADDF5',
          100: '#95CAEF',
          200: '#7ABCEB',
          300: '#5FAFE7',
          400: '#48A4E3',
          500: '#2B95DE',
          600: '#237BB8',
          700: '#1D6698',
          800: '#154C72',
          900: '#0E324C',
          950: '#05141E',
        },
        'brand-beige': {
          50: '#F3F2EC',
          100: '#E7E5DA',
          200: '#E0DCCE',
          300: '#D7D2C1',
          400: '#CEC8B3',
          500: '#C5BEA6',
          600: '#AEA893',
          700: '#95917F',
          800: '#7C796B',
          900: '#646357',
          950: '#46443F',
        },
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'primary': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'secondary': {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'destructive': {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'muted': {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'accent': {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'popover': {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'card': {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
