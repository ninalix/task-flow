import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { test, expect } from "vitest";
import TaskItem from "./TaskItem";
import type { Task } from "../types";

const task: Task = {
  id: 101,
  title: "Fix accessibility issue",
  description: "Improve keyboard navigation",
  status: "todo",
  priority: "high",
  projectId: 1
};

const taskWithDueDate: Task = {
  ...task,
  dueDate: "2026-12-31"
};

function renderTaskItem(task: Task) {
  return render(
    <MemoryRouter>
      <TaskItem task={task}/>
    </MemoryRouter>
  );
}

test("displays the task title", () => {
  // Arrange
  
  // Act
  renderTaskItem(task);

  // Assert
  expect(
    screen.getByRole("heading", {
      name: "Fix accessibility issue",
      level: 2,
    })
  ).toBeInTheDocument();
});

test("displays the task status", () => {
  // Arrange

  // Act
  renderTaskItem(task);

  // Assert
  expect(
    screen.getByText("todo")
  ).toBeInTheDocument();
});

test("displays the task priority", () => {
  // Arrange

  // Act
  renderTaskItem(task);

  // Assert
  expect(
    screen.getByText("high")
  ).toBeInTheDocument();
});

test("displays fallback when due date is missing", () => {
  // Arrange

  // Act
  renderTaskItem(task);

  // Assert
  expect(
    screen.getByText("No due date")
  ).toBeInTheDocument();
});

test("displays correct task detail URL", () => {
  renderTaskItem(task);

  // Assert
  expect(
    screen.getByRole("link")
  ).toHaveAttribute("href", "/tasks/101");
});

test("displays due date when provided", () => {
  renderTaskItem(taskWithDueDate);

  expect(
    screen.getByText("2026-12-31")
  ).toBeInTheDocument();
});