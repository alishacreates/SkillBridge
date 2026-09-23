import { Button, type ButtonProps } from "../ui";
import styles from "./domain.module.css";

/** Navigation stays a link; mutations stay a button. The caller owns the outcome. */
export type DomainAction = { label: string; accessibleLabel?: string } & (
  | { href: string; onClick?: never; disabled?: never; loading?: never }
  | {
      href?: never;
      onClick: NonNullable<ButtonProps["onClick"]>;
      disabled?: boolean;
      loading?: boolean;
    }
);
export function DomainActionControl({
  action,
  context,
}: {
  action: DomainAction;
  context: string;
}) {
  const name = action.accessibleLabel ?? `${action.label} — ${context}`;
  if (action.href !== undefined) {
    return (
      <a className={styles.actionLink} href={action.href} aria-label={name}>
        {action.label}
      </a>
    );
  }
  return (
    <Button
      size="sm"
      onClick={action.onClick}
      disabled={action.disabled}
      loading={action.loading ?? false}
      aria-label={name}
    >
      {action.label}
    </Button>
  );
}
