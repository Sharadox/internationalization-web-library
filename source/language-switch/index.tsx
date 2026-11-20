import { LocaleLink } from "@sharadox/internationalization-web-library/locale-link";
import type { LanguageSwitchProperties } from "@sharadox/internationalization-web-library/language-switch/type";

/**
 * EN / PT: one `LocaleLink` per locale in a labelled group, the shown one marked current. Switching keeps the reader
 * where they are and remembers the choice. Unstyled: style it through `className` and `[aria-current]`.
 *
 * @example
 * <LanguageSwitch locales={LOCALES.locales} locale="en" path="/services" label="Language" cookie={LOCALES.cookie} />
 */
export function LanguageSwitch({
  locales,
  locale,
  path = "",
  label,
  cookie,
  element: Element = "div",
  className,
}: LanguageSwitchProperties) {
  return (
    <Element className={className} role="group" aria-label={label}>
      {locales.map((other) => (
        <LocaleLink key={other} locale={other} href={`/${other}${path}`} current={other === locale} cookie={cookie}>
          {other.toUpperCase()}
        </LocaleLink>
      ))}
    </Element>
  );
}
