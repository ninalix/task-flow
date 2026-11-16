import { useParams, Link, useNavigate } from "react-router-dom";
import useTask from "../hooks/useTask";
import useProjects from "../hooks/useProjects";
import { useRef, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { statusVariants, priorityVariants } from "../utils/taskVariants";

function TaskDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const {task, loading, error, notFound, fetchTask} = useTask(params.id);
  const {projects, loading: projectsLoading, error: projectsError} = useProjects();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const deleteRef = useRef<HTMLButtonElement>(null);

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
        <button onClick={() => fetchTask()}>Try again</button>
      </>
    )
  } else if(task === null) {
    return <p>No task found.</p>;
  } 

  const project = projects.find((project) => Number(project.id) === task.projectId);

  let projectContent: string;

  if (projectsLoading) {
    projectContent = "Loading project...";
  } else if (projectsError) {
    projectContent = "Unable to load project.";
  } else {
    projectContent = project?.name ?? "Unknown project";
  }

  function handleOpenDeleteDialog() {
    setDeleteDialogOpen(true);
    setDeleteError("");
  }

  function handleCloseDeleteDialog() {
    setDeleteDialogOpen(false);

    deleteRef.current?.focus();
  }

  async function handleDelete() {
    if(!task) return;
    
    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "DELETE"
      });

      if(!response.ok) {
        throw new Error("Failed to delete task.");
      }

      navigate("/tasks");
    } catch(error) {
      if(error instanceof Error) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Something went wrong.");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="task-detail">
      <Link to="/tasks" className="task-detail__back">← Back to tasks</Link>
      <div className="task-detail__header">
        <div className="task-detail__heading">
          <h1>{task.title}</h1>

          <div className="task-detail__badges">
            <Badge variant={statusVariants[task.status]}>
              {task.status.replace("-", " ")}
            </Badge>
            <Badge variant={priorityVariants[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        </div>

        <Link
          to={`/tasks/${task.id}/edit`}
          className="button button-primary"
        >
          Edit task
        </Link>
      </div>

      <section className="task-detail__panel">
        <h2>Task details</h2>

        <div className="task-detail__description">
          <h3>Description</h3>
          <p>{task.description}</p>
        </div>

        <dl className="task-detail__metadata">
          <div className="task-detail__field">
            <dt>Project</dt>
            <dd>
              {projectContent}
            </dd>
          </div>
          <div className="task-detail__field">
            <dt>Due date</dt>
            <dd>{task.dueDate ?? "No due date"}</dd>
          </div>
        </dl>
      </section>

      <div className="task-detail__actions">
        <Button
          variant="danger"
          ref={deleteRef}
          onClick={handleOpenDeleteDialog}
        >
          Delete
        </Button>
      </div>
      
      <ConfirmDialog 
        isOpen={deleteDialogOpen}
        title="Delete task?"
        message={`Are you sure you want to delete "${task.title}"?`}
        confirmLabel="Delete task"
        loadingLabel="Deleting..."
        deleting={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={handleCloseDeleteDialog}
      />
    </div>
  );
}

export default TaskDetailPage