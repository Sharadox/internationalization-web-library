import type { Locales } from "@sharadox/internationalization-web-library/locale/type";
import type { LocaleRedirect } from "@sharadox/internationalization-web-library/locale-redirect/type";

/**
 * Redirects for next.config `redirects()`. `/` goes to, in order: the locale the visitor picked before (the cookie
 * set by `rememberLocale`), the locale their browser asks for first (Accept-Language) when it is published, and
 * otherwise the default locale. Temporary, so search engines keep `/` and every `/<locale>`.
 *
 * @example
 * // next.config.ts
 * export default { redirects: async () => localeRedirects(LOCALES) };
 */
export function localeRedirects<Locale extends string>({
  locales,
  defaultLocale,
  cookie,
}: Locales<Locale>): LocaleRedirect[] {
  const remembered: LocaleRedirect[] = locales.map((locale) => ({
    source: "/",
    has: [{ type: "cookie", key: cookie, value: locale }],
    destination: `/${locale}`,
    permanent: false,
  }));
  const preferred: LocaleRedirect[] = locales
    .filter((locale) => locale !== defaultLocale)
    .map((locale) => ({
      source: "/",
      has: [{ type: "header", key: "accept-language", value: `${locale}.*` }],
      destination: `/${locale}`,
      permanent: false,
    }));
  return [...remembered, ...preferred, { source: "/", destination: `/${defaultLocale}`, permanent: false }];
}
