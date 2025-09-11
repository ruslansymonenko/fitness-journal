"use client";

import { useI18n, type SupportedLanguage } from "@/lib/i18n";


export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  return (
    <select
      aria-label="Select language"
      value={language}
      onChange={handleChange}
      className="rounded border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10"
    >
      <option value="en">EN</option>
      <option value="uk">UK</option>
    </select>
  );
}


