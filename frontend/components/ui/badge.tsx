import type { ComponentPropsWithRef } from "react";
import { classes } from "./classes";
import styles from "./badge.module.css";

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  variant?: "neutral" | "primary" | "success" | "warning" | "error" | "info";
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      data-variant={variant}
      className={classes(styles.badge, className)}
    />
  );
}
