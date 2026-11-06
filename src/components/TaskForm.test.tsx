import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TaskForm from "./TaskForm";
import type { TaskFormProps } from "./TaskForm";

const defaultProps: TaskFormProps = {
  title: "",
  onTitleChange: vi.fn(),
  description: "",
  onDescriptionChange: vi.fn(),
  status: "",
  onStatusChange: vi.fn(),
  priority: "",
  onPriorityChange: vi.fn(),
  projectId: null,
  onProjectChange: vi.fn(),
  dueDate: "",
  onDueDateChange: vi.fn(),
  projects: [],
  projectsLoading: false,
  projectsError: "",
  fetchProjects: vi.fn(),
  errors: {
    title: "",
    description: "",
    status: "",
    priority: "",
    project: "",
  },
  saving: false,
  saveError: "",
  submitLabel: "Create task",
  savingLabel: "Creating...",
  onSubmit: vi.fn(),
  submitAttempt: 0,
}

const focusCases = [
  { field: "title", label: "Title", role: "textbox"},
  { field: "description", label: "Description", role: "textbox"},
  { field: "status", label: "Status", role: "combobox"},
  { field: "priority", label: "Priority", role: "combobox"},
  { field: "project", label: "Project", role: "combobox"},
] as const;

const mockProjects = [
  {
    id: 1,
    name: "IP Australia",
    description: "Navigator project",
    status: "active" as const
  }
];

function renderTaskForm(props: Partial<TaskFormProps> = {}) {
  return render(
    <MemoryRouter>
      <TaskForm {...defaultProps} {...props} />
    </MemoryRouter>
  );
}

test("calls onTitleChange when user types a title", async () => {
  // Arrange
  const user = userEvent.setup();
  const mockOnTitleChange = vi.fn();

  renderTaskForm({onTitleChange: mockOnTitleChange});

  // Act
  const titleInput = screen.getByRole("textbox", {
    name: "Title"
  });

  await user.type(titleInput, "A");

  // Assert
  expect(mockOnTitleChange).toHaveBeenCalledWith("A");
});

test("calls onStatusChange when user selects a status", async () => {
  const user = userEvent.setup();
  const mockOnStatusChange = vi.fn();

  renderTaskForm({onStatusChange: mockOnStatusChange});

  const statusSelect = screen.getByRole("combobox", {
    name: "Status"
  })

  await user.selectOptions(statusSelect, "in-progress");

  expect(mockOnStatusChange).toHaveBeenCalledWith("in-progress");

});

test("calls onSubmit when user submits the form", async () => {
  // Arrange
  const user = userEvent.setup();
  const mockOnSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  });

  renderTaskForm({onSubmit: mockOnSubmit});

  // Act
  const submitButton = screen.getByRole("button", {
    name: "Create task"
  });

  await user.click(submitButton);

  // Assert
  expect(mockOnSubmit).toHaveBeenCalledTimes(1);
});

test("displays title validation error", () => {
  // Arrange
  renderTaskForm({
    errors: {
      ...defaultProps.errors,
      title: "Title is required."
    }
  });

  // Act
  const titleInput = screen.getByRole("textbox", {
    name: "Title"
  });

  const titleError = screen.getByText("Title is required.");

  // Assert
  expect(titleError).toBeInTheDocument();
  expect(titleInput).toHaveAttribute("aria-invalid", "true");
  expect(titleInput).toHaveAccessibleDescription("Title is required.");
});

test("focuses title input after failed submission", () => {
  // Arrange
  renderTaskForm({
    errors: {
      ...defaultProps.errors,
      title: "Title is required."
    },
    submitAttempt: 1
  });

  // Act
  const titleInput = screen.getByRole("textbox", {
    name: "Title"
  });

  // Assert
  expect(titleInput).toHaveFocus();
});

test("focuses the first invalid field when multiple errors exist", () => {
  // Arrange
  renderTaskForm({
    errors: {
      ...defaultProps.errors,
      title: "Title is required.",
      description: "Description is required."
    },
    submitAttempt: 1
  });

  // Act
  const titleInput = screen.getByRole("textbox", {
    name: "Title"
  });

  const descriptionInput = screen.getByRole("textbox", {
    name: "Description"
  });

  // Assert
  expect(titleInput).toHaveFocus();
  expect(descriptionInput).not.toHaveFocus();
});

test.each(focusCases)("focuses $field when it has an error", ({ field, label, role }) => {
  renderTaskForm({
    errors: {
      ...defaultProps.errors,
      [field]: "This field is required."
    },
    submitAttempt: 1
  });

  const input = screen.getByRole(role, {
    name: label
  });

  expect(input).toHaveFocus();
});

test("focuses title input when validation errors are updated", () => {
  // Arrange
  const { rerender } = renderTaskForm();

  const titleInput = screen.getByRole("textbox", {
    name: "Title"
  });

  // Assert initial state
  expect(titleInput).not.toHaveFocus();

  // Act
  rerender(
    <MemoryRouter>
      <TaskForm 
        {...defaultProps}
        errors={{
          ...defaultProps.errors,
          title: "Title is required."
        }}
        submitAttempt={1}
      />
    </MemoryRouter>
  );

  // Assert
  expect(titleInput).toHaveFocus();
});

test("moves focus to the next invalid field after resubmission", () => {
  // Arrange
  const { rerender } = renderTaskForm();

  const titleInput = screen.getByRole("textbox", {
    name: "Title"
  });

  const descriptionInput = screen.getByRole("textbox", {
    name: "Description"
  });

  // Act 1
  rerender(
    <MemoryRouter>
      <TaskForm 
        {...defaultProps}
        errors={{
          ...defaultProps.errors,
          title: "Title is required."
        }}
        submitAttempt={1}
      />
    </MemoryRouter>
  );

  // Assert 1
  expect(titleInput).toHaveFocus();

  // Act 2
  rerender(
    <MemoryRouter>
      <TaskForm 
        {...defaultProps}
        errors={{
          ...defaultProps.errors,
          title: "",
          description: "Description is required."
        }}
        submitAttempt={2}
      />
    </MemoryRouter>
  );

  // Assert 2
  expect(descriptionInput).toHaveFocus();
});

test("disables submit button while saving", () => {
  // Arrange
  renderTaskForm({saving: true});

  // Act 
  const saveButton = screen.getByRole("button", {
    name: "Creating..."
  });

  // Assert
  expect(saveButton).toBeDisabled();
  expect(
    screen.queryByRole("button", {
      name: "Create task"
    })
  ).not.toBeInTheDocument();
});

test("prevents submission while saving", async () => {
  // Arrange
  const user = userEvent.setup();
  const mockOnSubmit = vi.fn();

  renderTaskForm({saving: true, onSubmit: mockOnSubmit});

  // Act
  const submitButton = screen.getByRole("button", {
    name: "Creating..."
  });

  await user.click(submitButton);

  // Assert
  expect(mockOnSubmit).not.toHaveBeenCalled();
});

test("displays loading message while fetching projects", () => {
  renderTaskForm({projectsLoading: true});

  expect(
    screen.getByText("Loading projects...")
  ).toBeInTheDocument();
});

test("displays project error and retries fetching", async () => {
  // Arrange
  const user = userEvent.setup();
  const mockFetchProjects = vi.fn();

  renderTaskForm({
    projectsError: "Failed to load projects.",
    fetchProjects: mockFetchProjects
  });

  // Act 1
  const errorMessage = screen.getByRole("alert");

  // Assert 1
  expect(errorMessage).toHaveTextContent("Failed to load projects.");

  // Act 2
  const tryButton = screen.getByRole("button", {
    name: "Try again"
  });

  await user.click(tryButton);

  // Assert 2
  expect(mockFetchProjects).toHaveBeenCalledTimes(1);
});

test("displays error when saving fails", () => {
  renderTaskForm({saveError: "Failed to save task."});

  const errorMessage = screen.getByRole("alert");

  expect(errorMessage).toHaveTextContent("Failed to save task.");
  expect(errorMessage).toBeInTheDocument();
});

test("cancel link points to tasks page", () => {
  renderTaskForm();

  const cancelLink = screen.getByRole("link", {
    name: "Cancel"
  });

  expect(cancelLink).toHaveAttribute("href", "/tasks");
});

test("renders projects and handles project and due date changes", async () => {
  const user = userEvent.setup();

  const onProjectChange = vi.fn();
  const onDueDateChange = vi.fn();

  renderTaskForm({
    projects: mockProjects,
    projectId: null,
    dueDate: "",
    onProjectChange,
    onDueDateChange
  });

  // Projects render
  const projectSelect = screen.getByRole("combobox", {
    name: "Project"
  });

  expect(
    screen.getByRole("option", {
      name: "IP Australia"
    })
  ).toBeInTheDocument();

  await user.selectOptions(projectSelect, "1");

  expect(onProjectChange).toHaveBeenCalledWith(1);

  // Due date
  const dueDate = screen.getByLabelText("Due date");

  await user.type(dueDate, "2026-12-31");

  expect(onDueDateChange).toHaveBeenCalledWith("2026-12-31");

  // None project
  await user.selectOptions(projectSelect, "");

  expect(onProjectChange).toHaveBeenCalledWith(null);
});