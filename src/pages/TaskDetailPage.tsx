import { useParams, Link } from "react-router-dom";
import useTask from "../hooks/useTask";

function TaskDetailPage() {
  const params = useParams();
  const {task, loading, error, notFound, fetchTask} = useTask(params.id);

  if(loading) {
    return <p>Loading...</p>;
  } else if(notFound) {
    return (
      <>
        <p role="alert">Task not found.</p>
        <Link to="/tasks">Back to tasks</Link>
      </>
    )
  } else if(error) {
    return (
      <>
        <p role="alert">{error}</p>
        <button onClick={fetchTask}>Try again</button>
      </>
    )
  } else if(task === null) {
    return <p>No task found.</p>;
  } 

  return (
    <>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due date: {task.dueDate ?? "No due date"}</p>
      <Link to={`/task/${task.id}/edit`}>Edit task</Link>
      <Link to="/tasks">Back to tasks</Link>
    </>
  );
}

export default TaskDetailPage