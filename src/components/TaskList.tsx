import type { Task, Project } from "../types"
import TaskItem from "./TaskItem";
import "./TaskList.scss";

type TaskListProps = {
  tasks: Task[];
  projects: Project[];
}

function TaskList({tasks, projects}: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} projects={projects} />
      ))}
    </ul>
  );
}

export default TaskList