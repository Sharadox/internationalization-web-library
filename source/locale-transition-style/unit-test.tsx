// @vitest-environment happy-dom
import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import {
  LOCALE_TRANSITION_CSS,
  LocaleTransitionStyle,
} from "@sharadox/internationalization-web-library/locale-transition-style";

test("writes the default language-switch animation, or the site's own", () => {
  const { container, rerender } = render(<LocaleTransitionStyle />);
  expect(container.querySelector("style")!.innerHTML).toBe(LOCALE_TRANSITION_CSS);
  expect(LOCALE_TRANSITION_CSS).toContain("::view-transition-new(*.locale-text)");
  rerender(<LocaleTransitionStyle css="::view-transition-group(*){animation:none}" />);
  expect(container.querySelector("style")!.innerHTML).toBe("::view-transition-group(*){animation:none}");
});
