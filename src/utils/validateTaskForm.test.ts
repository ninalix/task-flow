import { test, expect } from "vitest";
import validateTaskForm from "./validateTaskForm";

const validValues = {
  title: "Fix accessibility issue",
  description: "Improve keyboard navigation",
  status: "todo",
  priority: "high",
  projectId: 1
} as const;

const invalidCases = [
  {
    field: "title",
    value: "   ",
    errorField: "title",
    message: "Title is required."
  },
  {
    field: "description",
    value: "   ",
    errorField: "description",
    message: "Description is required."
  },
  {
    field: "status",
    value: "",
    errorField: "status",
    message: "Status is required."
  },
  {
    field: "priority",
    value: "",
    errorField: "priority",
    message: "Priority is required."
  },
  {
    field: "projectId",
    value: null,
    errorField: "project",
    message: "Project is required."
  }
] as const;

test("returns errors when all required fields are empty", () => {
  // Arrange
  const emptyValues = {
    title: "",
    description: "",
    status: "",
    priority: "",
    projectId: null
  } as const;

  // Act
  const results = validateTaskForm(emptyValues);

  // Assert
  expect(results).toEqual({
    title: "Title is required.",
    description: "Description is required.",
    status: "Status is required.",
    priority: "Priority is required.",
    project: "Project is required.",
  });
});

test("returns no errors when all fields are valid", () => {
  const results = validateTaskForm(validValues);

  expect(results).toEqual({
    title: "",
    description: "",
    status: "",
    priority: "",
    project: "",
  });
});

test.each(invalidCases)("returns an error when $field is invalid", ({ field, value, errorField, message}) => {
  // Arrange
  const values = {
    ...validValues,
    [field]: value
  };

  // Act
  const result = validateTaskForm(values);

  // Assert
  expect(result).toMatchObject({
    [errorField]: message
  });
});

test("accepts project ID 0", () => {
  const values = {
    ...validValues,
    projectId: 0
  };

  const result = validateTaskForm(values);

  expect(result.project).toBe("");
});