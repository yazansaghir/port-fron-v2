/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        public: '90rem',
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-bg)',
        foreground: 'var(--color-text)',
        text: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        border: 'var(--color-border)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      transitionDuration: {
        'motion-fast': 'var(--motion-duration-fast)',
        motion: 'var(--motion-duration)',
        'motion-slow': 'var(--motion-duration-slow)',
      },
      transitionTimingFunction: {
        'motion-out': 'var(--motion-ease-out)',
      },
    },
  },
  plugins: [],
};
