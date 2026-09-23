"use client";

import { useId, type ReactNode } from "react";
import styles from "./field.module.css";

export type FieldProps = {
  label: string;
  description?: ReactNode;
  error?: string | undefined;
};

// Internal shared owner of all field relationships; useId is stable across SSR/hydration.
export function useField(
  id: string | undefined,
  description: ReactNode,
  error: string | undefined,
  describedBy: string | undefined,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  return {
    id: controlId,
    descriptionId,
    errorId,
    describedBy:
      [describedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
      undefined,
  };
}

export function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean | undefined;
}) {
  return (
    <>
      <span>{label}</span>
      {required && <span className={styles.required}> (required)</span>}
    </>
  );
}

export function FieldMessages({
  field,
  description,
  error,
}: {
  field: ReturnType<typeof useField>;
  description: ReactNode;
  error: string | undefined;
}) {
  return (
    <div className={styles.messages}>
      {description && (
        <p id={field.descriptionId} className={styles.description}>
          {description}
        </p>
      )}
      {error && (
        <p id={field.errorId} className={styles.error}>
          Error: {error}
        </p>
      )}
    </div>
  );
}
