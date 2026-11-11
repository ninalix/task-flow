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
    <tr className="task-item">
      <th scope="row">
        <Link to={`/tasks/${task.id}`} className="task-item__link">
          {task.title}
        </Link>
      </th>
      <td className="task-item__project">
        {project?.name ?? "Unknown project"}
      </td>
      <td className={`task-item__status task-item__status--${task.status}`}>
        {task.status.replace("-", " ")}
      </td>
      <td className={`task-item__priority task-item__priority--${task.priority}`}>
        {task.priority}
      </td>
      <td className="task-item__date">
        {task.dueDate ?? "No due date"}
      </td>
    </tr>
  );
}

export default TaskItem