import type { Task, TaskSortOrder, Project } from "../types";

type TaskControlsProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: Task["status"] | null;
  onStatusFilterChange: (value: Task["status"] | null) => void;
  priorityFilter: Task["priority"] | null;
  onPriorityFilterChange: (value: Task["priority"] | null) => void;
  selectedProjectId: number | null;
  onSelectedProjectIdChange: (value: number | null) => void;
  sortOrder: TaskSortOrder;
  onSortOrderChange: (value: TaskSortOrder) => void;
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string;
  fetchProjects: () => void;
}

function TaskControls({searchTerm, onSearchChange, statusFilter, onStatusFilterChange, priorityFilter, onPriorityFilterChange, selectedProjectId, onSelectedProjectIdChange, sortOrder, onSortOrderChange, projects, projectsLoading, projectsError, fetchProjects}: TaskControlsProps) {

  return (
    <div className="task-controls" role="search" aria-label="Filter tasks">
      <div className="task-control task-control--search">
        <label htmlFor="search">Search tasks</label>
        <input
          id="search"
          type="search"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="task-control">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={statusFilter ?? ""}
          onChange={(e) =>
            onStatusFilterChange(
              e.target.value === ""
                ? null
                : (e.target.value as Task["status"])
            )
          }
        >
          <option value="">All statuses</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="task-control">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priorityFilter ?? ""}
          onChange={(e) =>
            onPriorityFilterChange(
              e.target.value === ""
                ? null
                : (e.target.value as Task["priority"])
            )
          }
        >
          <option value="">All priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="task-control">
        <label htmlFor="project">Project</label>

        {projectsLoading ? (
          <p role="status">Loading projects...</p>
        ) : projectsError ? (
          <div>
            <p role="alert">{projectsError}</p>
            <button type="button" onClick={() => fetchProjects()}>
              Try again
            </button>
          </div>
        ) : (
          <select
            id="project"
            value={selectedProjectId ?? ""}
            onChange={(e) =>
              onSelectedProjectIdChange(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="task-control task-control--sort">
        <label htmlFor="sort">Sort by</label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) =>
            onSortOrderChange(e.target.value as TaskSortOrder)
          }
        >
          <option value="default">Default</option>
          <option value="due-asc">Due date: earliest first</option>
          <option value="due-desc">Due date: latest first</option>
        </select>
      </div>
    </div>
  );
}

export default TaskControls