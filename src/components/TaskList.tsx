import type { Task } from "../types"
import TaskItem from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
}

function TaskList({tasks}: TaskListProps) {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task}/>
      ))}
    </ul>
  );
}

export default TaskList