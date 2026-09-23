import { Badge, IconButton } from "../ui";
import { proficiencyLabels, type Proficiency } from "./presentation";
import styles from "./domain.module.css";
export type Skill = {
  name: string;
  proficiency?: Proficiency;
  verified?: boolean;
};
export type SkillChipProps = Skill & {
  onRemove?: () => void;
  removeDisabled?: boolean;
};
export function SkillChip({
  name,
  proficiency,
  verified,
  onRemove,
  removeDisabled,
}: SkillChipProps) {
  const text = [
    name,
    proficiency && proficiencyLabels[proficiency],
    verified && "Verified",
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <span className={styles.chip}>
      <Badge variant="neutral">{text}</Badge>
      {onRemove && (
        <IconButton
          label={`Remove ${name}`}
          size="md"
          onClick={onRemove}
          disabled={removeDisabled}
        >
          <span aria-hidden="true">×</span>
        </IconButton>
      )}
    </span>
  );
}
