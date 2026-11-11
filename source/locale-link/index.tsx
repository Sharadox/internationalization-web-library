"use client";
import Link from "next/link";
import { rememberLocale } from "@sharadox/internationalization-web-library/locale-preference";
import type { LocaleLinkProperties } from "@sharadox/internationalization-web-library/locale-link/type";

/**
 * A link to the site in another language that remembers the choice, so the site opens in it next time. Unstyled:
 * style it through `className` and `[aria-current]`.
 *
 * @example
 * {LOCALES.locales.map((other) => (
 *   <LocaleLink key={other} locale={other} current={other === locale} cookie={LOCALES.cookie}>{other.toUpperCase()}</LocaleLink>
 * ))}
 */
export function LocaleLink({ locale, href, current, cookie, onClick, children, ...anchor }: LocaleLinkProperties) {
  return (
    <Link
      {...anchor}
      href={href ?? `/${locale}`}
      hrefLang={locale}
      aria-current={current ? "true" : undefined}
      onClick={(event) => {
        rememberLocale(locale, cookie);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
