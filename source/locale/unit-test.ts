import { describe, expect, test } from "vitest";
import { defineLocales } from "@sharadox/internationalization-web-library/locale";

const LOCALES = defineLocales({ locales: ["en", "pt"], defaultLocale: "en", languageTags: { pt: "pt-PT" } });

describe("defineLocales", () => {
  test("keeps the configuration with a default cookie", () => {
    expect(LOCALES).toMatchObject({ locales: ["en", "pt"], defaultLocale: "en", cookie: "locale" });
    expect(defineLocales({ locales: ["en"], defaultLocale: "en", cookie: "language" }).cookie).toBe("language");
  });

  test("rejects a default locale that isn't published", () => {
    expect(() => defineLocales({ locales: ["en"], defaultLocale: "pt" as "en" })).toThrow(
      'defaultLocale "pt" is not one of the locales',
    );
  });

  test.each([
    ["pt", true],
    ["en", true],
    ["es", false],
    [undefined, false],
    [1, false],
  ])("isLocale(%j) is %s", (value, expected) => {
    expect(LOCALES.isLocale(value)).toBe(expected);
  });

  test("gives language tags and Open Graph locales, with defaults", () => {
    expect(LOCALES.languageTag("pt")).toBe("pt-PT");
    expect(LOCALES.languageTag("en")).toBe("en");
    expect(LOCALES.openGraphLocale("pt")).toBe("pt_PT");
    expect(LOCALES.openGraphLocale("en")).toBe("en_GB");
    const custom = defineLocales({ locales: ["en", "xx"], defaultLocale: "en", openGraphLocales: { en: "en_US" } });
    expect(custom.openGraphLocale("en")).toBe("en_US");
    expect(custom.openGraphLocale("xx")).toBe("xx");
  });

  test("builds static params, localized paths and hreflang alternates", () => {
    expect(LOCALES.staticParams()).toEqual([{ locale: "en" }, { locale: "pt" }]);
    expect(LOCALES.localePath("pt")).toBe("/pt");
    expect(LOCALES.localePath("pt", "/")).toBe("/pt");
    expect(LOCALES.localePath("pt", "/contact")).toBe("/pt/contact");
    expect(LOCALES.alternates()).toEqual({ en: "/en", pt: "/pt", "x-default": "/en" });
    expect(LOCALES.alternates("/contact")).toEqual({
      en: "/en/contact",
      pt: "/pt/contact",
      "x-default": "/en/contact",
    });
  });
});
