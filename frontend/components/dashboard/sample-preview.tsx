"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Button, Card, CardTitle } from "../ui";
import styles from "./dashboard.module.css";

/** Inline detail, not a modal or a new route. Focus returns to its owner on close. */
export function SamplePreview({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [title]);
  return (
    <Card className={styles.preview}>
      <CardTitle as="h3" ref={heading} tabIndex={-1}>
        {title}
      </CardTitle>
      {children}
      <div>
        <Button variant="outline" onClick={onClose}>
          Close sample details
        </Button>
      </div>
    </Card>
  );
}
