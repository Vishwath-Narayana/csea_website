import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/**/*.{js,ts,jsx,tsx,astro}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        "surface-secondary": "var(--surface-secondary)",
        "surface-elevated": "var(--surface-elevated)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-muted": "var(--foreground-muted)",
        "foreground-subtle": "var(--foreground-subtle)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-muted": "var(--accent-muted)",
        "accent-blue": "var(--accent-blue)",
        "dark-canvas": "var(--dark-canvas)",
        "dark-surface": "var(--dark-surface)",
        "dark-surface-2": "var(--dark-surface-2)",
        "dark-surface-3": "var(--dark-surface-3)",
        "dark-foreground": "var(--dark-foreground)",
        "dark-foreground-muted": "var(--dark-foreground-muted)",
        "dark-border": "var(--dark-border)",
        "dark-border-strong": "var(--dark-border-strong)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
        "24": "96px",
        "32": "128px",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "12px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        medium: "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        strong: "0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "200ms",
        normal: "300ms",
        slow: "500ms",
        slower: "800ms",
      },
      transitionTimingFunction: {
        "ease-out-custom": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        content: "1280px",
        editorial: "720px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
