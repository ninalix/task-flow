import { useParams, Link } from "react-router-dom";
import useTask from "../hooks/useTask";
import useProjects from "../hooks/useProjects";
import EditTaskForm from "../components/EditTaskForm";
import TaskFormLayout from "../components/TaskFormLayout";

function EditTaskPage() {
  const params = useParams();

  const {task, loading, error, notFound, fetchTask} = useTask(params.id);

  const {projects, loading: projectsLoading, error: projectsError, fetchProjects} = useProjects();

  if(loading) {
    return <p>Loading...</p>;
  }

  if(notFound) {
    return (
      <>
        <p>Task not found.</p>
        <Link to="/tasks">Back to tasks</Link>
      </>
    );
  }

  if(error) {
    return (
      <>
        <p role="alert">{error}</p>
        <button onClick={() => fetchTask()}>Try again</button>
      </>
    );
  }

  if(!task) {
    return <p>Task not available.</p>;
  }

  return (
    <>
      <TaskFormLayout
        title="Edit task"
        description="Update your task information."
        backTo={`/tasks/${task.id}`}
        backLabel="Back to task"
      >
        <EditTaskForm 
          key={task.id}
          task={task}
          projects={projects}
          projectsLoading={projectsLoading}
          projectsError={projectsError}
          fetchProjects={fetchProjects}
        />
      </TaskFormLayout>
    </>
  );
}

export default EditTaskPage