/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg:      "#ffffff",
        surface: "#f8fafc",
        border:  "rgba(0,0,0,0.07)",
        primary: "#5b8def",
        accent:  "#3a6fe0",
        muted:   "#64748b",
        text:    "#0f172a",
        subtle:  "#475569",
      },
    },
  },
};
