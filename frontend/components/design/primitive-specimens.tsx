"use client";
import { useRef, useState, type FormEvent } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  IconButton,
  Input,
  ProgressBar,
  RadioGroup,
  Select,
  Textarea,
} from "../ui";
import { DashboardIcon } from "../../layout/dashboard-icons";
import styles from "./design.module.css";

export function PrimitiveSpecimens() {
  const [message, setMessage] = useState(
    "Try a control. All examples stay on this page.",
  );
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const invalid = checked && !name.trim();
  function checkExample(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
    if (!name.trim()) input.current?.focus();
    setMessage(
      name.trim()
        ? "Example checked locally. Nothing was submitted."
        : "Correct the required example name.",
    );
  }
  return (
    <section
      id="primitives"
      aria-labelledby="primitives-heading"
      className={styles.section}
    >
      <header className={styles.sectionHeader}>
        <h2 id="primitives-heading" tabIndex={-1}>
          UI primitives
        </h2>
        <p>
          Product-agnostic building blocks. These are the same exports the
          dashboard uses.
        </p>
      </header>
      <p role="status" className={styles.feedback}>
        {message}
      </p>
      <h3>Button &amp; IconButton</h3>
      <div className={styles.row}>
        {(
          ["primary", "secondary", "outline", "ghost", "destructive"] as const
        ).map((variant) => (
          <Button
            key={variant}
            variant={variant}
            onClick={() =>
              setMessage(
                `${variant} variant activated.${variant === "destructive" ? " No data deleted." : ""}`,
              )
            }
          >
            Try {variant}
          </Button>
        ))}
      </div>
      <p className={styles.note}>
        The destructive specimen only demonstrates appearance and activation; it
        deletes nothing.
      </p>
      <div className={styles.row}>
        {(["sm", "md", "lg"] as const).map((size) => (
          <Button
            key={size}
            size={size}
            variant="outline"
            onClick={() => setMessage(`${size} button activated`)}
          >
            {size} button
          </Button>
        ))}
        <Button disabled>Unavailable action</Button>
        <Button loading loadingLabel="Loading example">
          Loading example
        </Button>
        <IconButton
          label="Increment example counter"
          onClick={() => {
            setCount(count + 1);
            setMessage(`Counter: ${count + 1}`);
          }}
        >
          <DashboardIcon name="assessment" />
        </IconButton>
      </div>
      <h3>Input, Textarea &amp; Select</h3>
      <form noValidate onSubmit={checkExample} className={styles.twoColumns}>
        <Input label="Default input" placeholder="Try a short label" />
        <Input
          label="Input with help"
          description="Labels remain visible when values are entered."
          leadingVisual={<DashboardIcon name="profile" />}
        />
        <Input
          label="Error specimen"
          defaultValue="Incomplete example"
          error="This is a displayed error example, not a server response."
        />
        <Input
          label="Disabled input"
          defaultValue="Unavailable example"
          disabled
        />
        <Textarea
          label="Example notes"
          description="Native text entry with vertical resizing. Nothing is saved."
          placeholder="Describe a design decision"
        />
        <div className={styles.stack}>
          <Select
            label="Example format"
            placeholder="Choose a format"
            description="Native select: the browser owns its option popup."
          >
            <option value="compact">Compact</option>
            <option value="detailed">Detailed</option>
            <option value="future" disabled>
              Future format (unavailable)
            </option>
          </Select>
          <Input
            ref={input}
            label="Required example name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            {...(invalid
              ? { error: "Enter a name for this local example." }
              : {
                  description:
                    "Check the empty field to inspect validation and focus.",
                })}
          />
          <div>
            <Button type="submit" variant="outline">
              Check example
            </Button>
          </div>
        </div>
      </form>
      <h3>Checkbox &amp; RadioGroup</h3>
      <div className={styles.twoColumns}>
        <div className={styles.stack}>
          <Checkbox
            label="Receive example updates"
            description="A native checkbox; this preference is not saved."
          />
          <Checkbox label="Selected checkbox" defaultChecked />
          <Checkbox label="Unavailable checkbox" disabled />
        </div>
        <RadioGroup
          label="Example density"
          name="design-density"
          defaultValue="comfortable"
          options={[
            { value: "comfortable", label: "Comfortable" },
            { value: "compact", label: "Compact" },
            { value: "future", label: "Unavailable density", disabled: true },
          ]}
          description="Arrow keys move between available options."
        />
      </div>
      <h3>Badge, Avatar, Card &amp; ProgressBar</h3>
      <div className={styles.row}>
        {(
          ["neutral", "primary", "success", "warning", "error", "info"] as const
        ).map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>
      <div className={styles.twoColumns}>
        <Card>
          <CardHeader>
            <CardTitle as="h4">A composed Card</CardTitle>
            <CardDescription>
              Header, description, content, and footer—without a clickable
              container.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressBar label="Example progress" value={64} />
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => setMessage("Card footer action activated")}
            >
              Try card action
            </Button>
          </CardFooter>
        </Card>
        <div className={styles.stack}>
          <p className={styles.note}>Avatar · initials and sizes</p>
          <div className={styles.row}>
            {(["sm", "md", "lg"] as const).map((size) => (
              <Avatar
                key={size}
                alt={`Aarav Mehta, ${size} avatar`}
                initials="AM"
                size={size}
              />
            ))}
          </div>
          <p>
            Images reserve the same footprint; initials remain a useful
            fallback.
          </p>
          <p>
            Skeleton, EmptyState, and ErrorState are demonstrated in the state
            lab below.
          </p>
          <a href="#states-heading">Explore feedback states</a>
        </div>
      </div>
    </section>
  );
}
