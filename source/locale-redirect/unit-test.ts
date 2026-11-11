import { expect, test } from "vitest";
import { defineLocales } from "@sharadox/internationalization-web-library/locale";
import { localeRedirects } from "@sharadox/internationalization-web-library/locale-redirect";

test("sends / to the remembered locale, then the browser's, then the default", () => {
  expect(localeRedirects(defineLocales({ locales: ["en", "pt"], defaultLocale: "en" }))).toEqual([
    { source: "/", has: [{ type: "cookie", key: "locale", value: "en" }], destination: "/en", permanent: false },
    { source: "/", has: [{ type: "cookie", key: "locale", value: "pt" }], destination: "/pt", permanent: false },
    {
      source: "/",
      has: [{ type: "header", key: "accept-language", value: "pt.*" }],
      destination: "/pt",
      permanent: false,
    },
    { source: "/", destination: "/en", permanent: false },
  ]);
});
