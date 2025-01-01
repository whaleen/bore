/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: "2px", // Default for all components
        sm: "4px",
        lg: "12px",
        full: "9999px", // For fully rounded elements
      },
      colors: {
        customGreen: "#01D452", // Adding a custom color for reuse
      },
      spacing: {
        18: "4.5rem", // Example of custom spacing
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          green: "#01D452",
          primary: "#4C94F8",
          secondary: "#38BDF8",
          accent: "#42B883",
          neutral: "#2A3441",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          "base-300": "#F1F5F9",
          info: "#0EA5E9",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
        dark: {
          primary: "#4C94F8",
          secondary: "#38BDF8",
          accent: "#42B883",
          neutral: "#1E1E1E",
          "base-100": "#0F0F0F",
          "base-200": "#1A1A1A",
          "base-300": "#262626",
          info: "#0EA5E9",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
  },
};
