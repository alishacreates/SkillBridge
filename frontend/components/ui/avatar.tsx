"use client";

import { useState } from "react";
import { classes } from "./classes";
import styles from "./avatar.module.css";

export type AvatarProps = {
  alt: string;
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Avatar(props: AvatarProps) {
  // A new source gets its own load/error state, without effect-driven resets.
  return <AvatarImage key={props.src ?? "fallback"} {...props} />;
}

function AvatarImage({
  alt,
  src,
  initials,
  size = "md",
  className,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const fallback =
    initials ??
    (alt
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => Array.from(word)[0] ?? "")
      .join("")
      .toLocaleUpperCase() ||
      "?");
  return (
    <span
      className={classes(styles.avatar, className)}
      data-size={size}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={!alt || undefined}
    >
      {src && !failed ? (
        // Caller-provided/blob URLs and error fallback use a native image; CSS reserves its dimensions.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className={styles.image}
        />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </span>
  );
}
