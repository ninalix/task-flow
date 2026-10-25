export type Project = {
  id: number;
  name: string;
  description: string;
  deadline?: string;
  status: "active" | "completed";
};

export type Task = {
  id: number;
  title: string;
  description: string;
  status: "backlog" | "todo" | "in-progress" | "done";
  priority: "critical" | "high" | "medium" | "low";
  dueDate?: string;
  projectId: number;
};

export type TaskSortOrder = "default" | "due-asc" | "due-desc";

export type CreateTaskInput = Omit<Task, "id">;