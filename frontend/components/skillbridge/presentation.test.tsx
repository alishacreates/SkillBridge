import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchScore } from "./match-score";
import { ApplicationStatusBadge } from "./application-status-badge";
import type { ApplicationStatus } from "./presentation";

describe("match presentation", () => {
  // Catches off-by-one thresholds and scores whose meaning is conveyed only by color.
  it.each([
    [59, "Low Match"],
    [60, "Moderate Match"],
    [74, "Moderate Match"],
    [75, "Strong Match"],
    [89, "Strong Match"],
    [90, "Excellent Match"],
    [100, "Excellent Match"],
    [89.9, "Strong Match"],
  ])("presents %s with %s", (score, label) => {
    render(<MatchScore score={score} />);
    expect(screen.getByText(`${score}%`)).toBeVisible();
    expect(screen.getByText(label)).toBeVisible();
    expect(
      screen.getByRole("group", { name: `${score}% — ${label}` }),
    ).toBeInTheDocument();
  });
  it("uses an accessible progress primitive in the large presentation", () => {
    render(<MatchScore score={92} size="large" />);
    expect(
      screen.getByRole("progressbar", { name: "Match score" }),
    ).toHaveAttribute("aria-valuetext", "92% — Excellent Match");
  });
  it.each([
    [-1, "0%"],
    [120, "100%"],
  ])("bounds %s consistently in text and progress", (score, text) => {
    render(<MatchScore score={score} size="large" />);
    expect(screen.getByText(text, { selector: "strong" })).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      text.slice(0, -1),
    );
  });
  it("does not render a misleading NaN score", () => {
    expect(() => render(<MatchScore score={NaN} />)).toThrow(RangeError);
  });
});

describe("application status presentation", () => {
  // Catches missing mappings and an outcome shown as raw internal enum text.
  it.each<[ApplicationStatus, string, string]>([
    ["SAVED", "Saved", "neutral"],
    ["APPLIED", "Applied", "info"],
    ["UNDER_REVIEW", "Under review", "info"],
    ["SHORTLISTED", "Shortlisted", "success"],
    ["INTERVIEW", "Interview", "info"],
    ["SELECTED", "Selected", "success"],
    ["REJECTED", "Rejected", "neutral"],
  ])("maps %s to %s", (status, label, tone) => {
    render(<ApplicationStatusBadge status={status} />);
    expect(screen.getByText(label)).toHaveAttribute("data-variant", tone);
  });
});
