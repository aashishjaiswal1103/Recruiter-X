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
        blue: {
          DEFAULT: '#0000FF',
          mid: '#2563EB',
          light: '#8FB3FF',
          pale: '#EEF2FF',
        },
        bg: {
          base: '#FFFFFF',
          subtle: '#FAFAFA',
          muted: '#F5F5F5',
        },
        black: {
          DEFAULT: '#0A0A0A',
          soft: '#111111',
          muted: '#1A1A1A',
        },
        text: {
          primary: '#0A0A0A',
          secondary: '#4A4A4A',
          tertiary: '#8C8C8C',
          'on-dark': '#FFFFFF',
          'on-blue': '#FFFFFF',
        },
        danger: {
          DEFAULT: '#DC2626',
          bg: '#FEF2F2',
        },
        warning: {
          DEFAULT: '#D97706',
          bg: '#FFFBEB',
        },
        success: {
          DEFAULT: '#16A34A',
          bg: '#F0FDF4',
        },
        info: {
          DEFAULT: '#2563EB',
          bg: '#EEF2FF',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.60)',
          border: 'rgba(255, 255, 255, 0.20)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Cambay"', 'sans-serif'],
        data: ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0,0,34,0.06)',
        'card-hover': '0 12px 32px rgba(0,0,34,0.10)',
        'float': '0 20px 48px rgba(0,0,34,0.12)',
        'modal': '0 24px 64px rgba(0,0,34,0.18)',
        'glow-blue': '0 0 60px rgba(0,0,255,0.15)',
        'focus': '0 0 0 3px rgba(37,99,235,0.25)',
      },
      spacing: {
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },
      maxWidth: {
        'content': '1320px',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #000033 0%, #0000FF 40%, #2563EB 70%, #8FB3FF 100%)',
        'gradient-score': 'linear-gradient(90deg, #0000FF, #2563EB, #8FB3FF)',
        'gradient-blob': 'radial-gradient(circle, rgba(0,0,255,0.15), transparent 70%)',
      },
      animation: {
        'float-bob': 'float-bob 5s ease-in-out infinite',
        'float-bob-slow': 'float-bob 6.2s ease-in-out infinite',
        'float-bob-fast': 'float-bob 4.8s ease-in-out infinite',
        'blob-drift': 'blob-drift 20s ease-in-out infinite',
        'fade-up': 'fade-up-settle 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-dot': 'pulse-dot 1.2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
