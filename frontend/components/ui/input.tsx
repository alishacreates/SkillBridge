"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { FieldLabel, FieldMessages, type FieldProps, useField } from "./field";
import { classes } from "./classes";
import styles from "./field.module.css";

export type InputProps = Omit<ComponentPropsWithRef<"input">, "size" | "type"> &
  FieldProps & {
    type?:
      | "text"
      | "email"
      | "password"
      | "tel"
      | "url"
      | "number"
      | "search"
      | "date"
      | "time"
      | "datetime-local";
    leadingVisual?: ReactNode;
    trailingVisual?: ReactNode;
  };

export function Input({
  label,
  description,
  error,
  id,
  required,
  className,
  leadingVisual,
  trailingVisual,
  type = "text",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: InputProps) {
  const field = useField(id, description, error, describedBy);
  return (
    <div className={styles.field}>
      <label htmlFor={field.id} className={styles.label}>
        <FieldLabel label={label} required={required} />
      </label>
      <div className={styles.inputShell}>
        {leadingVisual && (
          <span className={styles.leading} aria-hidden="true">
            {leadingVisual}
          </span>
        )}
        <input
          {...props}
          id={field.id}
          type={type}
          required={required}
          aria-describedby={field.describedBy}
          aria-invalid={error ? true : invalid}
          data-leading={Boolean(leadingVisual) || undefined}
          data-trailing={Boolean(trailingVisual) || undefined}
          className={classes(styles.control, className)}
        />
        {trailingVisual && (
          <span className={styles.trailing} aria-hidden="true">
            {trailingVisual}
          </span>
        )}
      </div>
      <FieldMessages field={field} description={description} error={error} />
    </div>
  );
}
