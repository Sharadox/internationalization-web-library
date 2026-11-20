export interface LanguageSwitchProperties {
  /** Every published locale, in the order they're offered. */
  locales: readonly string[];
  /** The locale being shown. */
  locale: string;
  /** Where in the site the reader is, kept when switching (`/services`); the home page by default. */
  path?: string;
  /** The group's name for assistive technology ("Language" / "Idioma"). */
  label: string;
  /** Cookie that remembers the choice; `"locale"` by default. */
  cookie?: string;
  /** The wrapping element: a `div` by default, a `span` inside a line of text. */
  element?: "div" | "span";
  className?: string;
}
