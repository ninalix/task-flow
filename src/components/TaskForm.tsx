import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import type { Task, Project } from "../types";
import type { TaskFormErrors } from "../utils/validateTaskForm";

type TaskFormProps = {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  status: Task["status"] | "";
  onStatusChange: (value: Task["status"] | "") => void;
  priority: Task["priority"] | "";
  onPriorityChange: (value: Task["priority"] | "") => void;
  projectId: number | null;
  onProjectChange: (value: number | null) => void;
  dueDate: string;
  onDueDateChange: (value: string) => void;
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string;
  fetchProjects: () => void;
  errors: TaskFormErrors;
  saving: boolean;
  saveError: string;
  submitLabel: string;
  savingLabel: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitAttempt: number;
};

function TaskForm({title, onTitleChange, description, onDescriptionChange, status, onStatusChange, priority, onPriorityChange, projectId, onProjectChange, dueDate, onDueDateChange, projects, projectsLoading, projectsError, fetchProjects, errors, saving, saveError, submitLabel, savingLabel, onSubmit, submitAttempt}: TaskFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const projectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (submitAttempt === 0) {
      return;
    }

    if(errors.title) {
        titleRef.current?.focus();
      } else if(errors.description) {
        descriptionRef.current?.focus();
      } else if(errors.status) {
        statusRef.current?.focus();
      } else if(errors.priority) {
        priorityRef.current?.focus();
      } else if(errors.project){
        projectRef.current?.focus();
      }
  }, [submitAttempt]);

  return (
    <form onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" required 
          ref={titleRef}
          value={title} 
          onChange={(e) => {
            onTitleChange(e.target.value);
            }}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && <p id="title-error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" required 
          ref={descriptionRef}
          value={description} 
          onChange={(e) => {
            onDescriptionChange(e.target.value);
            }}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && <p id="description-error">{errors.description}</p>}
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select id="status" required 
            ref={statusRef}
            value={status} 
            onChange={(e) => {
              onStatusChange(e.target.value === "" ? "" : e.target.value as Task["status"]);
              }}
            aria-invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? "status-error": undefined}
          >
          <option value="">Select a status...</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        {errors.status && <p id="status-error">{errors.status}</p>}
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select id="priority" required 
            ref={priorityRef}
            value={priority} 
            onChange={(e) => {
              onPriorityChange(e.target.value === "" ? "" : e.target.value as Task["priority"]);
            }}
            aria-invalid={Boolean(errors.priority)}
            aria-describedby={errors.priority ? "priority-error": undefined}
          >
          <option value="">Select a priority...</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {errors.priority && <p id="priority-error">{errors.priority}</p>}
      </div>
      {projectsLoading ? (
        <p>Loading projects...</p>
      ) : projectsError ? (
        <>
          <p role="alert">{projectsError}</p>
          <button type="button" onClick={fetchProjects}>Try again</button>
        </>
      ) : (
        <div>
          <label htmlFor="project">Project</label>
          <select id="project" required 
              ref={projectRef}
              value={projectId ?? ""} 
              onChange={(e) => {
                onProjectChange(e.target.value === "" ? null : Number(e.target.value));
                }}
              aria-invalid={Boolean(errors.project)}
              aria-describedby={errors.project ? "project-error": undefined}
            >
            <option value="">Select a project...</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          {errors.project && <p id="project-error">{errors.project}</p>}
        </div>
      )}
      
      <div>
        <label htmlFor="due-date">Due date</label>
        <input id="due-date" type="date" value={dueDate} onChange={(e) => onDueDateChange(e.target.value)}/>
      </div>
      <div>
        <button type="submit" disabled={saving}>{saving ? savingLabel : submitLabel}</button>
        {saveError && <p role="alert">{saveError}</p>}
        <Link to="/tasks">Cancel</Link>
      </div>
    </form>
  );
}

export default TaskForm