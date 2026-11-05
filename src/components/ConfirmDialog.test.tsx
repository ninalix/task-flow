import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";
import ConfirmDialog from "./ConfirmDialog";
import type { ConfirmDialogProps } from "./ConfirmDialog";

const defaultProps: ConfirmDialogProps = {
  isOpen: true,
  title: "Delete task",
  message: "Are you sure you want to delete this task?",
  confirmLabel: "Delete",
  loadingLabel: "Deleting...",
  deleting: false,
  error: "",
  onConfirm: vi.fn(),
  onClose: vi.fn()
};

function renderDialog(props: Partial<ConfirmDialogProps> = {}) {
  return render(
    <ConfirmDialog {...defaultProps} {...props} />
  );
}

test("does not render dialog when closed", () => {
  renderDialog({ isOpen: false });

  const dialog = screen.queryByRole("dialog");

  expect(dialog).not.toBeInTheDocument();
});

test("renders dialog with accessible name and description", () => {
  renderDialog();

  const dialog = screen.getByRole("dialog", {
    name: "Delete task"
  });

  expect(dialog).toBeInTheDocument();
  expect(dialog).toHaveAccessibleDescription("Are you sure you want to delete this task?");
  expect(dialog).toHaveAttribute("aria-modal", "true");
});

test("focuses cancel button when dialog opens", () => {
  renderDialog();

  const cancelButton = screen.getByRole("button", {
    name: "Cancel"
  });

  expect(cancelButton).toHaveFocus();
});

test("calls onClose when cancel button is clicked", async () => {
  const user = userEvent.setup();
  const mockOnClose = vi.fn();

  renderDialog({onClose: mockOnClose});

  const closeButton = screen.getByRole("button", {
    name: "Cancel"
  });

  await user.click(closeButton);
  
  expect(mockOnClose).toHaveBeenCalledTimes(1);
});

test("calls onConfirm when delete button is clicked", async () => {
  const user = userEvent.setup();
  const mockOnConfirm = vi.fn();

  renderDialog({onConfirm: mockOnConfirm});

  const confirmButton = screen.getByRole("button", {
    name: "Delete"
  });

  await user.click(confirmButton);

  expect(mockOnConfirm).toHaveBeenCalledTimes(1);
});

test("calls onClose when Escape is pressed", async () => {
  const user = userEvent.setup();
  const mockOnClose = vi.fn();

  renderDialog({onClose: mockOnClose});

  await user.keyboard("{Escape}");

  expect(mockOnClose).toHaveBeenCalledTimes(1);
});

test("wraps focus to last button when Shift+Tab is pressed", async () => {
  const user = userEvent.setup();

  renderDialog();

  const closeButton = screen.getByRole("button", {
    name: "Cancel"
  });

  const confirmButton = screen.getByRole("button", {
    name: "Delete"
  });

  expect(closeButton).toHaveFocus();

  await user.tab({ shift: true });

  expect(confirmButton).toHaveFocus();
});

test("wraps focus to first button when Tab is pressed", async () => {
  const user = userEvent.setup();
  
  renderDialog();

  const closeButton = screen.getByRole("button", {
    name: "Cancel"
  });

  const confirmButton = screen.getByRole("button", {
    name: "Delete"
  });

  confirmButton.focus();

  expect(confirmButton).toHaveFocus();

  await user.tab();

  expect(closeButton).toHaveFocus();
});

test("disables buttons and focuses dialog while deleting", () => {
  renderDialog({deleting: true});

  const closeButton = screen.getByRole("button", {
    name: "Cancel"
  });

  const confirmButton = screen.getByRole("button", {
    name: "Deleting..."
  });

  const dialog = screen.getByRole("dialog", {
    name: "Delete task"
  });

  expect(closeButton).toBeDisabled();
  expect(confirmButton).toBeDisabled();
  expect(dialog).toHaveFocus();
});

test("does not close dialog on Escape while deleting", async () => {
  const user = userEvent.setup();
  const mockOnClose = vi.fn();

  renderDialog({deleting: true, onClose: mockOnClose});

  await user.keyboard("{Escape}");

  expect(mockOnClose).not.toHaveBeenCalled();
});

test("displays deletion error with alert role", () => {
  renderDialog({ error: "Failed to delete task." });

  const error = screen.getByRole("alert");

  expect(error).toHaveTextContent("Failed to delete task.");
});