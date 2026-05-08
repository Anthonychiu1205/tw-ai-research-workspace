import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/i18n-context";

export const metadata: Metadata = {
  title: "TW AI Research Workspace",
  description: "Mock-first Taiwan AI financial research workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
