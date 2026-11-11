import type { Task, Project } from "../types"
import TaskItem from "./TaskItem";
import "./TaskList.scss";

type TaskListProps = {
  tasks: Task[];
  projects: Project[];
}

function TaskList({tasks, projects}: TaskListProps) {
  return (
    <div className="task-table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Project</th>
            <th scope="col">Status</th>
            <th scope="col">Priority</th>
            <th scope="col">Due date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} projects={projects} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList