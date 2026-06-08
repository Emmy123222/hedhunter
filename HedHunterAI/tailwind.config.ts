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
        brand: {
          bg:      "#060d1a",
          bg2:     "#0a1326",
          surface: "#0d1729",
          surface2:"#111d36",
          ink:     "#f3eee4",
          dim:     "#c7cfdf",
          muted:   "#7e8aa3",
          muted2:  "#54607a",
          accent:  "#5b8def",
          cyan:    "#3ce8ff",
          warn:    "#f5a524",
          good:    "#3ddc97",
          danger:  "#ff5e5e",
        },
      },
      fontFamily: {
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans:    ["var(--font-geist)", "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
      borderRadius: { xl2: "17px", xl3: "22px" },
      boxShadow: {
        card:  "0 28px 55px -28px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04) inset",
        glow:  "0 0 30px rgba(60,232,255,.4)",
        "glow-sm": "0 0 12px rgba(60,232,255,.25)",
      },
      backgroundImage: {
        "brand-gradient": "radial-gradient(1100px 500px at 80% -10%, rgba(91,141,239,.13), transparent 60%), radial-gradient(800px 400px at -5% 35%, rgba(60,232,255,.07), transparent 60%)",
        "accent-gradient": "linear-gradient(180deg, #6797ff, #3a6fe0)",
        "scan-line": "linear-gradient(180deg, transparent 44%, #3ce8ff 44%, #3ce8ff 46%, transparent 46%)",
      },
      animation: {
        "scan": "scan 3.2s ease-in-out infinite",
        "fade-up": "fadeUp .7s ease both",
        "fill-bar": "fillBar 1.5s cubic-bezier(.2,.7,.2,1) both",
        "scan-move": "scanMove 3.8s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%,100%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(100%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "none" },
        },
        fillBar: {
          from: { transform: "scaleX(0)" },
        },
        scanMove: {
          "0%": { top: "-55px", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
