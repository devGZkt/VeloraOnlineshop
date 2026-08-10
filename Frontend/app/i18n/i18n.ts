import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./resources/de";
import en from "./resources/en";

export const SUPPORTED_LANGUAGES = ["de", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "de";
export const LANGUAGE_COOKIE = "lang";

export function isSupportedLanguage(value: string | null | undefined): value is Language {
  return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources: {
      de: { translation: de },
      en: { translation: en },
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18next;
