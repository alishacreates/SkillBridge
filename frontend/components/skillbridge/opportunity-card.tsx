import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui";
import { DomainActionControl, type DomainAction } from "./domain-action";
import { SkillChip, type Skill } from "./skill-chip";
import type {
  ApplicationStatus,
  DisplayDate,
  HeadingLevel,
} from "./presentation";
import { ApplicationStatusBadge } from "./application-status-badge";
import { MatchScore } from "./match-score";
import styles from "./domain.module.css";

export type OpportunityCardProps = {
  company: string;
  title: string;
  location: string;
  workMode: string;
  stipend: string;
  duration: string;
  deadline: DisplayDate;
  requiredSkills: readonly Skill[];
  matchScore: number;
  applicationStatus?: ApplicationStatus;
  action: DomainAction;
  headingLevel?: HeadingLevel;
};
export function OpportunityCard({
  company,
  title,
  location,
  workMode,
  stipend,
  duration,
  deadline,
  requiredSkills,
  matchScore,
  applicationStatus,
  action,
  headingLevel = "h2",
}: OpportunityCardProps) {
  return (
    <Card className={styles.surface}>
      <CardHeader>
        <div className={styles.split}>
          <p className={styles.eyebrow}>{company}</p>
          {applicationStatus && (
            <ApplicationStatusBadge status={applicationStatus} />
          )}
        </div>
        <CardTitle as={headingLevel}>{title}</CardTitle>
        <div className={styles.row}>
          <span className={styles.secondary}>{location}</span>
          <Badge>{workMode}</Badge>
        </div>
      </CardHeader>
      <CardContent className={styles.content}>
        <dl className={styles.metadata}>
          <div>
            <dt>Stipend</dt>
            <dd>{stipend}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{duration}</dd>
          </div>
          <div>
            <dt>Apply by</dt>
            <dd>
              <time dateTime={deadline.dateTime}>{deadline.label}</time>
            </dd>
          </div>
        </dl>
        <div className={styles.stack}>
          <p className={styles.label}>Required skills</p>
          {requiredSkills.length ? (
            <ul className={styles.skillList} aria-label="Required skills">
              {requiredSkills.map((skill) => (
                <li key={skill.name}>
                  <SkillChip {...skill} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.secondary}>No required skills supplied.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className={styles.split}>
        <MatchScore score={matchScore} />
        <DomainActionControl action={action} context={title} />
      </CardFooter>
    </Card>
  );
}
