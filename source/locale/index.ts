import { isString } from "@sharadox/web-library/type-guard/is-string";
import type { LocaleOptions, Locales } from "@sharadox/internationalization-web-library/locale/type";

/** Usual Open Graph locales for a language when the site doesn't name one. */
const OPEN_GRAPH_DEFAULTS: Record<string, string> = {
  en: "en_US",
  pt: "pt_PT",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  nl: "nl_NL",
};

/**
 * Defines a site's languages once and returns every helper built on them. Adding a language is one more entry in
 * `locales` (and its translations).
 *
 * @example
 * export const LOCALES = defineLocales({ locales: ["en", "pt"], defaultLocale: "en", languageTags: { pt: "pt-PT" } });
 * LOCALES.isLocale("pt"); // true
 * LOCALES.alternates("/contact"); // { en: "/en/contact", pt: "/pt/contact", "x-default": "/en/contact" }
 */
export function defineLocales<const Locale extends string>(options: LocaleOptions<Locale>): Locales<Locale> {
  const { locales, defaultLocale, cookie = "locale", languageTags = {}, openGraphLocales = {} } = options;
  if (!locales.includes(defaultLocale)) throw new Error(`defaultLocale "${defaultLocale}" is not one of the locales`);
  const tags = languageTags as Partial<Record<Locale, string>>;
  const openGraph = openGraphLocales as Partial<Record<Locale, string>>;
  const localePath = (locale: Locale, path = "") => `/${locale}${path === "/" ? "" : path}`;
  return {
    locales,
    defaultLocale,
    cookie,
    isLocale: (value: unknown): value is Locale => isString(value) && (locales as readonly string[]).includes(value),
    languageTag: (locale) => tags[locale] ?? locale,
    openGraphLocale: (locale) => openGraph[locale] ?? OPEN_GRAPH_DEFAULTS[locale] ?? locale,
    staticParams: () => locales.map((locale) => ({ locale })),
    localePath,
    alternates: (path = "") => ({
      ...Object.fromEntries(locales.map((locale) => [locale, localePath(locale, path)])),
      "x-default": localePath(defaultLocale, path),
    }),
  };
}
