import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Task, CreateTaskInput, Project } from "../types";
import type { TaskFormErrors } from "../utils/validateTaskForm";
import TaskForm from "./TaskForm";
import validateTaskForm from "../utils/validateTaskForm";

type EditTaskFormProps = {
  task: Task;
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string;
  fetchProjects: () => Promise<void>;
};

function EditTaskForm({task, projects, projectsLoading, projectsError, fetchProjects}: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<Task["status"] | "">(task.status);
  const [priority, setPriority] = useState<Task["priority"] | "">(task.priority);
  const [projectId, setProjectId] = useState<number | null>(task.projectId);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");

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
      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
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

    if(value !== null) {
      setErrors(prev => ({
        ...prev,
        project: ""
      }));
    }
  }

  return (
    <div>
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
    </div>
  );
}

export default EditTaskForm