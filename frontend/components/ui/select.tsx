"use client";

import type { ComponentPropsWithRef } from "react";
import { FieldLabel, FieldMessages, type FieldProps, useField } from "./field";
import { classes } from "./classes";
import styles from "./field.module.css";

export type SelectProps = Omit<
  ComponentPropsWithRef<"select">,
  "multiple" | "size"
> &
  FieldProps & {
    placeholder?: string;
  };

export function Select({
  label,
  description,
  error,
  id,
  required,
  className,
  placeholder,
  value,
  defaultValue,
  children,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: SelectProps) {
  const field = useField(id, description, error, describedBy);
  return (
    <div className={styles.field}>
      <label htmlFor={field.id} className={styles.label}>
        <FieldLabel label={label} required={required} />
      </label>
      <select
        {...props}
        id={field.id}
        required={required}
        value={value}
        defaultValue={
          value === undefined
            ? (defaultValue ?? (placeholder ? "" : undefined))
            : undefined
        }
        aria-describedby={field.describedBy}
        aria-invalid={error ? true : invalid}
        className={classes(styles.control, styles.select, className)}
      >
        {placeholder && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <FieldMessages field={field} description={description} error={error} />
    </div>
  );
}
