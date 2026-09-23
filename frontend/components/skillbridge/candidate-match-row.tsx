import { Avatar, Card, CardTitle } from "../ui";
import { DomainActionControl, type DomainAction } from "./domain-action";
import { SkillChip, type Skill } from "./skill-chip";
import type { ApplicationStatus, HeadingLevel } from "./presentation";
import { MatchScore } from "./match-score";
import { ApplicationStatusBadge } from "./application-status-badge";
import styles from "./domain.module.css";
export type CandidateMatchRowProps = {
  name: string;
  avatar?: { src?: string; initials?: string };
  summary: string;
  topSkills: readonly Skill[];
  matchScore: number;
  applicationStatus?: ApplicationStatus;
  action: DomainAction;
  headingLevel?: HeadingLevel;
};
export function CandidateMatchRow({
  name,
  avatar,
  summary,
  topSkills,
  matchScore,
  applicationStatus,
  action,
  headingLevel = "h2",
}: CandidateMatchRowProps) {
  return (
    <Card className={styles.candidate}>
      <div className={styles.identity}>
        <Avatar alt={name} {...avatar} />
        <div className={styles.stack}>
          <CardTitle as={headingLevel}>{name}</CardTitle>
          <p className={styles.secondary}>{summary}</p>
          {topSkills.length > 0 && (
            <ul
              className={styles.skillList}
              aria-label={`${name}'s top skills`}
            >
              {topSkills.map((skill) => (
                <li key={skill.name}>
                  <SkillChip {...skill} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.stack}>
        <MatchScore score={matchScore} />
        {applicationStatus && (
          <div>
            <ApplicationStatusBadge status={applicationStatus} />
          </div>
        )}
        <DomainActionControl action={action} context={name} />
      </div>
    </Card>
  );
}
