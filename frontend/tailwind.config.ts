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
          dim: '#0000CC',
          light: '#F0F4FF',
        },
        bg: {
          base: '#FFFFFF',
          subtle: '#FAFAFA',
        },
        navy: {
          DEFAULT: '#000022',
          soft: '#00003A',
        },
        cream: {
          DEFAULT: '#FFF5EC',
        },
        peach: {
          DEFAULT: '#FCE9D7',
        },
        text: {
          primary: '#0A0A0A',
          secondary: '#4A4A4A',
          tertiary: '#8C8C8C',
          onNavy: '#FFFFFF',
        },
        danger: {
          DEFAULT: '#D32F2F',
          bg: '#FFF5F5',
        },
        warning: {
          DEFAULT: '#B45309',
          bg: '#FFFBF0',
        },
        success: {
          DEFAULT: '#166534',
          bg: '#F0FDF4',
        },
        info: {
          DEFAULT: '#0000FF',
          bg: '#F0F4FF',
        },
        border: {
          light: '#E5E5E5',
          medium: '#D4C4B5',
          dark: '#A89080',
          blue: '#0000FF',
        }
      },
      fontFamily: {
        display: ['Syncopate', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        data: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
