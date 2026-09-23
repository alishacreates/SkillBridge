import type { ReactNode } from "react";
import { Card } from "../ui";
import styles from "./domain.module.css";
export type StatAccent =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "chart-purple"
  | "chart-pink"
  | "chart-yellow"
  | "chart-green"
  | "chart-blue"
  | "chart-cyan"
  | "chart-orange";
export type DashboardStatCardProps = {
  label: string;
  value: string | number;
  context?: string;
  icon?: ReactNode;
  accent?: StatAccent;
};
export function DashboardStatCard({
  label,
  value,
  context,
  icon,
  accent,
}: DashboardStatCardProps) {
  return (
    <Card className={styles.stat} data-accent={accent}>
      <dl>
        <dt className={styles.split}>
          <span>{label}</span>
          {icon && (
            <span aria-hidden="true" className={styles.statIcon}>
              {icon}
            </span>
          )}
        </dt>
        <dd className={styles.statValue}>{value}</dd>
      </dl>
      {context && <p className={styles.secondary}>{context}</p>}
    </Card>
  );
}
