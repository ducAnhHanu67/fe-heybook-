import { defineConfig } from 'tailwindcss'
import lineClamp from '@tailwindcss/line-clamp'

export default defineConfig({
  darkMode: 'class', // Kích hoạt chế độ dark mode sử dụng class "dark"
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Quét các file trong thư mục src để tìm class Tailwind
  ],
  theme: {
    extend: {
      colors: {
        // Định nghĩa các màu sắc tùy chỉnh
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        destructive: 'var(--color-destructive)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        sidebar: 'var(--color-sidebar)',
        'sidebar-foreground': 'var(--color-sidebar-foreground)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      }
    }
  },
  plugins: [lineClamp]
})
