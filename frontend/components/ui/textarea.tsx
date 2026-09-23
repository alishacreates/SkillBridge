"use client";

import type { ComponentPropsWithRef } from "react";
import { FieldLabel, FieldMessages, type FieldProps, useField } from "./field";
import { classes } from "./classes";
import styles from "./field.module.css";

export type TextareaProps = ComponentPropsWithRef<"textarea"> & FieldProps;

export function Textarea({
  label,
  description,
  error,
  id,
  required,
  rows = 4,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextareaProps) {
  const field = useField(id, description, error, describedBy);
  return (
    <div className={styles.field}>
      <label htmlFor={field.id} className={styles.label}>
        <FieldLabel label={label} required={required} />
      </label>
      <textarea
        {...props}
        id={field.id}
        rows={rows}
        required={required}
        aria-describedby={field.describedBy}
        aria-invalid={error ? true : invalid}
        className={classes(styles.control, styles.textarea, className)}
      />
      <FieldMessages field={field} description={description} error={error} />
    </div>
  );
}
