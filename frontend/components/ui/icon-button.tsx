import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./button";
import { classes } from "./classes";
import styles from "./button.module.css";

export type IconButtonProps = Omit<
  ButtonProps,
  "children" | "aria-label" | "aria-labelledby"
> & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  label,
  children,
  className,
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      variant={variant}
      aria-label={label}
      className={classes(styles.iconButton, className)}
    >
      <span aria-hidden="true" className={styles.icon}>
        {children}
      </span>
    </Button>
  );
}
