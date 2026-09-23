import type { BadgeProps } from "../ui";

export type Proficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export const proficiencyLabels: Record<Proficiency, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};
export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";
export type Tone = NonNullable<BadgeProps["variant"]>;
export type DisplayDate = { dateTime: string; label: string };
export type HeadingLevel = "h2" | "h3" | "h4";

export function percentage(value: number): number {
  if (!Number.isFinite(value))
    throw new RangeError("Percentage must be finite.");
  return Math.min(100, Math.max(0, value));
}

export function matchPresentation(score: number): {
  label: string;
  tone: Tone;
} {
  if (score >= 90) return { label: "Excellent Match", tone: "success" };
  if (score >= 75) return { label: "Strong Match", tone: "info" };
  if (score >= 60) return { label: "Moderate Match", tone: "warning" };
  return { label: "Low Match", tone: "neutral" };
}
