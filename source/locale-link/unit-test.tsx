// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { LocaleLink } from "@sharadox/internationalization-web-library/locale-link";

vi.mock("@sharadox/internationalization-web-library/locale-preference", () => ({ rememberLocale: vi.fn() }));
const { rememberLocale } = await import("@sharadox/internationalization-web-library/locale-preference");

describe("LocaleLink", () => {
  test("links to the locale's home and marks the current language", () => {
    render(
      <LocaleLink locale="pt" current className="pill">
        PT
      </LocaleLink>,
    );
    const link = screen.getByRole("link", { name: "PT" });
    expect(link.getAttribute("href")).toBe("/pt");
    expect(link.getAttribute("hreflang")).toBe("pt");
    expect(link.getAttribute("aria-current")).toBe("true");
    expect(link.className).toBe("pill");
  });

  test("remembers the choice and still calls the caller's onClick", () => {
    const onClick = vi.fn();
    render(
      <LocaleLink locale="en" href="/en/contact" cookie="language" onClick={onClick}>
        English
      </LocaleLink>,
    );
    const link = screen.getByRole("link", { name: "English" });
    expect(link.getAttribute("aria-current")).toBeNull();
    expect(link.getAttribute("href")).toBe("/en/contact");
    fireEvent.click(link);
    expect(rememberLocale).toHaveBeenCalledWith("en", "language");
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("works without an onClick", () => {
    render(<LocaleLink locale="en">EN</LocaleLink>);
    expect(() => fireEvent.click(screen.getByRole("link", { name: "EN" }))).not.toThrow();
  });
});
