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
        border: "hsl(217 20% 18%)",
        input: "hsl(217 20% 18%)",
        ring: "hsl(201 100% 66%)",
        background: "hsl(222 33% 8%)",
        foreground: "hsl(210 40% 96%)",
        muted: "hsl(222 20% 14%)",
        "muted-foreground": "hsl(215 18% 66%)",
        primary: "hsl(201 100% 66%)",
        "primary-foreground": "hsl(220 22% 10%)",
        card: "hsl(222 30% 10%)",
        "card-foreground": "hsl(210 40% 96%)",
        workspace: {
          canvas: "hsl(224 33% 7%)",
          panel: "hsl(222 30% 10%)",
          section: "hsl(222 24% 12%)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
