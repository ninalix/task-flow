import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { test, expect } from "vitest";
import TaskItem from "./TaskItem";
import type { Task, Project } from "../types";

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

const mockProjects: Project[] = [
  {
    id: 1,
    name: "IP Australia",
    description: "Navigator project",
    status: "active",
  },
  {
    id: 2,
    name: "ART",
    description: "Tribunal project",
    status: "active",
  },
];

function renderTaskItem(task: Task) {
  return render(
    <MemoryRouter>
      <table>
        <tbody>
          <TaskItem task={task} projects={mockProjects}/>
        </tbody>
      </table>
    </MemoryRouter>
  );
}

test("displays the task title", () => {
  // Arrange
  
  // Act
  renderTaskItem(task);

  // Assert
  expect(
    screen.getByRole("rowheader", {
      name: "Fix accessibility issue",
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

test("displays the associated project name", () => {
  renderTaskItem(task);

  expect(
    screen.getByRole("cell", { name: "IP Australia" })
  ).toBeInTheDocument();
});