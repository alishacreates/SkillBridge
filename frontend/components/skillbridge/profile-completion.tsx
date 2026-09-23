import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  ProgressBar,
} from "../ui";
import { DomainActionControl, type DomainAction } from "./domain-action";
import type { HeadingLevel } from "./presentation";
import { percentage as boundedPercentage } from "./presentation";
import styles from "./domain.module.css";
export type ProfileCompletionProps = {
  percentage: number;
  completedItems: number;
  totalItems: number;
  nextAction?: DomainAction;
  headingLevel?: HeadingLevel;
};
export function ProfileCompletion({
  percentage,
  completedItems,
  totalItems,
  nextAction,
  headingLevel = "h2",
}: ProfileCompletionProps) {
  const value = boundedPercentage(percentage);
  const counts = `${completedItems} of ${totalItems} items complete`;
  return (
    <Card className={styles.surface}>
      <CardHeader>
        <CardTitle as={headingLevel}>Profile completion</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <ProgressBar
          label="Profile completion"
          value={value}
          aria-valuetext={`${value}%; ${counts}`}
        />
        <p className={styles.secondary}>{counts}</p>
      </CardContent>
      {nextAction && (
        <CardFooter>
          <DomainActionControl
            action={nextAction}
            context="Profile completion"
          />
        </CardFooter>
      )}
    </Card>
  );
}
