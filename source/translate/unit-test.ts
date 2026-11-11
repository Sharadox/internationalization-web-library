import { expect, test } from "vitest";
import { translate } from "@sharadox/internationalization-web-library/translate";

test("picks the copy for the locale", () => {
  expect(translate({ en: "Contact", pt: "Contacto" }, "pt")).toBe("Contacto");
});
