// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@sharadox/internationalization-web-library/locale-preference", () => ({ rememberLocale: vi.fn() }));
vi.mock("@sharadox/internationalization-web-library/locale-switch", () => ({ switchLocale: vi.fn() }));
const { LocaleLink } = await import("@sharadox/internationalization-web-library/locale-link");
const { rememberLocale } = await import("@sharadox/internationalization-web-library/locale-preference");
const { switchLocale } = await import("@sharadox/internationalization-web-library/locale-switch");

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

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
    fireEvent.click(link);
    expect(switchLocale).not.toHaveBeenCalled();
  });

  test("remembers the choice and switches in place, keeping the scroll position", () => {
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
    const [{ href, navigate }] = vi.mocked(switchLocale).mock.calls[0]!;
    expect(href).toBe("/en/contact");
    navigate("/en/contact");
    expect(push).toHaveBeenCalledWith("/en/contact", { scroll: false });
  });

  test("opens normally in a new tab, and leaves prevented clicks alone", () => {
    render(
      <>
        <LocaleLink locale="en">EN</LocaleLink>
        <LocaleLink locale="pt" onClick={(event) => event.preventDefault()}>
          PT
        </LocaleLink>
      </>,
    );
    fireEvent.click(screen.getByRole("link", { name: "EN" }), { ctrlKey: true });
    fireEvent.click(screen.getByRole("link", { name: "EN" }), { button: 1 });
    fireEvent.click(screen.getByRole("link", { name: "PT" }));
    expect(switchLocale).not.toHaveBeenCalled();
    expect(rememberLocale).toHaveBeenCalledTimes(3);
  });
});
