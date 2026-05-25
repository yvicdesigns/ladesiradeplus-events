import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#F97316",
          light: "#FB923C",
          dark: "#EA580C",
        },
        "brand-red": "#E63946",
        "brand-green": "#22C55E",
        charcoal: {
          DEFAULT: "rgb(var(--charcoal) / <alpha-value>)",
          soft: "rgb(var(--charcoal-soft) / <alpha-value>)",
          deep: "rgb(var(--charcoal-deep) / <alpha-value>)",
        },
        ivory: "rgb(var(--ivory) / <alpha-value>)",
        "off-white": "rgb(var(--off-white) / <alpha-value>)",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        vibes: ["var(--font-great-vibes)", "cursive"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)",
      },
      boxShadow: {
        gold: "0 0 30px rgba(249, 115, 22, 0.35)",
        "gold-lg": "0 0 60px rgba(249, 115, 22, 0.45)",
        card: "0 2px 12px rgba(0, 0, 0, 0.08)",
        "card-lg": "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
