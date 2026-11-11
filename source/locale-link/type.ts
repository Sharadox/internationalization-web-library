import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface LocaleLinkProperties extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "hrefLang"> {
  /** The locale the link switches to. */
  locale: string;
  /** Where in that locale; the locale's home (`/<locale>`) by default. */
  href?: string;
  /** Marks the link for the language being shown (`aria-current`). */
  current?: boolean;
  /** Cookie that remembers the choice; `"locale"` by default. */
  cookie?: string;
  children: ReactNode;
}
