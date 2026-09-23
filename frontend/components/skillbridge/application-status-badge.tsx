import { Badge } from "../ui";
import type { ApplicationStatus, Tone } from "./presentation";

const statuses: Record<ApplicationStatus, { label: string; tone: Tone }> = {
  SAVED: { label: "Saved", tone: "neutral" },
  APPLIED: { label: "Applied", tone: "info" },
  UNDER_REVIEW: { label: "Under review", tone: "info" },
  SHORTLISTED: { label: "Shortlisted", tone: "success" },
  INTERVIEW: { label: "Interview", tone: "info" },
  SELECTED: { label: "Selected", tone: "success" },
  REJECTED: { label: "Rejected", tone: "neutral" },
};
export type ApplicationStatusBadgeProps = { status: ApplicationStatus };
export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  const { label, tone } = statuses[status];
  return <Badge variant={tone}>{label}</Badge>;
}
