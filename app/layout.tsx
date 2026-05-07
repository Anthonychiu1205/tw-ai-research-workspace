import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TW AI Research Workspace",
  description: "Mock-first Taiwan AI financial research workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className="dark">
      <body>{children}</body>
    </html>
  );
}
