"use client";

import { useId, type ComponentPropsWithRef } from "react";
import { classes } from "./classes";
import styles from "./progress-bar.module.css";

export type ProgressBarProps = Omit<
  ComponentPropsWithRef<"progress">,
  | "value"
  | "max"
  | "children"
  | "aria-label"
  | "aria-labelledby"
  | "aria-valuenow"
  | "aria-valuemin"
  | "aria-valuemax"
> & {
  label: string;
  value: number;
  min?: number;
  max?: number;
  showLabel?: boolean;
  showValue?: boolean;
};

export function ProgressBar({
  label,
  value,
  min = 0,
  max = 100,
  showLabel = true,
  showValue = true,
  id,
  className,
  "aria-valuetext": valueText,
  ...props
}: ProgressBarProps) {
  const generatedId = useId();
  if (![value, min, max, max - min].every(Number.isFinite) || max <= min) {
    throw new RangeError(
      "ProgressBar requires finite values and max greater than min.",
    );
  }
  const bounded = Math.min(max, Math.max(min, value));
  const percentage = Math.round(((bounded - min) / (max - min)) * 100);
  const controlId = id ?? generatedId;
  return (
    <div className={styles.root}>
      {(showLabel || showValue) && (
        <div className={styles.caption}>
          {showLabel && <label htmlFor={controlId}>{label}</label>}
          {showValue && <span aria-hidden="true">{percentage}%</span>}
        </div>
      )}
      <progress
        {...props}
        id={controlId}
        className={classes(styles.progress, className)}
        value={bounded - min}
        max={max - min}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={bounded}
        aria-valuetext={valueText ?? `${percentage}%`}
      >
        {percentage}%
      </progress>
    </div>
  );
}
