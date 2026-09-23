import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SkillChip } from "./skill-chip";
import { OpportunityCard, type OpportunityCardProps } from "./opportunity-card";
import { ProfileCompletion } from "./profile-completion";
import { CandidateMatchRow } from "./candidate-match-row";
import { SkillGapCard } from "./skill-gap-card";
import { SkillProgress } from "./skill-progress";
import { DashboardStatCard } from "./dashboard-stat-card";
import { LearningRecommendationCard } from "./learning-recommendation-card";
import { DeadlineItem } from "./deadline-item";

const opportunity: OpportunityCardProps = {
  title: "Frontend engineering intern — accessible developer platforms",
  company: "Northstar Labs",
  location: "Bengaluru",
  workMode: "Hybrid",
  stipend: "₹25,000 / month",
  duration: "6 months",
  deadline: { dateTime: "2026-10-15", label: "15 October 2026" },
  requiredSkills: [{ name: "React" }, { name: "TypeScript" }],
  matchScore: 92,
  applicationStatus: "APPLIED",
  action: { label: "View opportunity", href: "/opportunities/example" },
};

describe("domain composition", () => {
  // Catches an inaccessible remove affordance or removal that silently happens while disabled.
  it("renders skill meaning and an explicitly named removable control", async () => {
    const remove = vi.fn();
    const { rerender } = render(
      <SkillChip
        name="Git"
        proficiency="ADVANCED"
        verified
        onRemove={remove}
      />,
    );
    expect(screen.getByText(/Git/)).toHaveTextContent(
      "Git · Advanced · Verified",
    );
    const button = screen.getByRole("button", { name: "Remove Git" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(remove).toHaveBeenCalledOnce();
    rerender(<SkillChip name="Git" onRemove={remove} removeDisabled />);
    expect(screen.getByRole("button")).toBeDisabled();
    await userEvent.click(screen.getByRole("button"));
    expect(remove).toHaveBeenCalledOnce();
  });
  // Catches missing opportunity metadata and entire-card click semantics.
  it("renders opportunity content with a real, contextual navigation link", () => {
    render(<OpportunityCard {...opportunity} />);
    expect(
      screen.getByRole("heading", { name: opportunity.title }),
    ).toBeVisible();
    for (const value of [
      "Northstar Labs",
      "Bengaluru",
      "Hybrid",
      "₹25,000 / month",
      "6 months",
      "React",
      "TypeScript",
      "Applied",
    ]) {
      expect(screen.getByText(value)).toBeVisible();
    }
    expect(screen.getByText("15 October 2026")).toHaveAttribute(
      "datetime",
      "2026-10-15",
    );
    expect(
      screen.getByRole("link", {
        name: `View opportunity — ${opportunity.title}`,
      }),
    ).toHaveAttribute("href", "/opportunities/example");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("delegates opportunity actions to Button including busy prevention", async () => {
    const action = vi.fn();
    const { rerender } = render(
      <OpportunityCard
        {...opportunity}
        action={{ label: "Apply", onClick: action }}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: `Apply — ${opportunity.title}` }),
    );
    expect(action).toHaveBeenCalledOnce();
    rerender(
      <OpportunityCard
        {...opportunity}
        action={{ label: "Apply", onClick: action, loading: true }}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    await userEvent.click(screen.getByRole("button"));
    expect(action).toHaveBeenCalledOnce();
  });
  // Catches percentage/count data being replaced with a decorative bar with no accessible units.
  it("exposes profile completion, counts, and the next action", async () => {
    const next = vi.fn();
    render(
      <ProfileCompletion
        percentage={75}
        completedItems={6}
        totalItems={8}
        nextAction={{ label: "Add your bio", onClick: next }}
      />,
    );
    expect(screen.getByText("6 of 8 items complete")).toBeVisible();
    expect(
      screen.getByRole("progressbar", { name: "Profile completion" }),
    ).toHaveAttribute("aria-valuetext", "75%; 6 of 8 items complete");
    await userEvent.click(screen.getByRole("button", { name: /Add your bio/ }));
    expect(next).toHaveBeenCalledOnce();
  });
  // Catches ambiguous repeated 'View' actions and lost candidate summary/status data.
  it("gives a candidate action its identity and retains keyboard activation", async () => {
    const view = vi.fn();
    render(
      <CandidateMatchRow
        name="Asha Patel"
        summary="B.Tech · Riverdale University"
        topSkills={[{ name: "React" }]}
        matchScore={88}
        applicationStatus="SHORTLISTED"
        action={{ label: "View profile", onClick: view }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Asha Patel" })).toBeVisible();
    expect(screen.getByText("B.Tech · Riverdale University")).toBeVisible();
    expect(screen.getByText("Shortlisted")).toBeVisible();
    expect(screen.getByText("React")).toBeVisible();
    screen.getByRole("button", { name: "View profile — Asha Patel" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(view).toHaveBeenCalledOnce();
  });
  // Catches merging strong/missing skills into an undifferentiated list.
  it("keeps strong and missing skills separately labelled", () => {
    render(
      <SkillGapCard
        targetRole="Backend engineer"
        readiness={60}
        strongSkills={[{ name: "Git", verified: true }]}
        missingSkills={[{ name: "PostgreSQL" }]}
      />,
    );
    expect(
      within(screen.getByRole("list", { name: "Strong skills" })).getByText(
        /Git/,
      ),
    ).toBeVisible();
    expect(
      within(screen.getByRole("list", { name: "Missing skills" })).getByText(
        "PostgreSQL",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("progressbar", {
        name: "Readiness for Backend engineer",
      }),
    ).toHaveAttribute("aria-valuenow", "60");
  });
  it("makes empty supplied skill lists explicit without inventing missing skills", () => {
    render(
      <SkillGapCard
        targetRole="Engineer"
        readiness={0}
        strongSkills={[]}
        missingSkills={[]}
      />,
    );
    expect(screen.getByText("No strong skills supplied.")).toBeVisible();
    expect(screen.getByText("No missing skills supplied.")).toBeVisible();
  });
  it("shows current and target milestones without inventing a percentage", () => {
    const { rerender } = render(
      <SkillProgress skill="React" current="Intermediate" target="Advanced" />,
    );
    expect(screen.getByText("Current: Intermediate")).toBeVisible();
    expect(screen.getByText("Target: Advanced")).toBeVisible();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    rerender(
      <SkillProgress skill="React" current="Intermediate" percentage={65} />,
    );
    expect(
      screen.getByRole("progressbar", { name: "React progress" }),
    ).toHaveAttribute("aria-valuenow", "65");
  });
  it("keeps zero-valued statistics and their contextual meaning visible", () => {
    render(
      <DashboardStatCard
        label="Applications"
        value={0}
        context="No submissions this week"
        icon={<span>Decorative icon</span>}
        accent="info"
      />,
    );
    expect(screen.getByText("Applications")).toBeVisible();
    expect(screen.getByText("0")).toBeVisible();
    expect(screen.getByText("No submissions this week")).toBeVisible();
    expect(screen.getByText("Decorative icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
  it.each([
    ["HIGH", "High priority"],
    ["MEDIUM", "Medium priority"],
    ["LOW", "Low priority"],
  ] as const)(
    "labels learning priority %s and difficulty",
    (priority, label) => {
      render(
        <LearningRecommendationCard
          skill="SQL"
          title="Query foundations"
          difficulty="BEGINNER"
          priority={priority}
          estimatedEffort="3 hours"
          action={{ label: "Open resource", href: "https://example.com/learn" }}
        />,
      );
      expect(screen.getByText(label)).toBeVisible();
      expect(screen.getByText("Beginner")).toBeVisible();
      expect(screen.getByText("Estimated effort: 3 hours")).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Open resource — Query foundations" }),
      ).toHaveAttribute("href", "https://example.com/learn");
    },
  );
  it("renders deadline date and explicit caller-owned urgency without a clock", () => {
    render(
      <DeadlineItem
        title="Platform intern"
        context="Northstar Labs"
        date={{ dateTime: "2026-10-15", label: "15 October 2026" }}
        type="Application deadline"
        status="Applied"
        urgency="soon"
      />,
    );
    expect(screen.getByText("15 October 2026")).toHaveAttribute(
      "datetime",
      "2026-10-15",
    );
    expect(screen.getByText("Due soon")).toBeVisible();
    expect(screen.getByText("Application deadline")).toBeVisible();
    expect(screen.getByText("Applied")).toBeVisible();
  });
});
