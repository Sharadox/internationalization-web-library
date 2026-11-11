import type { Locales } from "@sharadox/internationalization-web-library/locale/type";
import type { LocaleRedirect } from "@sharadox/internationalization-web-library/locale-redirect/type";

/**
 * The paths that need a locale: everything except paths that already start with one, Next.js and Vercel internals
 * (`_next`, `_vercel`, `api`), the root icons (`icon`, `apple-icon`) and files (a name with an extension, such as
 * `sitemap.xml` or `robots.txt`). A Next.js path pattern (lookaheads only, no capturing groups).
 *
 * @example
 * new RegExp(`^/(?:${pathWithoutLocale(["en", "pt"])})$`).test("/license"); // true
 */
export function pathWithoutLocale(locales: readonly string[]): string {
  return `(?!(?:${locales.join("|")})(?:/|$))(?!(?:_next|_vercel|api)(?:/|$))(?!(?:icon|apple-icon)$)(?!.*\\.[a-zA-Z0-9]+$).+`;
}

/**
 * Redirects for next.config `redirects()`. Any address without a locale (`/`, `/license`, `/services/web`) goes to
 * the same page in, in order: the locale the visitor picked before (the cookie set by `rememberLocale`), the locale
 * their browser asks for first (Accept-Language) when it is published, and otherwise the default locale. Pages that
 * still don't exist then get the site's localized 404. Temporary, so search engines keep every `/<locale>` address.
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
  const path = `/:path(${pathWithoutLocale(locales)})`;
  const both = (locale: Locale, has?: LocaleRedirect["has"]): LocaleRedirect[] => [
    { source: "/", ...(has && { has }), destination: `/${locale}`, permanent: false },
    { source: path, ...(has && { has }), destination: `/${locale}/:path`, permanent: false },
  ];
  return [
    ...locales.flatMap((locale) => both(locale, [{ type: "cookie", key: cookie, value: locale }])),
    ...locales
      .filter((locale) => locale !== defaultLocale)
      .flatMap((locale) => both(locale, [{ type: "header", key: "accept-language", value: `${locale}.*` }])),
    ...both(defaultLocale),
  ];
}
