import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { IconButton } from "./icon-button";

describe("Button", () => {
  // Catches an accidental form submission from a reusable action button.
  it("defaults to a non-submitting button and activates from the keyboard", async () => {
    const user = userEvent.setup();
    const activate = vi.fn();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form noValidate onSubmit={submit}>
        <Button onClick={activate}>Save</Button>
      </form>,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(activate).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
  });

  // Catches a loading/disabled style that still allows activation.
  it.each([{ loading: true }, { disabled: true }])(
    "blocks activation for %o",
    async (state) => {
      const activate = vi.fn();
      render(
        <Button {...state} onClick={activate}>
          Save
        </Button>,
      );
      const button = screen.getByRole("button", { name: /Save/ });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(activate).not.toHaveBeenCalled();
      if ("loading" in state)
        expect(button).toHaveAttribute("aria-busy", "true");
    },
  );
});

it("IconButton requires a name and forwards native disabled/loading behavior", async () => {
  const user = userEvent.setup();
  const activate = vi.fn();
  const { rerender } = render(
    <IconButton label="Add item" onClick={activate}>
      <svg />
    </IconButton>,
  );
  await user.tab();
  await user.keyboard(" ");
  expect(activate).toHaveBeenCalledOnce();
  rerender(
    <IconButton label="Add item" onClick={activate} loading>
      <svg />
    </IconButton>,
  );
  const button = screen.getByRole("button", { name: "Add item" });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-busy", "true");
  fireEvent.click(button);
  expect(activate).toHaveBeenCalledOnce();
});

it("honors explicit submit and reset types", async () => {
  const user = userEvent.setup();
  const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const reset = vi.fn();
  render(
    <form noValidate onSubmit={submit} onReset={reset}>
      <Button type="submit">Send</Button>
      <Button type="reset">Reset</Button>
    </form>,
  );
  await user.click(screen.getByRole("button", { name: "Send" }));
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(reset).toHaveBeenCalledOnce();
});
