import { LOCALE_CANVAS_CLASS, LOCALE_TEXT_CLASS } from "@sharadox/internationalization-web-library/locale-switch";
import type { LocaleTransitionStyleProperties } from "@sharadox/internationalization-web-library/locale-transition-style/type";

/** The default language-switch animation: changed text blurs out and in, canvases cross-fade, the rest holds still. */
export const LOCALE_TRANSITION_CSS = `
::view-transition-old(root),::view-transition-new(root){animation:none}
::view-transition-group(*.${LOCALE_TEXT_CLASS}){animation-duration:.55s;animation-timing-function:cubic-bezier(.22,1,.36,1)}
::view-transition-old(*.${LOCALE_TEXT_CLASS}),::view-transition-new(*.${LOCALE_TEXT_CLASS}){width:auto;height:auto}
::view-transition-old(*.${LOCALE_TEXT_CLASS}){animation:locale-text-out .3s cubic-bezier(.4,0,1,1) both}
::view-transition-new(*.${LOCALE_TEXT_CLASS}){animation:locale-text-in .55s .12s cubic-bezier(.22,1,.36,1) both}
::view-transition-old(*.${LOCALE_TEXT_CLASS}):only-child{animation:none;opacity:0}
::view-transition-group(*.${LOCALE_CANVAS_CLASS}){animation-duration:.4s}
@keyframes locale-text-out{to{opacity:0;filter:blur(8px);transform:translateY(-.3em)}}
@keyframes locale-text-in{from{opacity:0;filter:blur(8px);transform:translateY(.3em)}}
`;

/**
 * Put once in `<head>`: how text changes when the language switches (see `switchLocale` and `LocaleLink`). Pass
 * `css` to replace the default look.
 *
 * @example
 * <head><LocaleTransitionStyle /></head>
 */
export function LocaleTransitionStyle({ css = LOCALE_TRANSITION_CSS }: LocaleTransitionStyleProperties) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
