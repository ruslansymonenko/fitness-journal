// "use client";

// import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
// import { locales, LocaleKey } from "./locales";

// export type SupportedLanguage = LocaleKey;

// type Dictionary = typeof locales.en;

// type I18nContextValue = {
//   language: SupportedLanguage;
//   setLanguage: (lang: SupportedLanguage) => void;
//   t: (key: keyof Dictionary) => string;
// };

// const I18nContext = createContext<I18nContextValue | undefined>(undefined);

// export function I18nProvider({ children }: { children: React.ReactNode }) {
//   const [language, setLanguageState] = useState<SupportedLanguage>("en");

//   useEffect(() => {
//     const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as SupportedLanguage | null) : null;
//     const next = stored ?? "en";
//     setLanguageState(next);
//     if (typeof document !== "undefined") {
//       document.documentElement.setAttribute("lang", next);
//     }
//   }, []);

//   const setLanguage = useCallback((lang: SupportedLanguage) => {
//     setLanguageState(lang);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("lang", lang);
//     }
//     if (typeof document !== "undefined") {
//       document.documentElement.setAttribute("lang", lang);
//     }
//   }, []);

//   const t = useCallback((key: keyof Dictionary) => {
//     const dict = locales[language] ?? locales.en;
//     return dict?.[key] ?? String(key);
//   }, [language]);

//   const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

//   return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
// }

// export function useI18n() {
//   const ctx = useContext(I18nContext);
//   if (!ctx) throw new Error("useI18n must be used within I18nProvider");
//   return ctx;
// }

'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { locales, LocaleKey } from './locales';

export type SupportedLanguage = LocaleKey;
type Dictionary = typeof locales.en;

type DotPrefix<T extends string, U extends string> = `${T}.${U}`;
type DotNestedKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? K | DotPrefix<K, DotNestedKeys<T[K]>> : K;
    }[keyof T & string]
  : never;

export type TranslationKey = DotNestedKeys<Dictionary>;

type I18nContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const stored =
      typeof window !== 'undefined'
        ? (localStorage.getItem('lang') as SupportedLanguage | null)
        : null;
    const next = stored ?? 'en';
    setLanguageState(next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', next);
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      const dict = locales[language] ?? locales.en;

      return (
        key.split('.').reduce<any>((acc, part) => {
          if (acc && typeof acc === 'object' && part in acc) {
            return acc[part];
          }
          return undefined;
        }, dict) ?? key
      );
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
