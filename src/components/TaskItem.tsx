import type { Task, Project } from "../types";
import { Link } from "react-router-dom";
import "./TaskItem.scss";

type TaskItemProps = {
  task: Task;
  projects: Project[];
}

function TaskItem({ task, projects }: TaskItemProps) {
  const project = projects.find((project) => Number(project.id) === task.projectId);

  return (
    <li className="task-item">
      <Link to={`/tasks/${task.id}`} className="task-item__link">
        <div className="task-item__title">
          <h2>{task.title}</h2>
        </div>

        <span className="task-item__project">
          {project?.name ?? "Unknown project"}
        </span>

        <span className={`task-item__status task-item__status--${task.status}`}>
          {task.status.replace("-", " ")}
        </span>

        <span className={`task-item__priority task-item__priority--${task.priority}`}>
          {task.priority}
        </span>

        <span className="task-item__date">
          {task.dueDate ?? "No due date"}
        </span>
      </Link>
    </li>
  );
}

export default TaskItem