import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#f59e0b',
        background: '#f9fafb',
        textPrimary: '#111827',
        textSecondary: '#6b7280',
        cardBg: '#ffffff',
        error: '#dc2626',
      },
    },
  },
  plugins: [],
}
export default config