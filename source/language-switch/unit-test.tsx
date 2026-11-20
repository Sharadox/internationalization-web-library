// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
const { LanguageSwitch } = await import("@sharadox/internationalization-web-library/language-switch");

afterEach(cleanup);

test("offers every language, keeping the place, the shown one marked current", () => {
  const { container } = render(
    <LanguageSwitch locales={["en", "pt"]} locale="pt" path="/services" label="Idioma" className="switch" />,
  );
  const group = screen.getByRole("group", { name: "Idioma" });
  expect(group.tagName).toBe("DIV");
  expect(group.className).toBe("switch");
  expect(screen.getByRole("link", { name: "EN" }).getAttribute("href")).toBe("/en/services");
  expect(screen.getByRole("link", { name: "PT" }).getAttribute("aria-current")).toBe("true");
  expect(container.querySelectorAll("a")).toHaveLength(2);
});

test("can sit in a line of text, and leads home by default", () => {
  render(<LanguageSwitch locales={["en", "pt"]} locale="en" label="Language" element="span" />);
  expect(screen.getByRole("group").tagName).toBe("SPAN");
  expect(screen.getByRole("link", { name: "PT" }).getAttribute("href")).toBe("/pt");
});
