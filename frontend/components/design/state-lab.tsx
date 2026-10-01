"use client";
import { useRef, useState } from "react";
import {
  Button,
  Card,
  CardTitle,
  Checkbox,
  EmptyState,
  ErrorState,
  RadioGroup,
  Skeleton,
} from "../ui";
import styles from "./design.module.css";

export function StateLab() {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [activations, setActivations] = useState(0);
  const [feedback, setFeedback] = useState("ready");
  const [interaction, setInteraction] = useState("Default");
  const stateChoices = useRef<HTMLFieldSetElement>(null);
  function restoreReady() {
    setFeedback("ready");
    stateChoices.current
      ?.querySelector<HTMLInputElement>('input[value="ready"]')
      ?.focus();
  }
  return (
    <section
      id="states"
      aria-labelledby="states-heading"
      className={styles.section}
    >
      <header className={styles.sectionHeader}>
        <h2 id="states-heading" tabIndex={-1}>
          Component states
        </h2>
        <p>
          Real interactions, not static approximations. Hover, tab to, or press
          the target. Touch users can tap it.
        </p>
      </header>
      <div className={styles.twoColumns}>
        <Card>
          <CardTitle as="h3">Hover, focus-visible &amp; active</CardTitle>
          <p>
            Tab to the target for keyboard focus. Hold Space or the pointer to
            inspect the active treatment.
          </p>
          <div>
            <Button
              onPointerEnter={() => setInteraction("Hover")}
              onPointerLeave={() => setInteraction("Default")}
              onPointerDown={() => setInteraction("Active")}
              onPointerUp={() => setInteraction("Hover")}
              onPointerCancel={() => setInteraction("Default")}
              onFocus={() =>
                setInteraction(
                  "Focused; keyboard navigation reveals focus-visible",
                )
              }
              onBlur={() => setInteraction("Default")}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter")
                  setInteraction("Active");
              }}
              onKeyUp={() =>
                setInteraction(
                  "Focused; keyboard navigation reveals focus-visible",
                )
              }
              onClick={() => setActivations((value) => value + 1)}
            >
              Interaction target
            </Button>
          </div>
          <p className={styles.feedback} aria-live="polite">
            {interaction}
          </p>
        </Card>
        <Card>
          <CardTitle as="h3">Disabled, loading &amp; selected</CardTitle>
          <Checkbox
            label="Show loading"
            checked={loading}
            onChange={(event) => setLoading(event.target.checked)}
          />
          <Checkbox
            label="Show disabled"
            checked={disabled}
            onChange={(event) => setDisabled(event.target.checked)}
          />
          <div>
            <Button
              loading={loading}
              disabled={disabled}
              loadingLabel="Loading state example"
              onClick={() => setActivations((value) => value + 1)}
            >
              State action
            </Button>
          </div>
          <p className={styles.note}>
            Loading and disabled both prevent activation. Use the checkboxes to
            restore the control.
          </p>
        </Card>
      </div>
      <p role="status" className={styles.feedback}>
        Activations: {activations}
      </p>
      <h3>Loading, error, empty &amp; recovery</h3>
      <p>
        These are explicit local states. There is no request, timer, or
        persistent change.
      </p>
      <div className={styles.twoColumns}>
        <RadioGroup
          ref={stateChoices}
          label="Content state"
          name="design-content-state"
          value={feedback}
          onValueChange={setFeedback}
          options={[
            { value: "ready", label: "Ready" },
            { value: "loading", label: "Loading" },
            { value: "empty", label: "Empty" },
            { value: "error", label: "Error" },
          ]}
        />
        <div className={styles.feedbackStage}>
          {feedback === "loading" ? (
            <Card
              role="region"
              aria-label="Loading content example"
              aria-busy="true"
            >
              <p>Loading example · switch state to continue</p>
              <Skeleton shape="circle" />
              <Skeleton />
              <Skeleton shape="block" />
            </Card>
          ) : feedback === "empty" ? (
            <EmptyState
              headingLevel={4}
              heading="No examples selected"
              description="Restore an example to inspect its ready state."
              action={<Button onClick={restoreReady}>Restore example</Button>}
            />
          ) : feedback === "error" ? (
            <ErrorState
              headingLevel={4}
              heading="Example could not be displayed"
              description="A deliberate error specimen. Reset it locally; no server retry is made."
              action={
                <Button variant="outline" onClick={restoreReady}>
                  Reset error example
                </Button>
              }
            />
          ) : (
            <Card>
              <CardTitle as="h4">Example content ready</CardTitle>
              <p>
                Choose a state to compare the production feedback components.
              </p>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
