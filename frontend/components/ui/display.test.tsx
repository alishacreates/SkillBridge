import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProgressBar } from "./progress-bar";
import { Avatar } from "./avatar";
import { EmptyState, ErrorState, Skeleton } from "./feedback";
import { Button } from "./button";

describe("ProgressBar", () => {
  // Catches losing a nonzero lower bound or exposing the wrong current value to AT.
  it("exposes an accessible name and real range, while displaying a percentage", () => {
    render(<ProgressBar label="Transfer" value={40} min={20} max={60} />);
    const progress = screen.getByRole("progressbar", { name: "Transfer" });
    expect(progress).toHaveAttribute("aria-valuemin", "20");
    expect(progress).toHaveAttribute("aria-valuemax", "60");
    expect(progress).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByText("50%", { selector: "span" })).toBeVisible();
  });
  it("clamps out-of-range values and can hide the visual label/value without losing its name", () => {
    const { rerender } = render(
      <ProgressBar
        label="Transfer"
        value={150}
        showLabel={false}
        showValue={false}
      />,
    );
    expect(
      screen.getByRole("progressbar", { name: "Transfer" }),
    ).toHaveAttribute("aria-valuenow", "100");
    rerender(<ProgressBar label="Transfer" value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });
  it("rejects invalid ranges rather than reporting misleading progress", () => {
    expect(() =>
      render(<ProgressBar label="Transfer" value={1} min={10} max={10} />),
    ).toThrow(RangeError);
    expect(() => render(<ProgressBar label="Transfer" value={NaN} />)).toThrow(
      RangeError,
    );
  });
});

describe("Avatar", () => {
  // Catches a broken image replacing usable initials, or a failed source poisoning a new source.
  it("shows initials on image failure and retries when the source changes", () => {
    const { container, rerender } = render(
      <Avatar alt="Alex Morgan" src="/one.png" />,
    );
    const image = container.querySelector("img");
    if (!image) throw new Error("Expected image");
    fireEvent.error(image);
    expect(screen.getByRole("img", { name: "Alex Morgan" })).toHaveTextContent(
      "AM",
    );
    expect(container.querySelector("img")).toBeNull();
    rerender(<Avatar alt="Alex Morgan" src="/two.png" />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/two.png");
  });
  it("hides decorative avatars from assistive technology", () => {
    render(<Avatar alt="" initials="AM" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("feedback", () => {
  it.each([EmptyState, ErrorState])(
    "renders a named state and a working recovery action",
    async (State) => {
      const user = userEvent.setup();
      const action = vi.fn();
      render(
        <State
          heading="Nothing to display"
          description="Try again later"
          action={<Button onClick={action}>Try again</Button>}
        />,
      );
      expect(
        screen.getByRole("heading", { name: "Nothing to display" }),
      ).toBeVisible();
      expect(screen.getByText("Try again later")).toBeVisible();
      await user.tab();
      await user.keyboard("{Enter}");
      expect(action).toHaveBeenCalledOnce();
    },
  );
  it("keeps visual skeletons out of the accessibility tree", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
