"use client";

import type { ComponentPropsWithRef } from "react";
import { FieldLabel, FieldMessages, type FieldProps, useField } from "./field";
import { classes } from "./classes";
import styles from "./field.module.css";

export type CheckboxProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "size"
> &
  FieldProps;

export function Checkbox({
  label,
  description,
  error,
  id,
  required,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: CheckboxProps) {
  const field = useField(id, description, error, describedBy);
  return (
    <div className={styles.field}>
      <label htmlFor={field.id} className={styles.choice}>
        <input
          {...props}
          type="checkbox"
          id={field.id}
          required={required}
          aria-describedby={field.describedBy}
          aria-invalid={error ? true : invalid}
          className={classes(styles.choiceControl, className)}
        />
        <span>
          <FieldLabel label={label} required={required} />
        </span>
      </label>
      <FieldMessages field={field} description={description} error={error} />
    </div>
  );
}
