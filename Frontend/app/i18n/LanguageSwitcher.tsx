import { useTranslation } from "react-i18next";
import { LANGUAGE_COOKIE, SUPPORTED_LANGUAGES, type Language } from "./i18n";

const LABELS: Record<Language, string> = {
  de: "DE",
  en: "EN",
};

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = "" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const current = i18n.language as Language;

  const handleChange = (lang: Language) => {
    if (lang === current) return;
    i18n.changeLanguage(lang);
    document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <div className={`inline-flex items-center rounded-full border border-[#e2e8e4] bg-white p-0.5 text-xs font-medium ${className}`}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleChange(lang)}
          aria-pressed={current === lang}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            current === lang
              ? "bg-[#3e564c] text-white"
              : "text-[#8c9490] hover:text-[#2a3731]"
          }`}
        >
          {LABELS[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
