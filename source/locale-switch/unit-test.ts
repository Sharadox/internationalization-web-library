// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isSoftNavigation, SOFT_NAVIGATION_ATTRIBUTE } from "@sharadox/web-library/navigation/soft-navigation";
import {
  LOCALE_CANVAS_CLASS,
  LOCALE_TEXT_CLASS,
  switchLocale,
} from "@sharadox/internationalization-web-library/locale-switch";

const box = (visible: boolean) =>
  ({ width: visible ? 100 : 0, height: 20, top: 10, left: 10, bottom: 30, right: 110 }) as DOMRect;
const page = (title: string) => `
  <h1 class="title">${title}</h1>
  <p class="text">Same in both</p>
  <span class="hidden">Off screen</span>
  <script>ignored()</script>
  <div class="globe"><canvas></canvas></div>`;
const transitionName = (element: Element | null) =>
  (element as HTMLElement | null)?.style.getPropertyValue("view-transition-name") ?? "";

beforeEach(() => {
  document.documentElement.lang = "en";
  document.documentElement.removeAttribute(SOFT_NAVIGATION_ATTRIBUTE);
  document.body.innerHTML = page("Technologies");
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    return box(!this.classList.contains("hidden"));
  });
  vi.stubGlobal("scrollY", 640);
  vi.stubGlobal("scrollTo", vi.fn());
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false } as MediaQueryList);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, "startViewTransition");
});

const navigateTo = (title: string, language: string) =>
  vi.fn(() => {
    document.body.innerHTML = page(title);
    document.documentElement.lang = language;
  });

describe("switchLocale without view transitions", () => {
  test("navigates, keeps the scroll position and marks a soft navigation", async () => {
    const navigate = navigateTo("Tecnologias", "pt-PT");
    await switchLocale({ href: "/pt", navigate });
    expect(navigate).toHaveBeenCalledWith("/pt");
    expect(scrollTo).toHaveBeenCalledWith({ top: 640, behavior: "instant" });
    expect(isSoftNavigation()).toBe(true);
    expect(document.documentElement.hasAttribute(SOFT_NAVIGATION_ATTRIBUTE)).toBe(true);
  });

  test("gives up waiting for the new language after the timeout", async () => {
    await switchLocale({ href: "/en", navigate: vi.fn(), timeoutMilliseconds: 30 });
    expect(scrollTo).toHaveBeenCalled();
  });

  test("doesn't animate when the visitor prefers reduced motion", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    const startViewTransition = vi.fn();
    Object.assign(document, { startViewTransition });
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    await switchLocale({ href: "/pt", navigate: navigateTo("Tecnologias", "pt-PT") });
    expect(startViewTransition).not.toHaveBeenCalled();
  });
});

describe("keeping the reader on the same text", () => {
  test("anchors on the first page text at the top of the screen, never on a fixed bar", async () => {
    document.body.innerHTML = `<header style="position:fixed"><a class="menu">Menu</a></header><h2 class="where">Process</h2>`;
    let shift = 0;
    vi.mocked(Element.prototype.getBoundingClientRect).mockImplementation(function (this: Element) {
      return { ...box(true), top: this.classList.contains("where") ? 200 + shift : 0, bottom: 300 + shift };
    });
    const navigate = vi.fn(() => {
      document.body.innerHTML = `<header style="position:fixed"><a class="menu">Menu</a></header><h2 class="where">Processo</h2>`;
      document.documentElement.lang = "pt-PT";
      shift = 90; // the translation above made the page taller
    });
    await switchLocale({ href: "/pt", navigate });
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 640 + 90, behavior: "instant" });
  });

  test("keeps the plain scroll position when no page text is on screen", async () => {
    document.body.innerHTML = `<div class="empty"></div>`;
    vi.mocked(Element.prototype.getBoundingClientRect).mockReturnValue(box(false));
    await switchLocale({ href: "/pt", navigate: vi.fn(() => (document.documentElement.lang = "pt-PT")) });
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 640, behavior: "instant" });
  });

  test("clears the soft-navigation mark once skipped entrances would have finished", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const done = switchLocale({ href: "/pt", navigate: navigateTo("Tecnologias", "pt-PT") });
    await vi.advanceTimersByTimeAsync(100);
    await done;
    expect(document.documentElement.hasAttribute(SOFT_NAVIGATION_ATTRIBUTE)).toBe(true);
    await vi.advanceTimersByTimeAsync(4000);
    expect(document.documentElement.hasAttribute(SOFT_NAVIGATION_ATTRIBUTE)).toBe(false);
    vi.useRealTimers();
  });
});

describe("switchLocale with view transitions", () => {
  test("animates only the visible text that changes, and the canvases", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    let during: { title: string; same: string; canvas: string } | null = null;
    Object.assign(document, {
      startViewTransition: (update: () => Promise<void>) => {
        expect(transitionName(document.querySelector(".title"))).toBe(`${LOCALE_TEXT_CLASS}-0`);
        expect(transitionName(document.querySelector(".hidden"))).toBe("");
        const finished = update().then(() => {
          during = {
            title: transitionName(document.querySelector(".title")),
            same: transitionName(document.querySelector(".text")),
            canvas: transitionName(document.querySelector(".globe")),
          };
        });
        return { finished };
      },
    });
    await switchLocale({ href: "/pt", navigate: navigateTo("Tecnologias", "pt-PT") });
    expect(during).toEqual({
      title: `${LOCALE_TEXT_CLASS}-0`,
      same: "",
      canvas: `${LOCALE_CANVAS_CLASS}-0`,
    });
    expect(transitionName(document.querySelector(".title"))).toBe("");
    expect(transitionName(document.querySelector(".globe"))).toBe("");
  });

  test("leaves text alone when the page changed shape", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    let title = "unset";
    Object.assign(document, {
      startViewTransition: (update: () => Promise<void>) => ({
        finished: update().then(() => (title = transitionName(document.querySelector("h2")))),
      }),
    });
    const navigate = vi.fn(() => {
      document.body.innerHTML = `<h2 class="title">Tecnologias</h2>`;
      document.documentElement.lang = "pt-PT";
    });
    await switchLocale({ href: "/pt", navigate });
    expect(title).toBe("");
  });
});
