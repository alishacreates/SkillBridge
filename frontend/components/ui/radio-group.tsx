"use client";

import type { ComponentPropsWithRef } from "react";
import { FieldLabel, FieldMessages, type FieldProps, useField } from "./field";
import { classes } from "./classes";
import styles from "./field.module.css";

export type RadioOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};
export type RadioGroupProps = Omit<
  ComponentPropsWithRef<"fieldset">,
  "onChange" | "defaultValue" | "children" | "name"
> &
  FieldProps & {
    name: string;
    options: readonly RadioOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
  };

export function RadioGroup({
  label,
  description,
  error,
  id,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  required,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: RadioGroupProps) {
  const field = useField(id, description, error, describedBy);
  return (
    <fieldset
      {...props}
      id={field.id}
      className={classes(styles.group, className)}
      aria-describedby={field.describedBy}
      aria-invalid={error ? true : invalid}
    >
      <legend className={styles.label}>
        <FieldLabel label={label} required={required} />
      </legend>
      <div className={styles.options}>
        {options.map((option, index) => {
          const optionId = `${field.id}-option-${index}`;
          const optionDescription = option.description
            ? `${optionId}-description`
            : undefined;
          return (
            <div key={option.value}>
              <label htmlFor={optionId} className={styles.choice}>
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  required={required}
                  disabled={option.disabled}
                  checked={
                    value === undefined ? undefined : value === option.value
                  }
                  defaultChecked={
                    value === undefined
                      ? defaultValue === option.value
                      : undefined
                  }
                  onChange={(event) =>
                    onValueChange?.(event.currentTarget.value)
                  }
                  aria-describedby={
                    [field.describedBy, optionDescription]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  className={styles.choiceControl}
                />
                <span>{option.label}</span>
              </label>
              {option.description && (
                <p id={optionDescription} className={styles.description}>
                  {option.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <FieldMessages field={field} description={description} error={error} />
    </fieldset>
  );
}
