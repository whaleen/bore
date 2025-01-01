// apps/web/tailwind.config.js
import uiConfig from '../../packages/ui/tailwind.config.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  presets: [uiConfig],
}
