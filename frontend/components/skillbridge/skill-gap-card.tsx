import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  ProgressBar,
} from "../ui";
import { DomainActionControl, type DomainAction } from "./domain-action";
import { SkillChip, type Skill } from "./skill-chip";
import type { HeadingLevel } from "./presentation";
import styles from "./domain.module.css";
export type SkillGapCardProps = {
  targetRole: string;
  readiness: number;
  strongSkills: readonly Skill[];
  missingSkills: readonly Skill[];
  action?: DomainAction;
  headingLevel?: HeadingLevel;
};
export function SkillGapCard({
  targetRole,
  readiness,
  strongSkills,
  missingSkills,
  action,
  headingLevel = "h2",
}: SkillGapCardProps) {
  return (
    <Card className={styles.surface}>
      <CardHeader>
        <p className={styles.eyebrow}>Skill pathway</p>
        <CardTitle as={headingLevel}>{targetRole}</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <ProgressBar label={`Readiness for ${targetRole}`} value={readiness} />
        <div className={styles.pathway}>
          <SkillGroup
            label="Strong skills"
            skills={strongSkills}
            empty="No strong skills supplied."
          />
          <SkillGroup
            label="Missing skills"
            skills={missingSkills}
            empty="No missing skills supplied."
          />
        </div>
      </CardContent>
      {action && (
        <CardFooter>
          <DomainActionControl action={action} context={targetRole} />
        </CardFooter>
      )}
    </Card>
  );
}

function SkillGroup({
  label,
  skills,
  empty,
}: {
  label: string;
  skills: readonly Skill[];
  empty: string;
}) {
  return (
    <div className={styles.stack}>
      <p className={styles.label}>{label}</p>
      {skills.length ? (
        <ul className={styles.skillList} aria-label={label}>
          {skills.map((skill) => (
            <li key={skill.name}>
              <SkillChip {...skill} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.secondary}>{empty}</p>
      )}
    </div>
  );
}
