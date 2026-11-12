"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { rememberLocale } from "@sharadox/internationalization-web-library/locale-preference";
import { switchLocale } from "@sharadox/internationalization-web-library/locale-switch";
import type { LocaleLinkProperties } from "@sharadox/internationalization-web-library/locale-link/type";

/**
 * A link to the site in another language. It remembers the choice (so the site opens in it next time) and switches
 * in place: the scroll position stays, entrance effects don't replay and changed text animates to the new language
 * (add `LocaleTransitionStyle` once in `<head>`). Opening it in a new tab works as a normal link. Unstyled: style it
 * through `className` and `[aria-current]`.
 *
 * @example
 * {LOCALES.locales.map((other) => (
 *   <LocaleLink key={other} locale={other} current={other === locale} cookie={LOCALES.cookie}>{other.toUpperCase()}</LocaleLink>
 * ))}
 */
export function LocaleLink({ locale, href, current, cookie, onClick, children, ...anchor }: LocaleLinkProperties) {
  const router = useRouter();
  const target = href ?? `/${locale}`;
  return (
    <Link
      {...anchor}
      href={target}
      hrefLang={locale}
      aria-current={current ? "true" : undefined}
      onClick={(event) => {
        rememberLocale(locale, cookie);
        onClick?.(event);
        const newTab = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
        if (event.defaultPrevented || newTab || current) return;
        event.preventDefault();
        void switchLocale({ href: target, navigate: (destination) => router.push(destination, { scroll: false }) });
      }}
    >
      {children}
    </Link>
  );
}
