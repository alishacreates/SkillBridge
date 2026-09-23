import type { ComponentPropsWithRef } from "react";
import { classes } from "./classes";
import styles from "./card.module.css";

export function Card({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={classes(styles.card, className)} />;
}
export function CardHeader({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return <div {...props} className={classes(styles.header, className)} />;
}
export function CardTitle({
  as: Heading = "h2",
  className,
  ...props
}: ComponentPropsWithRef<"h2"> & { as?: "h2" | "h3" | "h4" }) {
  return <Heading {...props} className={classes(styles.title, className)} />;
}
export function CardDescription({
  className,
  ...props
}: ComponentPropsWithRef<"p">) {
  return <p {...props} className={classes(styles.description, className)} />;
}
export function CardContent({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return <div {...props} className={classes(styles.content, className)} />;
}
export function CardFooter({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return <div {...props} className={classes(styles.footer, className)} />;
}
