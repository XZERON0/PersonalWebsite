/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // алый: не #f00, а тёплый, чуть «горящий» красный
        scarlet: { 300: 'rgb(var(--s300) / <alpha-value>)', 400: 'rgb(var(--s400) / <alpha-value>)', 500: 'rgb(var(--s500) / <alpha-value>)', 600: 'rgb(var(--s600) / <alpha-value>)', 700: 'rgb(var(--s700) / <alpha-value>)', 900: 'rgb(var(--s900) / <alpha-value>)' },
        wine: { 800: '#1d070b', 900: '#120407', 950: '#0d0305' },
        bone: '#fbe9e4',
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        drop: { from: { opacity: 0, transform: 'translateY(-60%) skewY(8deg)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn: { from: { opacity: 0, filter: 'blur(10px)', scale: '1.04' } },
        pulseGlow: { '0%,100%': { opacity: 0.55 }, '50%': { opacity: 1 } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        drop: 'drop .9s cubic-bezier(.2,.9,.2,1) both',
        fade: 'fadeIn 1s ease-out backwards',
        glow: 'pulseGlow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
