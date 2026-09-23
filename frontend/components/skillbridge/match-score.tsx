import { Badge, ProgressBar } from "../ui";
import { matchPresentation, percentage } from "./presentation";
import styles from "./domain.module.css";

export type MatchScoreProps = { score: number; size?: "compact" | "large" };
export function MatchScore({ score, size = "compact" }: MatchScoreProps) {
  const value = percentage(score);
  const { label, tone } = matchPresentation(value);
  const summary = `${value}% — ${label}`;
  return (
    <div
      role="group"
      aria-label={summary}
      className={styles.match}
      data-size={size}
    >
      <div className={styles.row}>
        <strong className={styles.score}>{value}%</strong>
        <Badge variant={tone}>{label}</Badge>
      </div>
      {size === "large" && (
        <ProgressBar
          label="Match score"
          value={value}
          showLabel={false}
          showValue={false}
          aria-valuetext={summary}
        />
      )}
    </div>
  );
}
