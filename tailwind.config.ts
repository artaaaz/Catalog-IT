import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          50: '#f0f7fc',
          100: '#e0eff8',
          200: '#bae0f3',
          300: '#7ec6ea',
          400: '#3ba7de',
          500: '#128ece',
          600: '#0068A5', // Primary Pertamina / NR Blue (#0068A5)
          700: '#005487',
          800: '#034770',
          900: '#083c5e',
          950: '#05263f',
        },
        nr: {
          blue: '#0068A5',
          red: '#E52131',
          green: '#ABBC32',
          lightBlue: '#EAF5FA',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        sidebar: '4px 0 18px rgba(0, 0, 0, 0.05)',
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        card: '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -2px rgba(0, 0, 0, 0.03)',
        elevated: '0 10px 25px -5px rgba(0, 104, 165, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        search: '0 2px 10px rgba(0, 104, 165, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
