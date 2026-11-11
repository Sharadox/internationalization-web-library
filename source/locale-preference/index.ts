const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Remembers a manual language choice for a year (cookie), so `/` opens in it next time (see `localeRedirects`).
 * Call it when the visitor switches language.
 *
 * @example
 * rememberLocale("pt", LOCALES.cookie);
 */
export function rememberLocale(locale: string, cookie = "locale"): void {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${cookie}=${encodeURIComponent(locale)}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}
