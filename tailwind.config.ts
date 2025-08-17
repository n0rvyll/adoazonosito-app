import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ha van shadcn/ui vagy saját theme-ed, itt bővítsd.
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 47.4% 11.2%)",
        muted: "hsl(210 40% 96%)",
        "muted-foreground": "hsl(215.4 16.3% 46.9%)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [
    // ha használsz pluginokat: require nem kell; ESM-ben importáld a tetején
  ],
};

export default config;
