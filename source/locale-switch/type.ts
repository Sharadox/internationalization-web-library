export interface LocaleSwitchOptions {
  /** Where to go, for example "/pt/license". */
  href: string;
  /** Performs the navigation, for example `(href) => router.push(href, { scroll: false })`. */
  navigate: (href: string) => void;
  /** How long to wait for the new language to render before giving up, in milliseconds. */
  timeoutMilliseconds?: number;
}
