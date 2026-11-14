import type { Task, Project } from "../types";
import { Link } from "react-router-dom";
import Badge from "./ui/Badge";
import { statusVariants, priorityVariants } from "../utils/taskVariants";

type TaskItemProps = {
  task: Task;
  projects: Project[];
}

const statusVariants: Record<
  Task["status"], 
  NonNullable<BadgeProps["variant"]>
> = {
  backlog: "neutral",
  todo: "neutral",
  "in-progress": "warning",
  done: "success",
};

const priorityVariants: Record<
  Task["priority"], 
  NonNullable<BadgeProps["variant"]>
> = {
  critical: "danger",
  high: "warning",
  medium: "neutral",
  low: "neutral"
};

function TaskItem({ task, projects }: TaskItemProps) {
  const project = projects.find((project) => Number(project.id) === task.projectId);

  return (
    <tr className="task-item">
      <th scope="row">
        <Link to={`/tasks/${task.id}`} className="task-item__link">
          {task.title}
        </Link>
      </th>
      <td className="task-item__project">
        {project?.name ?? "Unknown project"}
      </td>
      <td className="task-item__status">
        <Badge variant={statusVariants[task.status]}>
          {task.status.replace("-", " ")}
        </Badge>
      </td>
      <td className="task-item__priority">
        <Badge variant={priorityVariants[task.priority]}>
          {task.priority}
        </Badge>
      </td>
      <td className="task-item__date">
        {task.dueDate ?? "No due date"}
      </td>
    </tr>
  );
}

export default TaskItem