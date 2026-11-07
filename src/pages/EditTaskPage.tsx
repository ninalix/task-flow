import { useParams, Link } from "react-router-dom";
import useTask from "../hooks/useTask";
import useProjects from "../hooks/useProjects";
import EditTaskForm from "../components/EditTaskForm";

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
      <h1>Edit task</h1>
      <EditTaskForm 
        key={task?.id}
        task={task}
        projects={projects}
        projectsLoading={projectsLoading}
        projectsError={projectsError}
        fetchProjects={fetchProjects}
      />
    </>
  );
}

export default EditTaskPage