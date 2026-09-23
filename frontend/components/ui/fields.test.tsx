import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select } from "./select";
import { Checkbox } from "./checkbox";
import { RadioGroup } from "./radio-group";

describe("field relationships", () => {
  // Catches missing labels, dangling help/error IDs, and caller descriptions being lost.
  it("connects a label, help, error, and caller description to the real input", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <p id="external">External hint</p>
        <Input
          ref={ref}
          id="email"
          label="Email"
          description="Use a reachable address"
          error="Enter an email"
          aria-describedby="external"
          required
        />
      </>,
    );
    const input = screen.getByRole("textbox", { name: /Email/ });
    await user.click(screen.getByText("Email"));
    expect(input).toHaveFocus();
    expect(ref.current).toBe(input);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "External hint Use a reachable address Error: Enter an email",
    );
  });

  // Catches IDs regenerated on render or collisions between reusable field instances.
  it("keeps generated IDs unique/stable and removes stale error relationships", () => {
    const { rerender } = render(
      <>
        <Input label="First" error="Fix first" />
        <Input label="Second" />
      </>,
    );
    const first = screen.getByRole("textbox", { name: "First" });
    const id = first.id;
    expect(id).not.toBe(screen.getByRole("textbox", { name: "Second" }).id);
    expect(first).toHaveAccessibleDescription("Error: Fix first");
    rerender(
      <>
        <Input label="First" />
        <Input label="Second" />
      </>,
    );
    expect(first.id).toBe(id);
    expect(first).not.toHaveAttribute("aria-invalid");
    expect(first).not.toHaveAttribute("aria-describedby");
  });

  it("gives Textarea the same accessible field contract and native disabled behavior", async () => {
    render(
      <Textarea
        label="Notes"
        description="Plain text"
        error="Add context"
        required
        disabled
      />,
    );
    const textarea = screen.getByRole("textbox", { name: /Notes/ });
    expect(textarea).toBeDisabled();
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAccessibleDescription(
      "Plain text Error: Add context",
    );
  });

  it("starts Select at its placeholder and preserves native selection", async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Color"
        placeholder="Choose a color"
        description="One choice"
        required
      >
        <option value="red">Red</option>
        <option value="blue">Blue</option>
      </Select>,
    );
    const select = screen.getByRole("combobox", { name: /Color/ });
    expect(select).toHaveValue("");
    expect(select).toBeRequired();
    expect(select).toHaveAccessibleDescription("One choice");
    await user.selectOptions(select, "blue");
    expect(select).toHaveValue("blue");
  });
});

it("supports caller-controlled checkbox, select, and radio values", async () => {
  function ControlledFields() {
    const [checked, setChecked] = useState(false);
    const [value, setValue] = useState("a");
    return (
      <>
        <Checkbox
          label="Enabled"
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <Select
          label="Choice"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        >
          <option value="a">A</option>
          <option value="b">B</option>
        </Select>
        <RadioGroup
          label="Same choice"
          name="controlled"
          value={value}
          onValueChange={setValue}
          options={[
            { value: "a", label: "A" },
            { value: "b", label: "B" },
          ]}
        />
      </>
    );
  }
  const user = userEvent.setup();
  render(<ControlledFields />);
  await user.click(screen.getByRole("checkbox", { name: "Enabled" }));
  expect(screen.getByRole("checkbox")).toBeChecked();
  await user.selectOptions(screen.getByRole("combobox"), "b");
  expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
  await user.click(screen.getByRole("radio", { name: "A" }));
  expect(screen.getByRole("combobox")).toHaveValue("a");
});

describe("native choice controls", () => {
  it("toggles Checkbox by label and Space, but not when disabled", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Checkbox
        label="Send updates"
        description="Optional"
        error="Confirm choice"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Send updates" });
    expect(checkbox).toHaveAccessibleDescription(
      "Optional Error: Confirm choice",
    );
    await user.click(screen.getByText("Send updates"));
    expect(checkbox).toBeChecked();
    await user.keyboard(" ");
    expect(checkbox).not.toBeChecked();
    rerender(<Checkbox label="Send updates" disabled />);
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  // Catches a faux radio UI lacking a shared name/legend or disabling only the style.
  it("groups radios with a legend, tracks selection, and disables unavailable options", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup
        label="Delivery"
        name="delivery"
        description="Choose one"
        error="Required"
        defaultValue="daily"
        options={[
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "never", label: "Never", disabled: true },
        ]}
      />,
    );
    expect(
      screen.getByRole("group", { name: "Delivery" }),
    ).toHaveAccessibleDescription("Choose one Error: Required");
    expect(screen.getByRole("radio", { name: "Daily" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Weekly" }));
    expect(screen.getByRole("radio", { name: "Weekly" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Daily" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Never" })).toBeDisabled();
  });
});
