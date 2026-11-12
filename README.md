# @sharadox/internationalization-web-library

Languages for websites, defined once. One locale configuration gives every helper a multilingual Next.js site needs, so adding a language is one entry in a list, plus its translations.

## Install

```sh
pnpm add @sharadox/internationalization-web-library
```

## Use

```ts
// content/locale.ts
import { defineLocales } from "@sharadox/internationalization-web-library/locale";

export const LOCALES = defineLocales({ locales: ["en", "pt"], defaultLocale: "en", languageTags: { pt: "pt-PT" } });
export type Locale = (typeof LOCALES.locales)[number];
```

```ts
// next.config.ts: `/` opens in the remembered language, then the browser's, then the default
import { localeRedirects } from "@sharadox/internationalization-web-library/locale-redirect";
export default { redirects: async () => localeRedirects(LOCALES) };
```

```tsx
// src/app/[locale]/layout.tsx
export const generateStaticParams = () => LOCALES.staticParams();
// <html lang={LOCALES.languageTag(locale)}>, and `if (!LOCALES.isLocale(locale)) notFound();`
// In <head>: <LocaleTransitionStyle /> (how text animates when the language switches)
```

```tsx
// A language switch: unstyled links that remember the choice and switch in place (scroll kept, no entrance
// replays, changed text animates to the new language)
import { LocaleLink } from "@sharadox/internationalization-web-library/locale-link";

{
  LOCALES.locales.map((other) => (
    <LocaleLink key={other} locale={other} current={other === locale} cookie={LOCALES.cookie} className={styles.link}>
      {other.toUpperCase()}
    </LocaleLink>
  ));
}
```

```ts
import { translate } from "@sharadox/internationalization-web-library/translate";
translate({ en: "Contact", pt: "Contacto" }, locale);
```

## API

| Import                      | Export                                                                                               | Description                                                                                                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `…/locale`                  | `defineLocales({ locales, defaultLocale, cookie?, languageTags?, openGraphLocales? })`               | Returns `{ locales, defaultLocale, cookie, isLocale, languageTag, openGraphLocale, staticParams, localePath, alternates }`                                                                        |
| `…/locale/type`             | `Translated<Locale>`, `LocaleOptions`, `Locales`                                                     | Types                                                                                                                                                                                             |
| `…/translate`               | `translate(value, locale)`                                                                           | Picks the copy for a locale                                                                                                                                                                       |
| `…/locale-redirect`         | `localeRedirects(locales)`, `pathWithoutLocale(locales)`                                             | next.config redirects for `/` and every path without a locale (files, `_next`, `api` and root icons excepted): cookie, then Accept-Language, then default (temporary)                             |
| `…/locale-preference`       | `rememberLocale(locale, cookie?)`                                                                    | Remembers a manual choice for a year                                                                                                                                                              |
| `…/locale-link`             | `<LocaleLink locale current? href? cookie? …anchor>`                                                 | Unstyled next/link that remembers the choice and switches in place (`hrefLang`, `aria-current`; new-tab clicks stay normal links)                                                                 |
| `…/locale-switch`           | `switchLocale({ href, navigate, timeoutMilliseconds? })`, `LOCALE_TEXT_CLASS`, `LOCALE_CANVAS_CLASS` | Switches language in place: keeps the scroll position, raises web-library's soft-navigation signal (entrance effects skip), and with view transitions animates only the visible text that changes |
| `…/locale-transition-style` | `<LocaleTransitionStyle css? />`, `LOCALE_TRANSITION_CSS`                                            | The default animation: changed text blurs out and in, canvases cross-fade, everything else holds still                                                                                            |

`alternates(path)` returns hreflang links with `x-default`, ready for Next.js `metadata.alternates.languages`. `openGraphLocale` knows the usual regions (`en_GB`, `pt_PT`, `es_ES`…) and takes your own.

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage and the build. Branches follow `<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## License

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the [English translation](LICENSE.md).
