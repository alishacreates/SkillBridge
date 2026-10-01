import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StudentDashboard } from "./student-dashboard";
import { RecommendationsSection } from "./recommendations-section";
import { opportunities } from "./dashboard-data";

// jsdom has no layout/media-query engine; responsive behavior is tested in Chromium.
beforeEach(() =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  ),
);
afterEach(() => vi.unstubAllGlobals());

describe("student dashboard composition", () => {
  // Missing sections or accidental replacement of domain components would break this contract.
  it("renders the major sections, metrics, opportunities, and recent application states", () => {
    render(<StudentDashboard />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Welcome back, Aarav.",
    );
    for (const heading of [
      "Match overview",
      "Skill proficiency",
      "Recommended opportunities",
      "Learning recommendations",
      "Recent applications",
      "Upcoming deadlines",
      "Profile completion",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeVisible();
    }
    const recommended = screen.getByRole("region", {
      name: "Recommended opportunities",
    });
    expect(
      within(recommended).getAllByRole("button", {
        name: /View sample details/,
      }),
    ).toHaveLength(3);
    expect(within(recommended).getByText("94%")).toBeVisible();
    expect(within(recommended).getByText("86%")).toBeVisible();
    expect(within(recommended).getByText("72%")).toBeVisible();
    const applications = screen.getByRole("region", {
      name: "Recent applications",
    });
    for (const status of [
      "Applied",
      "Under review",
      "Shortlisted",
      "Interview",
    ])
      expect(within(applications).getByText(status)).toBeVisible();
    expect(screen.getByText(/Representative local data/)).toBeVisible();
    expect(screen.getByRole("link", { name: "Design system" })).toHaveAttribute(
      "href",
      "/design",
    );
    expect(
      screen.getByRole("progressbar", { name: "Profile completion" }),
    ).toHaveAttribute("aria-valuetext", "82%; 9 of 11 items complete");
  });
  // Prevents placeholder links accidentally implying feature routes already exist.
  it("marks Dashboard current and renders other destinations as unavailable text", () => {
    render(<StudentDashboard />);
    const nav = screen.getByRole("navigation", { name: "Desktop navigation" });
    expect(
      within(nav).getByRole("link", { name: "Dashboard" }),
    ).toHaveAttribute("aria-current", "page");
    expect(within(nav).getAllByRole("link")).toHaveLength(1);
    for (const label of [
      "Opportunities",
      "Skill Assessment",
      "Skill Gap Analysis",
      "Applications",
      "Profile",
    ])
      expect(within(nav).getByText(label)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Notifications/ }),
    ).toBeDisabled();
  });
  // Catches stale expanded state or focus disappearing when the disclosure closes.
  it("opens mobile navigation with keyboard and restores focus on Escape", async () => {
    render(<StudentDashboard />);
    const trigger = screen.getByRole("button", { name: "Open navigation" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    expect(
      screen.getByRole("button", { name: "Close navigation" }),
    ).toHaveAttribute("aria-expanded", "true");
    const nav = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(nav).getByRole("link", { name: "Dashboard" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  // Catches a decorative search field, forgotten normalisation, or a broken clear action.
  it("recovers navigation focus when CSS hides its owner before the media event", async () => {
    let resize: ((event: { matches: boolean }) => void) | undefined;
    vi.stubGlobal("matchMedia", () => ({
      addEventListener: (_: string, listener: typeof resize) => {
        resize = listener;
      },
      removeEventListener: vi.fn(),
    }));
    render(<StudentDashboard />);
    act(() => resize?.({ matches: true }));
    expect(document.body).toHaveFocus();
    await userEvent.click(
      screen.getByRole("button", { name: "Open navigation" }),
    );
    const mobile = within(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).getByRole("link", { name: "Dashboard" });
    expect(mobile).toHaveFocus();
    // Chromium can clear focus after display:none, before its media change callback.
    mobile.blur();
    expect(document.body).toHaveFocus();
    act(() => resize?.({ matches: true }));
    const desktop = within(
      screen.getByRole("navigation", { name: "Desktop navigation" }),
    ).getByRole("link", { name: "Dashboard" });
    expect(desktop).toHaveFocus();
    desktop.blur();
    act(() => resize?.({ matches: false }));
    expect(
      screen.getByRole("button", { name: "Open navigation" }),
    ).toHaveFocus();
    const search = screen.getByRole("textbox", {
      name: "Search sample opportunities",
    });
    search.focus();
    act(() => resize?.({ matches: true }));
    expect(search).toHaveFocus();
  });
  it("searches the local samples on submit, explains no results, and clears accessibly", async () => {
    render(<StudentDashboard />);
    const input = screen.getByRole("textbox", {
      name: "Search sample opportunities",
    });
    await userEvent.type(input, "  ORBIT  ");
    await userEvent.click(
      screen.getByRole("button", { name: "Search opportunities" }),
    );
    const region = () =>
      within(screen.getByRole("region", { name: "Recommended opportunities" }));
    expect(
      region().getAllByRole("button", { name: /View sample details/ }),
    ).toHaveLength(1);
    expect(region().getByText("Orbit Systems")).toBeVisible();
    await userEvent.clear(input);
    await userEvent.type(input, "unknown-sample");
    await userEvent.click(
      screen.getByRole("button", { name: "Search opportunities" }),
    );
    expect(
      region().getByRole("heading", { name: "No matching samples" }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(
      region().getAllByRole("button", { name: /View sample details/ }),
    ).toHaveLength(3);
  });
  it("does not submit an unfinished IME composition", () => {
    render(<StudentDashboard />);
    const input = screen.getByRole("textbox", {
      name: "Search sample opportunities",
    });
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "Orbit" } });
    fireEvent.submit(screen.getByRole("search"));
    expect(
      within(
        screen.getByRole("region", { name: "Recommended opportunities" }),
      ).getAllByRole("button", { name: /View sample details/ }),
    ).toHaveLength(3);
  });
  // Catches actions leading to invented routes instead of actual in-page sample previews.
  it("opens sample opportunity/learning details and returns focus when closed", async () => {
    render(<StudentDashboard />);
    const trigger = screen.getByRole("button", {
      name: "View sample details — Frontend Engineer Intern",
    });
    await userEvent.click(trigger);
    expect(
      screen.getByRole("heading", {
        name: "Sample details: Frontend Engineer Intern",
      }),
    ).toHaveFocus();
    expect(screen.getByText(/not an active vacancy/)).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Close sample details" }),
    );
    expect(trigger).toHaveFocus();
    await userEvent.click(
      screen.getByRole("button", {
        name: "Preview topics — Jest testing fundamentals",
      }),
    );
    expect(screen.getByText("Arrange, act, assert")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Learning outline: Jest testing fundamentals",
      }),
    ).toHaveFocus();
  });
  it("provides readable chart values and a summary independently of SVG colors", () => {
    render(<StudentDashboard />);
    const overview = screen.getByRole("region", { name: "Match overview" });
    expect(within(overview).getByText(/56% to 78%/)).toBeVisible();
    expect(within(overview).getByText("12 opportunities · 60%")).toBeVisible();
    expect(within(overview).getByText("6 opportunities · 30%")).toBeVisible();
    expect(within(overview).getByText("2 opportunities · 10%")).toBeVisible();
  });
});

describe("recommendation alternate states", () => {
  it("labels loading and uses decorative skeletons without usable sample actions", () => {
    render(
      <RecommendationsSection state="loading" opportunities={opportunities} />,
    );
    expect(
      screen.getByRole("region", { name: "Recommended opportunities" }),
    ).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Loading sample opportunities…")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /View sample details/ }),
    ).not.toBeInTheDocument();
  });
  it("shows an honest empty state", () => {
    render(
      <RecommendationsSection state="empty" opportunities={opportunities} />,
    );
    expect(
      screen.getByRole("heading", { name: "No recommendations yet" }),
    ).toBeVisible();
  });
  it("offers explicit recovery from an error without fabricating a request", async () => {
    const retry = vi.fn();
    render(
      <RecommendationsSection
        state="error"
        opportunities={opportunities}
        onRetry={retry}
      />,
    );
    expect(
      screen.getByRole("heading", {
        name: "Could not display recommendations",
      }),
    ).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Restore sample data" }),
    );
    expect(retry).toHaveBeenCalledOnce();
  });
});
