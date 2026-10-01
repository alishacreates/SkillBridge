import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DesignShowcase } from "./design-showcase";

describe("production design showcase", () => {
  // Catches an incomplete route or a disconnected portfolio mockup.
  it("renders the reference sections and a real dashboard destination", () => {
    render(<DesignShowcase />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "SkillBridge Design System",
    );
    for (const name of [
      "Brand colors",
      "Semantic colors",
      "Data visualization",
      "Typography",
      "Space, shape & layout",
      "UI primitives",
      "SkillBridge components",
      "Component states",
      "Accessibility",
      "System architecture",
    ])
      expect(screen.getByRole("heading", { level: 2, name })).toBeVisible();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByText(
        "Designed and tested with accessibility considerations.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(/Card \+ Badge \+ SkillChip \+ MatchScore \+ Button/),
    ).toBeVisible();
  });
  // Catches token labels disappearing or presentation values being replaced by generic swatches.
  it("identifies the locked palette, chart series, and actual scale tokens", () => {
    render(<DesignShowcase />);
    for (const value of [
      "#540D6E",
      "#EE4266",
      "#FFD23F",
      "#F3FCF0",
      "#1F271B",
      "--space-16",
      "--radius-xl",
      "--shadow-md",
      "--layout-content-max",
    ])
      expect(screen.getAllByText(value).length).toBeGreaterThan(0);
    const chart = screen.getByRole("region", { name: "Data visualization" });
    expect(within(chart).getByText("Cyan · 38 examples")).toBeVisible();
    expect(within(chart).getByText("Orange · 26 examples")).toBeVisible();
    expect(screen.getByText("--type-caption-size")).toBeVisible();
  });
  // Real production Button disabled/busy behavior must survive page composition.
  it("demonstrates real button variants and prevents disabled or busy activation", async () => {
    render(<DesignShowcase />);
    const region = within(
      screen.getByRole("region", { name: "UI primitives" }),
    );
    await userEvent.click(region.getByRole("button", { name: "Try primary" }));
    expect(region.getByRole("status")).toHaveTextContent(
      "primary variant activated",
    );
    await userEvent.click(
      region.getByRole("button", { name: "Try destructive" }),
    );
    expect(region.getByRole("status")).toHaveTextContent("No data deleted");
    expect(
      region.getByRole("button", { name: "Unavailable action" }),
    ).toBeDisabled();
    // jsdom does not apply the CSS that visually hides the normal button layer.
    expect(
      region.getByRole("button", { name: /Loading example/ }),
    ).toBeDisabled();
    expect(
      region.getByRole("button", { name: /Loading example/ }),
    ).toHaveAttribute("aria-busy", "true");
    await userEvent.click(
      region.getByRole("button", { name: "Increment example counter" }),
    );
    expect(region.getByRole("status")).toHaveTextContent("Counter: 1");
  });
  // Catches missing shared field associations or local recovery losing the typed value.
  it("validates a local specimen with associated errors and preserves input on recovery", async () => {
    render(<DesignShowcase />);
    const field = screen.getByRole("textbox", {
      name: /Required example name/,
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Check example" }),
    );
    expect(field).toHaveFocus();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(
      /Enter a name for this local example/,
    );
    await userEvent.type(field, "Aarav");
    await userEvent.click(
      screen.getByRole("button", { name: "Check example" }),
    );
    expect(field).not.toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveValue("Aarav");
    expect(
      screen.getByText("Example checked locally. Nothing was submitted."),
    ).toBeVisible();
  });
  // Catches state selectors that only relabel examples instead of changing production props.
  it("switches loading, selected, empty and error states with honest local recovery", async () => {
    render(<DesignShowcase />);
    const lab = within(
      screen.getByRole("region", { name: "Component states" }),
    );
    await userEvent.click(lab.getByRole("checkbox", { name: "Show loading" }));
    expect(
      lab.getByRole("button", { name: /Loading state example/ }),
    ).toBeDisabled();
    await userEvent.click(lab.getByRole("checkbox", { name: "Show loading" }));
    await userEvent.click(lab.getByRole("button", { name: "State action" }));
    expect(lab.getByText("Activations: 1")).toBeVisible();
    await userEvent.click(lab.getByRole("radio", { name: "Empty" }));
    expect(
      lab.getByRole("heading", { name: "No examples selected" }),
    ).toBeVisible();
    await userEvent.click(lab.getByRole("button", { name: "Restore example" }));
    expect(
      lab.getByRole("heading", { name: "Example content ready" }),
    ).toBeVisible();
    await userEvent.click(lab.getByRole("radio", { name: "Error" }));
    expect(
      lab.getByRole("heading", { name: "Example could not be displayed" }),
    ).toBeVisible();
    await userEvent.click(
      lab.getByRole("button", { name: "Reset error example" }),
    );
    expect(lab.getByRole("radio", { name: "Ready" })).toBeChecked();
    expect(lab.getByRole("radio", { name: "Ready" })).toHaveFocus();
    await userEvent.click(lab.getByRole("radio", { name: "Loading" }));
    expect(
      lab.getByRole("region", { name: "Loading content example" }),
    ).toHaveAttribute("aria-busy", "true");
  });
  // Catches drift from domain presentation rules, actual actions, and removal focus ownership.
  it("composes real domain scores, statuses, priorities and accessible example actions", async () => {
    render(<DesignShowcase />);
    const domain = within(
      screen.getByRole("region", { name: "SkillBridge components" }),
    );
    for (const name of [
      "Excellent Match",
      "Strong Match",
      "Low Match",
      "Shortlisted",
      "Interview",
      "Rejected",
      "High priority",
      "Medium priority",
      "Low priority",
    ])
      expect(domain.getAllByText(name).length).toBeGreaterThan(0);
    expect(
      domain.getByRole("progressbar", { name: "Profile completion" }),
    ).toHaveAttribute("aria-valuetext", "75%; 6 of 8 items complete");
    await userEvent.click(
      domain.getByRole("button", { name: "Inspect example — Asha Patel" }),
    );
    expect(domain.getByRole("status")).toHaveTextContent("Asha Patel");
    await userEvent.click(
      domain.getByRole("button", { name: "Remove Docker" }),
    );
    expect(
      domain.queryByRole("button", { name: "Remove Docker" }),
    ).not.toBeInTheDocument();
    const restore = domain.getByRole("button", { name: "Restore Docker chip" });
    expect(restore).toHaveFocus();
    await userEvent.click(restore);
    expect(domain.getByRole("button", { name: "Remove Docker" })).toBeVisible();
  });
});
