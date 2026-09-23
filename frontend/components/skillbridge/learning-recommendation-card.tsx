import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui";
import { DomainActionControl, type DomainAction } from "./domain-action";
import {
  proficiencyLabels,
  type HeadingLevel,
  type Proficiency,
  type Tone,
} from "./presentation";
import { SkillChip } from "./skill-chip";
import styles from "./domain.module.css";
export type LearningPriority = "HIGH" | "MEDIUM" | "LOW";
export type LearningRecommendationCardProps = {
  skill: string;
  title: string;
  difficulty: Proficiency;
  priority: LearningPriority;
  estimatedEffort?: string;
  action: DomainAction;
  headingLevel?: HeadingLevel;
};
const priorities: Record<LearningPriority, { label: string; tone: Tone }> = {
  HIGH: { label: "High priority", tone: "warning" },
  MEDIUM: { label: "Medium priority", tone: "info" },
  LOW: { label: "Low priority", tone: "neutral" },
};
export function LearningRecommendationCard({
  skill,
  title,
  difficulty,
  priority,
  estimatedEffort,
  action,
  headingLevel = "h2",
}: LearningRecommendationCardProps) {
  const treatment = priorities[priority];
  return (
    <Card className={styles.surface}>
      <CardHeader>
        <div className={styles.split}>
          <SkillChip name={skill} />
          <Badge variant={treatment.tone}>{treatment.label}</Badge>
        </div>
        <CardTitle as={headingLevel}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <div className={styles.row}>
          <span className={styles.secondary}>Difficulty</span>
          <Badge>{proficiencyLabels[difficulty]}</Badge>
        </div>
        {estimatedEffort && (
          <p className={styles.secondary}>
            Estimated effort: {estimatedEffort}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <DomainActionControl action={action} context={title} />
      </CardFooter>
    </Card>
  );
}
