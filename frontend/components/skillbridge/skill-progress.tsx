import { ProgressBar } from "../ui";
import styles from "./domain.module.css";

export type SkillProgressProps = {
  skill: string;
  current: string;
  target?: string;
  percentage?: number;
};
export function SkillProgress({
  skill,
  current,
  target,
  percentage,
}: SkillProgressProps) {
  return (
    <div className={styles.stack}>
      <p className={styles.label}>{skill}</p>
      <div className={styles.pathway}>
        <p>Current: {current}</p>
        {target && <p>Target: {target}</p>}
      </div>
      {percentage !== undefined && (
        <ProgressBar label={`${skill} progress`} value={percentage} />
      )}
    </div>
  );
}
