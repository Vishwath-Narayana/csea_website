/** @type {import('tailwindcss').Config} */
import sharedConfig from "@csea/ui/tailwind.config";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedConfig],
}
