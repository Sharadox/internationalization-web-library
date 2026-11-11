import { describe, expect, test } from "vitest";
import { defineLocales } from "@sharadox/internationalization-web-library/locale";
import { localeRedirects, pathWithoutLocale } from "@sharadox/internationalization-web-library/locale-redirect";

const PATH = `/:path(${pathWithoutLocale(["en", "pt"])})`;

test("sends any address without a locale to the remembered locale, then the browser's, then the default", () => {
  expect(localeRedirects(defineLocales({ locales: ["en", "pt"], defaultLocale: "en" }))).toEqual([
    { source: "/", has: [{ type: "cookie", key: "locale", value: "en" }], destination: "/en", permanent: false },
    { source: PATH, has: [{ type: "cookie", key: "locale", value: "en" }], destination: "/en/:path", permanent: false },
    { source: "/", has: [{ type: "cookie", key: "locale", value: "pt" }], destination: "/pt", permanent: false },
    { source: PATH, has: [{ type: "cookie", key: "locale", value: "pt" }], destination: "/pt/:path", permanent: false },
    {
      source: "/",
      has: [{ type: "header", key: "accept-language", value: "pt.*" }],
      destination: "/pt",
      permanent: false,
    },
    {
      source: PATH,
      has: [{ type: "header", key: "accept-language", value: "pt.*" }],
      destination: "/pt/:path",
      permanent: false,
    },
    { source: "/", destination: "/en", permanent: false },
    { source: PATH, destination: "/en/:path", permanent: false },
  ]);
});

describe("which paths need a locale", () => {
  const needsLocale = new RegExp(`^/(?:${pathWithoutLocale(["en", "pt"])})$`);
  test.each(["/licence", "/license", "/services/web", "/english", "/ptx", "/a.b/page"])("%s does", (path) => {
    expect(needsLocale.test(path)).toBe(true);
  });
  test.each([
    "/",
    "/en",
    "/pt",
    "/en/licence",
    "/pt/",
    "/_next/static/chunk.js",
    "/_vercel/insights",
    "/api/contact",
    "/icon",
    "/apple-icon",
    "/sitemap.xml",
    "/robots.txt",
    "/LICENCA.md",
    "/globe/land.bin",
  ])("%s doesn't", (path) => {
    expect(needsLocale.test(path)).toBe(false);
  });
});
