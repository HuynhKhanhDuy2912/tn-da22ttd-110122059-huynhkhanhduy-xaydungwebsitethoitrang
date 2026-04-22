/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#f6f1ea',
        'brand-surface': '#fffdfa',
        'brand-surface-soft': '#efe5d8',
        'brand-text': '#211c17',
        'brand-muted': '#75675a',
        'brand-line': 'rgba(83, 63, 45, 0.12)',
        'brand-primary': '#7e5a3c',
        'brand-primary-deep': '#5b402a',
        
        // Admin Premium Colors
        'admin-bg': '#f8fafc',
        'admin-sidebar': '#0f172a',
        'admin-card': '#ffffff',
      },
      fontFamily: {
        serif: ['Cambria', 'Cochin', 'Georgia', 'Times', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 22px 50px rgba(69, 48, 32, 0.08)',
      }
    },
  },
  plugins: [],
}

