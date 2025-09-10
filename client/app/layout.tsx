import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { I18nProvider } from "../lib/i18n";
import Shell from "../components/Shell";

export const metadata: Metadata = {
  title: "Fitness Journal",
  description: "Minimal fitness journal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Shell>{children}</Shell>
    </I18nProvider>
  );
}


