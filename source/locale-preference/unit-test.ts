// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from "vitest";
import { rememberLocale } from "@sharadox/internationalization-web-library/locale-preference";

afterEach(() => vi.unstubAllGlobals());

test("remembers the locale in a cookie for a year", () => {
  const document = { cookie: "" };
  vi.stubGlobal("document", document);
  vi.stubGlobal("location", { protocol: "http:" });
  rememberLocale("pt");
  expect(document.cookie).toBe("locale=pt; path=/; max-age=31536000; samesite=lax");
});

test("marks the cookie secure on https and uses the given name", () => {
  const document = { cookie: "" };
  vi.stubGlobal("document", document);
  vi.stubGlobal("location", { protocol: "https:" });
  rememberLocale("en", "language");
  expect(document.cookie).toBe("language=en; path=/; max-age=31536000; samesite=lax; secure");
});
