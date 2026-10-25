import type { Task } from "../types";
import { Link } from "react-router-dom"

type TaskItemProps = {
  task: Task;
}

function TaskItem({task}: TaskItemProps) {
  return (
    <li>
      <Link to={`/tasks/${task.id}`}>
        <h2>{task.title}</h2>
        <p>{task.status}</p>
        <p>{task.priority}</p>
        <p>{task.dueDate ?? "No due date"}</p>
      </Link>
    </li>
  );
}

export default TaskItem