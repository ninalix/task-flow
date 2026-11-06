import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi, afterEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import TaskDetailPage from "./TaskDetailPage";
import useTask from "../hooks/useTask";
import type { Task } from "../types";

const mockTask: Task = {
  id: 101,
  title: "Fix accessibility issue",
  description: "Improve keyboard navigation",
  status: "todo",
  priority: "high",
  projectId: 1
};

// Mock setup
vi.mock("../hooks/useTask", () => ({
  default: vi.fn()
}));

// Cleanup
afterEach(() => {
  vi.unstubAllGlobals();
});

vi.mocked(useTask).mockReturnValue({
  task: mockTask,
  loading: false,
  error: "",
  notFound: false,
  fetchTask: vi.fn()
});

function renderTaskDetailPage() {
  return render(
    <MemoryRouter initialEntries={["/tasks/101"]}>
      <Routes>
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/tasks" element={<h1>Task List</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

test("opens confirmation dialog when Delete is clicked", async () => {
  const user = userEvent.setup();

  // Arrange
  renderTaskDetailPage();

  // Act
  const deleteButton = screen.getByRole("button", {
    name: "Delete"
  });

  await user.click(deleteButton);

  // Assert
  const dialog = screen.getByRole("dialog", {
    name: "Delete task?"
  });

  expect(dialog).toHaveAccessibleDescription('Are you sure you want to delete "Fix accessibility issue"?');
});

test("closes dialog and restores focus when Cancel is clicked", async () => {
  const user = userEvent.setup();

  const mockFetch = vi.fn();
  vi.stubGlobal("fetch", mockFetch);

  renderTaskDetailPage();

  const deleteButton = screen.getByRole("button", {
    name: "Delete"
  });

  await user.click(deleteButton);

  const cancelButton = screen.getByRole("button", {
    name: "Cancel"
  });

  await user.click(cancelButton);

  const dialog = screen.queryByRole("dialog", {
    name: "Delete task?"
  });

  expect(dialog).not.toBeInTheDocument();
  expect(deleteButton).toHaveFocus();
  expect(mockFetch).not.toHaveBeenCalled();
});

test("deletes task and navigates to task list on success", async () => {
  const user = userEvent.setup();

  // Arrange
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200
  });
  vi.stubGlobal("fetch", mockFetch);

  renderTaskDetailPage();

  const pageDeleteButton = screen.getByRole("button", {
    name: "Delete"
  });

  // Act
  await user.click(pageDeleteButton);

  const dialogDeleteButton = screen.getByRole("button", {
    name: "Delete task"
  });

  // Act
  await user.click(dialogDeleteButton);

  // Assert
  expect(mockFetch).toHaveBeenCalledWith(
    "http://localhost:3000/tasks/101",
    { method: "DELETE" }
  );

  expect(
    await screen.findByRole("heading", { name: "Task List" })
  ).toBeInTheDocument();
});

test("displays error and stays on task detail when deletion fails", async () => {
  const user = userEvent.setup();

  const mockFetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 500
  });
  vi.stubGlobal("fetch", mockFetch);

  renderTaskDetailPage();

  const pageDeleteButton = screen.getByRole("button", {
    name: "Delete"
  });

  // Act
  await user.click(pageDeleteButton);

  const dialog = screen.queryByRole("dialog", {
    name: "Delete task?"
  });

  const dialogDeleteButton = screen.getByRole("button", {
    name: "Delete task"
  });

  // Act
  await user.click(dialogDeleteButton);

  const alert = await screen.findByRole("alert");

  expect(alert).toHaveTextContent("Failed to delete task.");

  expect(dialog).toBeInTheDocument();

  expect(
    screen.getByRole("heading", {
      name: "Fix accessibility issue"
    })
  ).toBeInTheDocument();
});