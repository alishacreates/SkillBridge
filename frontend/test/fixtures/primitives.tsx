import { useState } from "react";
import { createRoot } from "react-dom/client";
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
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  ProgressBar,
  RadioGroup,
  Select,
  Skeleton,
  Textarea,
} from "../../components/ui";
import "../../app/globals.css";
import styles from "./primitives.module.css";

const variants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
] as const;
const sizes = ["sm", "md", "lg"] as const;
function Plus() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PrimitiveFixture() {
  const [message, setMessage] = useState("No actions yet");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState("daily");
  return (
    <main className={styles.fixture}>
      <header className={styles.header}>
        <p>Internal test surface · not a product route</p>
        <h1>Core UI primitives</h1>
        <p>Native interactions. Shared tokens. No domain behavior.</p>
        <output aria-live="polite">{message}</output>
      </header>

      <section aria-labelledby="actions-heading" className={styles.section}>
        <h2 id="actions-heading">Actions</h2>
        <div className={styles.actionRows}>
          {variants.map((variant) => (
            <div
              key={variant}
              className={styles.row}
              data-testid={`row-${variant}`}
            >
              <span className={styles.rowLabel}>{variant}</span>
              <Button
                variant={variant}
                onClick={() => setMessage(`${variant} activated`)}
              >
                {variant} action
              </Button>
              <Button variant={variant} disabled>
                Unavailable
              </Button>
              <Button variant={variant} loading>
                Save changes
              </Button>
            </div>
          ))}
          <div className={styles.row}>
            {sizes.map((size) => (
              <Button
                key={size}
                size={size}
                onClick={() => setMessage(`${size} activated`)}
              >
                <Plus />
                {size} action
              </Button>
            ))}
            {sizes.map((size) => (
              <IconButton
                key={size}
                size={size}
                label={`Add item ${size}`}
                onClick={() => setMessage(`Add ${size}`)}
              >
                <Plus />
              </IconButton>
            ))}
            <IconButton label="Add item disabled" disabled>
              <Plus />
            </IconButton>
            <IconButton label="Add item busy" loading>
              <Plus />
            </IconButton>
          </div>
          <div className={styles.row}>
            <Button loading={busy} onClick={() => setBusy(true)}>
              Run operation
            </Button>
            <Button variant="outline" onClick={() => setBusy(false)}>
              Reset operation
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="fields-heading" className={styles.section}>
        <h2 id="fields-heading">Fields and choices</h2>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("Fixture form submitted");
          }}
          className={styles.grid}
        >
          <Input
            label="Display name"
            name="displayName"
            placeholder="Enter a name"
            description="Visible label and useful guidance."
            required
            leadingVisual={<Plus />}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            error="Enter a complete email address."
            defaultValue="incomplete"
            trailingVisual={<span>!</span>}
          />
          <Input
            label="Disabled field"
            disabled
            defaultValue="Not editable"
            description="Unavailable until enabled by the owner."
          />
          <Select
            label="Color"
            name="color"
            placeholder="Choose a color"
            description="Platform-owned options."
            required
          >
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option disabled value="green">
              Green (unavailable)
            </option>
          </Select>
          <Select
            label="Invalid selection"
            error="Choose one option."
            placeholder="Choose an option"
          >
            <option>Example</option>
          </Select>
          <Select label="Disabled selection" disabled>
            <option>Fixed choice</option>
          </Select>
          <Textarea
            label="Notes"
            name="notes"
            description="Resize vertically for longer content."
            placeholder="Add context"
          />
          <Textarea
            label="Invalid notes"
            error="Add more detail."
            defaultValue="Short"
            required
          />
          <Textarea
            label="Disabled notes"
            disabled
            defaultValue="Not editable"
          />
          <div>
            <Checkbox label="Send updates" description="Optional preference." />
            <Checkbox label="Confirmed choice" defaultChecked />
            <Checkbox label="Invalid choice" error="Confirm your choice." />
            <Checkbox label="Disabled choice" disabled />
          </div>
          <RadioGroup
            label="Frequency"
            name="frequency"
            value={selected}
            onValueChange={setSelected}
            description="Arrow keys select an available option."
            options={[
              { value: "daily", label: "Daily" },
              { value: "blocked", label: "Unavailable", disabled: true },
              { value: "weekly", label: "Weekly" },
            ]}
          />
          <RadioGroup
            label="Invalid frequency"
            name="invalid-frequency"
            error="Choose a frequency."
            required
            options={[
              { value: "one", label: "Once" },
              { value: "twice", label: "Twice" },
            ]}
          />
          <RadioGroup
            label="Disabled group"
            name="disabled-group"
            disabled
            defaultValue="one"
            options={[
              { value: "one", label: "First" },
              { value: "two", label: "Second" },
            ]}
          />
          <div>
            <Button type="submit">Test submit</Button>
          </div>
        </form>
      </section>

      <section aria-labelledby="display-heading" className={styles.section}>
        <h2 id="display-heading">Display and feedback</h2>
        <div className={styles.row}>
          {(
            [
              "neutral",
              "primary",
              "success",
              "warning",
              "error",
              "info",
            ] as const
          ).map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
          {sizes.map((size) => (
            <Avatar key={size} alt="Alex Morgan" size={size} />
          ))}
          <Avatar alt="Example illustration" src="/avatar.svg" />
        </div>
        <div className={styles.grid}>
          <Card>
            <CardHeader>
              <CardTitle as="h3">A composed surface</CardTitle>
              <CardDescription>
                Flat by default, with a restrained border.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressBar label="Transfer" value={40} min={20} max={60} />
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setMessage("Card action activated")}
              >
                View details
              </Button>
            </CardFooter>
          </Card>
          <EmptyState
            headingLevel={3}
            heading="No items yet"
            description="Add an item when you are ready."
            action={
              <Button onClick={() => setMessage("Add action activated")}>
                Add an item
              </Button>
            }
          />
          <ErrorState
            headingLevel={3}
            heading="Could not load items"
            description="Try loading the list again."
            action={
              <Button
                variant="outline"
                onClick={() => setMessage("Retry activated")}
              >
                Try again
              </Button>
            }
          />
          <Card role="region" aria-label="Loading preview" aria-busy="true">
            <Skeleton shape="circle" />
            <Skeleton />
            <Skeleton shape="block" />
          </Card>
        </div>
      </section>
    </main>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Fixture root missing");
createRoot(root).render(<PrimitiveFixture />);
