import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated from Brand Kit v2
        'navy': '#0E1260',
        'navy-dark': '#080B3A', // Void Navy
        'navy-mid': '#1A2280',  // Royal Navy
        'strike': '#E82030',    // Strike Red
        'strike-deep': '#B81828',
        'ball-pink': '#D42080',
        'ball-purple': '#8B1FA2',
        'bat-blue': '#4A52B8',
        'bat-light': '#6870CC',
        'off-white': '#F4F5FA',
        'gray-mid': '#8A8EBB',
        'gray-dark': '#2E3160',
        // Legacy support if needed, but preferably migrated
        'navy-void': '#080B3A',
        'navy-deep': '#0E1260',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['monospace'],
        title: ['var(--font-wordmark)', 'Anton', 'Impact', 'sans-serif'],
        wordmark: ['var(--font-wordmark)', 'Anton', 'Impact', 'sans-serif'],
        ui: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
