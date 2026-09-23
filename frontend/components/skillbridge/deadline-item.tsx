import { Badge, CardTitle } from "../ui";
import type { DisplayDate, HeadingLevel, Tone } from "./presentation";
import styles from "./domain.module.css";
export type DeadlineItemProps = {
  title: string;
  context: string;
  date: DisplayDate;
  type: string;
  status?: string;
  urgency?: "upcoming" | "soon" | "overdue";
  headingLevel?: HeadingLevel;
};
const urgencyTreatments: Record<
  NonNullable<DeadlineItemProps["urgency"]>,
  { label: string; tone: Tone }
> = {
  upcoming: { label: "Upcoming", tone: "neutral" },
  soon: { label: "Due soon", tone: "warning" },
  overdue: { label: "Overdue", tone: "error" },
};
export function DeadlineItem({
  title,
  context,
  date,
  type,
  status,
  urgency = "upcoming",
  headingLevel = "h2",
}: DeadlineItemProps) {
  const treatment = urgencyTreatments[urgency];
  return (
    <div className={styles.deadline}>
      <div className={styles.stack}>
        <div className={styles.row}>
          <span className={styles.eyebrow}>{type}</span>
          <Badge variant={treatment.tone}>{treatment.label}</Badge>
        </div>
        <CardTitle as={headingLevel}>{title}</CardTitle>
        <p className={styles.secondary}>{context}</p>
        <div className={styles.row}>
          <time dateTime={date.dateTime}>{date.label}</time>
          {status && <Badge>{status}</Badge>}
        </div>
      </div>
    </div>
  );
}
