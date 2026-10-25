import type { Task } from "../types";

type TaskFormValues = {
  title: string;
  description: string;
  status: Task["status"] | "";
  priority: Task["priority"] | "";
  projectId: number | null;
};

export type TaskFormErrors = {
  title: string;
  description: string;
  status: string;
  priority: string;
  project: string;
};

function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {
    title: "",
    description: "",
    status: "",
    priority: "",
    project: ""
  };

  if(!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if(!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if(values.status === "") {
    errors.status = "Status is required.";
  }

  if(values.priority === "") {
    errors.priority = "Priority is required.";
  }

  if(values.projectId === null) {
    errors.project = "Project is required.";
  }

  return errors;
}

export default validateTaskForm