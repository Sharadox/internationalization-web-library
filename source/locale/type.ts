/** Copy in every locale of a site: `{ en: "Contact", pt: "Contacto" }`. */
export type Translated<Locale extends string> = Readonly<Record<Locale, string>>;

/** Everything a site needs to know about its languages. Adding a language is one more entry in `locales`. */
export interface LocaleOptions<Locale extends string> {
  /** Every published locale (route segment), for example `["en", "pt"]`. */
  locales: readonly Locale[];
  /** The locale for visitors whose language isn't published, and the `x-default` alternate. */
  defaultLocale: NoInfer<Locale>;
  /** Cookie that remembers a manual choice; `"locale"` by default. */
  cookie?: string;
  /** `<html lang>` tag per locale when it isn't the locale itself, for example `{ pt: "pt-PT" }`. */
  languageTags?: Partial<Record<NoInfer<Locale>, string>>;
  /** Open Graph locale per locale (`og:locale`), for example `{ pt: "pt_PT" }`; `en_US`-style defaults otherwise (American English for English). */
  openGraphLocales?: Partial<Record<NoInfer<Locale>, string>>;
}

/** A site's locales with the helpers built on them (see `defineLocales`). */
export interface Locales<Locale extends string> {
  readonly locales: readonly Locale[];
  readonly defaultLocale: Locale;
  readonly cookie: string;
  /** Narrows an untrusted value (a route segment, a form field) to a published locale. */
  isLocale(value: unknown): value is Locale;
  /** The BCP 47 tag for `<html lang>` and structured data. */
  languageTag(locale: Locale): string;
  /** The Open Graph locale (`og:locale`). */
  openGraphLocale(locale: Locale): string;
  /** `[{ locale: "en" }, …]` for Next.js `generateStaticParams`. */
  staticParams(): { locale: Locale }[];
  /** The localized path of a page: `localePath("pt", "/contact")` → `/pt/contact`. */
  localePath(locale: Locale, path?: string): string;
  /** hreflang alternates of a page, with `x-default`: `{ en: "/en/contact", pt: "/pt/contact", "x-default": "/en/contact" }`. */
  alternates(path?: string): Record<string, string>;
}
