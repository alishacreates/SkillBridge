import type { ComponentPropsWithRef } from "react";
import { classes } from "./classes";
import styles from "./button.module.css";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingLabel?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel = "Loading",
  type = "button",
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      data-variant={variant}
      data-size={size}
      className={classes(styles.button, className)}
    >
      <span className={styles.content}>{children}</span>
      <span className={styles.busy} aria-hidden={!loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <span className={styles.loadingText}>{loadingLabel}</span>
      </span>
    </button>
  );
}
