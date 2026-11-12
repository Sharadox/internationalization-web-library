import { beginSoftNavigation, markSoftNavigationDocument } from "@sharadox/web-library/navigation/soft-navigation";
import type { LocaleSwitchOptions } from "@sharadox/internationalization-web-library/locale-switch/type";

/** View transition class of the text that changes language (styled by `LocaleTransitionStyle`). */
export const LOCALE_TEXT_CLASS = "locale-text";
/** View transition class of canvases (globes and other WebGL), kept steady while the page is rebuilt. */
export const LOCALE_CANVAS_CLASS = "locale-canvas";
/** At most this many pieces of text animate; the rest swap with the page. */
const TEXT_LIMIT = 300;
const SKIPPED = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);

/** Every element that directly holds visible text, in document order (the same order in every language). */
function textElements(): Element[] {
  const found: Element[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const element = node as Element;
    if (SKIPPED.has(element.tagName)) continue;
    const ownText = [...element.childNodes].some(
      (child) => child.nodeType === Node.TEXT_NODE && child.textContent!.trim() !== "",
    );
    if (ownText) found.push(element);
  }
  return found;
}

function onScreen(element: Element): boolean {
  const box = element.getBoundingClientRect();
  return (
    box.width > 0 && box.height > 0 && box.bottom > 0 && box.right > 0 && box.top < innerHeight && box.left < innerWidth
  );
}

function name(element: Element, transitionName: string, transitionClass: string): void {
  const style = (element as HTMLElement).style;
  style.setProperty("view-transition-name", transitionName);
  style.setProperty("view-transition-class", transitionClass);
}

function unname(element: Element): void {
  const style = (element as HTMLElement).style;
  style.removeProperty("view-transition-name");
  style.removeProperty("view-transition-class");
}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Containers of the page's canvases: sized by CSS, so they make steady transition boxes. */
const canvasBoxes = () =>
  [...document.querySelectorAll("canvas")].map((canvas) => canvas.parentElement).filter((box) => box !== null);

/**
 * Switches the page to another language without the feel of a reload: the scroll position stays, components skip
 * their entrance effects (see `isSoftNavigation` in web-library), and, where the browser supports view transitions
 * and the visitor allows motion, each visible piece of text that changes fades and unblurs from the old wording to
 * the new one while everything else stays still. Resolves when the new language is shown.
 *
 * @example
 * await switchLocale({ href: "/pt", navigate: (href) => router.push(href, { scroll: false }) });
 */
export async function switchLocale({ href, navigate, timeoutMilliseconds = 3000 }: LocaleSwitchOptions): Promise<void> {
  const previousLanguage = document.documentElement.lang;
  const scroll = scrollY;
  beginSoftNavigation();
  const arrive = async () => {
    navigate(href);
    const start = performance.now();
    while (document.documentElement.lang === previousLanguage && performance.now() - start < timeoutMilliseconds) {
      await nextFrame();
    }
    await nextFrame();
    await nextFrame();
    scrollTo({ top: scroll, behavior: "instant" });
    markSoftNavigationDocument();
  };
  const animated =
    typeof document.startViewTransition === "function" &&
    CSS.supports("view-transition-class", "a") &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!animated) return arrive();

  const before = textElements()
    .map((element, index) => ({ element, index }))
    .filter(({ element }) => onScreen(element))
    .slice(0, TEXT_LIMIT);
  const was = new Map(
    before.map(({ element, index }) => [
      index,
      { text: element.textContent, tag: element.tagName, className: element.getAttribute("class") },
    ]),
  );
  for (const { element, index } of before) name(element, `${LOCALE_TEXT_CLASS}-${index}`, LOCALE_TEXT_CLASS);
  canvasBoxes().forEach((box, index) => name(box, `${LOCALE_CANVAS_CLASS}-${index}`, LOCALE_CANVAS_CLASS));

  const named: Element[] = [];
  const transition = document.startViewTransition(async () => {
    await arrive();
    const after = textElements();
    for (const [index, old] of was) {
      const element = after[index];
      // Only text that really changed animates; unchanged text stays still with the page.
      if (
        element &&
        element.tagName === old.tag &&
        element.getAttribute("class") === old.className &&
        element.textContent !== old.text
      ) {
        name(element, `${LOCALE_TEXT_CLASS}-${index}`, LOCALE_TEXT_CLASS);
        named.push(element);
      }
    }
    canvasBoxes().forEach((box, index) => {
      name(box, `${LOCALE_CANVAS_CLASS}-${index}`, LOCALE_CANVAS_CLASS);
      named.push(box);
    });
  });
  await transition.finished;
  named.forEach(unname);
}
