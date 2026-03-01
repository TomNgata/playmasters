import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'strike': '#E82030',
        'strike-deep': '#B81828',
        'navy-void': '#05070A',
        'navy-dark': '#0A0E14',
        'navy-deep': '#101620',
        'playgray-mid': '#94A3B8',
        'playgray-dark': '#475569',
        'ball-pink': '#FF3366',
        'bat-blue': '#3366FF',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        title: ['var(--font-title)', 'sans-serif'],
        wordmark: ['var(--font-wordmark)', 'impact', 'sans-serif'],
        ui: ['var(--font-ui)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
