import { useState } from "react";
import { useNavigate } from "react-router-dom"
import type { Task, CreateTaskInput } from "../types";
import useProjects from "../hooks/useProjects";
import TaskForm from "../components/TaskForm";
import validateTaskForm from "../utils/validateTaskForm";
import type { TaskFormErrors } from "../utils/validateTaskForm";

function CreateTaskPage() {
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

    const hasError = Object.values(errors).some(error => error !== "");

    if(hasError) {
      setSubmitAttempt((count) => count + 1);
      return;
    }

    if(status === "" || priority === "" || projectId === null) {
      return;
    }

    const newTask: CreateTaskInput = {
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
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      });

      if(!response.ok) {
        throw new Error("Failed to create task.");
      }

      const createdTask: Task = await response.json();
      navigate(`/tasks/${createdTask.id}`);
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
      <h1>Create task</h1>
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
        submitLabel="Create task"
        savingLabel="Creating..."
        onSubmit={handleSubmit}
        submitAttempt={submitAttempt}
      />
    </>
  );
}

export default CreateTaskPage