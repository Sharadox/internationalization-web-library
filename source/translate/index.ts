import type { Translated } from "@sharadox/internationalization-web-library/locale/type";

/**
 * Picks the copy for a locale.
 *
 * @example
 * translate({ en: "Contact", pt: "Contacto" }, "pt"); // "Contacto"
 */
export function translate<Locale extends string>(value: Translated<Locale>, locale: NoInfer<Locale>): string {
  return value[locale];
}
