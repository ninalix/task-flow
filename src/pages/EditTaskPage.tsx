import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Task, CreateTaskInput } from "../types";
import useTask from "../hooks/useTask";
import useProjects from "../hooks/useProjects";
import TaskForm from "../components/TaskForm";
import validateTaskForm from "../utils/validateTaskForm";
import type { TaskFormErrors } from "../utils/validateTaskForm";

function EditTaskPage() {
  const params = useParams();

  const {task, loading, error, notFound, fetchTask} = useTask(params.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"] | "">("");
  const [priority, setPriority] = useState<Task["priority"] | "">("");
  const [projectId, setProjectId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState("");
  const {projects, loading: projectsLoading, error: projectsError, fetchProjects} = useProjects();

  const [errors, setErrors] = useState<TaskFormErrors>({
    title: "",
    description: "",
    status: "",
    priority: "",
    project: ""
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [submitAttempt, setSubmitAttempt] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if(task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setProjectId(task.projectId);
      setDueDate(task.dueDate ?? "");
    }
  }, [task]);

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
        <button onClick={fetchTask}>Try again</button>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validateTaskForm({
      title,
      description,
      status,
      priority,
      projectId
    });

    setErrors(validationErrors);

    const hasError = Object.values(validationErrors).some(error => error !== "");

    if(hasError) {
      setSubmitAttempt((count) => count + 1);
      return;
    }

    if(status === "" || priority === "" || projectId === null) {
      return;
    }

    const editTask: CreateTaskInput = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      projectId,
      dueDate: dueDate || undefined
    };

    setSaving(true);
    setSaveError("");

    try { 
      const response = await fetch(`http://localhost:3000/tasks/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editTask)
      });

      if(!response.ok) {
        throw new Error("Failed to update task.");
      }

      const updatedTask: Task = await response.json();
      navigate(`/tasks/${updatedTask.id}`);
    } catch(saveError) {
      if(saveError instanceof Error) {
        setSaveError(saveError.message);
      } else {
        setSaveError("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if(value.trim()) {
      setErrors(prev => ({
        ...prev,
        title: ""
      }));
    }
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);

    if(value.trim()) {
      setErrors(prev => ({
        ...prev,
        description: ""
      }));
    }
  }

  function handleStatusChange(value: Task["status"] | "") {
    setStatus(value);

    if(value) {
      setErrors(prev => ({
        ...prev,
        status: ""
      }));
    }
  }

  function handlePriorityChange(value: Task["priority"] | "") {
    setPriority(value);

    if(value) {
      setErrors(prev => ({
        ...prev,
        priority: ""
      }));
    }
  }

  function handleProjectChange(value: number | null) {
    setProjectId(value);

    if(value) {
      setErrors(prev => ({
        ...prev,
        project: ""
      }));
    }
  }

  return (
    <>
      <h1>Edit task</h1>
      <TaskForm
        title={title}
        onTitleChange={handleTitleChange}
        description={description}
        onDescriptionChange={handleDescriptionChange}
        status={status}
        onStatusChange={handleStatusChange}
        priority={priority}
        onPriorityChange={handlePriorityChange}
        projectId={projectId}
        onProjectChange={handleProjectChange}
        dueDate={dueDate}
        onDueDateChange={setDueDate}
        projects={projects}
        projectsLoading={projectsLoading}
        projectsError={projectsError}
        fetchProjects={fetchProjects}
        errors={errors}
        saving={saving}
        saveError={saveError}
        submitLabel="Save changes"
        savingLabel="Saving..."
        onSubmit={handleSubmit}
        submitAttempt={submitAttempt}
      />
    </>
  );
}

export default EditTaskPage