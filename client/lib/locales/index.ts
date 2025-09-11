import en from "./en";
import uk from "./uk";

export type Locale = typeof en;

export const locales = {
  en,
  uk,
};

export type LocaleKey = keyof typeof locales;


