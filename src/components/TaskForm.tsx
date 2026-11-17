import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import type { Task, Project } from "../types";
import type { TaskFormErrors } from "../utils/validateTaskForm";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";

export type TaskFormProps = {
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

      // Focus should only move after a failed submit,
      // not whenever an individual validation error changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitAttempt]);

  return (
    <form className="task-form" onSubmit={onSubmit} noValidate>
      <p className="task-form__hint">
        Fields marked with * are required.
      </p>
      <Input 
        id="title"
        label="Title"
        required
        ref={titleRef}
        value={title} 
        onChange={(e) => onTitleChange(e.target.value)}
        error={errors.title}
      />
      <Textarea 
        id="description"
        label="Description"
        required
        ref={descriptionRef}
        value={description} 
        onChange={(e) => onDescriptionChange(e.target.value)}
        error={errors.description}
        rows={5}
      />

      <div className="task-form__grid">
        <Select 
          id="status"
          label="Status"
          required
          ref={statusRef}
          value={status} 
          onChange={(e) => {
            onStatusChange(e.target.value === "" ? "" : e.target.value as Task["status"]);
            }}
          error={errors.status}
        >
          <option value="">Select a status...</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </Select>
        <Select
          id="priority"
          label="Priority"
          required
          ref={priorityRef}
          value={priority} 
          onChange={(e) => {
            onPriorityChange(e.target.value === "" ? "" : e.target.value as Task["priority"]);
          }}
          error={errors.priority}
        >
          <option value="">Select a priority...</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
        
        <div className="task-form__project">
          {projectsLoading ? (
            <p role="status">Loading projects...</p>
          ) : projectsError ? (
            <div className="task-form__project-error">
              <p role="alert">{projectsError}</p>

              <Button
                type="button"
                variant="secondary"
                onClick={fetchProjects}
              >
                Try again
              </Button>
            </div>
          ) : (
            <Select
              id="project"
              label="Project"
              required
              ref={projectRef}
              value={projectId ?? ""}
              onChange={(e) => {
                onProjectChange(
                  e.target.value === ""
                    ? null
                    : Number(e.target.value)
                );
              }}
              error={errors.project}
            >
              <option value="">Select a project...</option>

              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          )}
        </div>
        
        <Input
          id="due-date"
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
        />
      </div>
      
      {saveError && (
        <p className="task-form__save-error" role="alert">
          {saveError}
        </p>
      )}

      <div className="task-form__actions">
        <Link
          to="/tasks"
          className="button button-secondary"
        >
          Cancel
        </Link>

        <Button
          variant="primary"
          type="submit"
          disabled={saving}
        >
          {saving ? savingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm