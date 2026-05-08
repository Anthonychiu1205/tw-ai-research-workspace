import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(214 23% 90%)",
        input: "hsl(214 23% 90%)",
        ring: "hsl(186 61% 42%)",
        background: "hsl(210 40% 99%)",
        foreground: "hsl(222 47% 11%)",
        muted: "hsl(210 40% 96%)",
        "muted-foreground": "hsl(215 16% 47%)",
        primary: "hsl(186 61% 36%)",
        "primary-foreground": "hsl(210 40% 98%)",
        card: "hsl(0 0% 100%)",
        "card-foreground": "hsl(222 47% 11%)",
        workspace: {
          canvas: "hsl(210 40% 98%)",
          panel: "hsl(0 0% 100%)",
          section: "hsl(210 40% 97%)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
