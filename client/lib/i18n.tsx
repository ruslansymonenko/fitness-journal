"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLanguage = "en" | "uk";

type Dictionary = Record<string, Record<SupportedLanguage, string>>;

// Minimal dictionary, easy to extend with more keys and languages
const DICTIONARY: Dictionary = {
  fitness: { en: "Fitness", uk: "Фітнес" },
  overview: { en: "Overview", uk: "Огляд" },
  journal: { en: "Journal", uk: "Журнал" },
  addEntry: { en: "Add Entry", uk: "Додати запис" },
  welcomeBack: { en: "Welcome back!", uk: "З поверненням!" },
  heroTitle: { en: "Track Your Daily Activities", uk: "Відстежуйте свої щоденні активності" },
  heroSubtitle: { en: "Stay consistent and visualize your progress over time.", uk: "Будьте послідовними та відстежуйте свій прогрес з часом." },
  thisWeek: { en: "This week", uk: "Цього тижня" },
  totalDuration: { en: "Total duration", uk: "Загальна тривалість" },
  streak: { en: "Streak", uk: "Серія" },
  sessions: { en: "sessions", uk: "сесій" },
  days: { en: "days", uk: "днів" },
  date: { en: "Date", uk: "Дата" },
  workoutType: { en: "Workout type", uk: "Тип тренування" },
  durationMinutes: { en: "Duration (minutes)", uk: "Тривалість (хвилини)" },
  notes: { en: "Notes", uk: "Нотатки" },
  optional: { en: "Optional", uk: "Необов'язково" },
  save: { en: "Save", uk: "Зберегти" },
  entrySaved: { en: "Entry saved successfully!", uk: "Запис успішно збережено!" },
  entryFailed: { en: "Failed to save entry. Please try again.", uk: "Не вдалося зберегти запис. Спробуйте ще раз." },
};

type I18nContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof typeof DICTIONARY) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/**
 * Provides app-wide i18n state and translation function backed by a simple dictionary.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as SupportedLanguage | null) : null;
    const next = stored ?? "en";
    setLanguageState(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", next);
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, []);

  const t = useCallback((key: keyof typeof DICTIONARY) => {
    const entry = DICTIONARY[key];
    return entry?.[language] ?? (entry?.en ?? String(key));
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook to access current language and translation function.
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


