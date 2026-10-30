import { useParams, Link, useNavigate } from "react-router-dom";
import useTask from "../hooks/useTask";
import { useRef, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

function TaskDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const {task, loading, error, notFound, fetchTask} = useTask(params.id);

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
        <button onClick={fetchTask}>Try again</button>
      </>
    )
  } else if(task === null) {
    return <p>No task found.</p>;
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
    <>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due date: {task.dueDate ?? "No due date"}</p>
      <button ref={deleteRef} onClick={handleOpenDeleteDialog}>Delete</button>
      <Link to={`/tasks/${task.id}/edit`}>Edit task</Link>
      <Link to="/tasks">Back to tasks</Link>
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
    </>
  );
}

export default TaskDetailPage