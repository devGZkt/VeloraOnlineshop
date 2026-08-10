import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isSupportedLanguage, type Language } from "./i18n";

/**
 * Resolves the language for an incoming request: prefers the persisted
 * cookie (set once the user has picked a language), otherwise falls back
 * to the browser's Accept-Language header for a first-visit auto-detect.
 * Runs on the server inside the root loader so SSR and hydration agree
 * on the language from the very first paint (no hydration mismatch).
 */
export function resolveLanguage(request: Request): Language {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)lang=([a-zA-Z-]+)/);
  const cookieLang = cookieMatch?.[1]?.toLowerCase();
  if (isSupportedLanguage(cookieLang)) {
    return cookieLang;
  }

  const acceptLanguage = request.headers.get("Accept-Language") ?? "";
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  if (isSupportedLanguage(preferred)) {
    return preferred;
  }

  return DEFAULT_LANGUAGE;
}

export { LANGUAGE_COOKIE };
