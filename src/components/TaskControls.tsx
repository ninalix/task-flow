import type { Task, TaskSortOrder } from "../types";
import useProjects from "../hooks/useProjects";

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
}

function TaskControls({searchTerm, onSearchChange, statusFilter, onStatusFilterChange, priorityFilter, onPriorityFilterChange, selectedProjectId, onSelectedProjectIdChange, sortOrder, onSortOrderChange}: TaskControlsProps) {
  const {projects, loading: projectsLoading, error: projectsError, fetchProjects} = useProjects();

  let projectState;
  const projectDisabled = projectsLoading || Boolean(projectsError);

  if(projectsLoading) {
    projectState = <p>Loading projects...</p>;
  } else if(projectsError) {
    projectState = 
      <>
        <p role="alert">{projectsError}</p>
        <button onClick={fetchProjects}>Try again</button>
      </>
  }

  return (
    <>
      <label htmlFor="search">Search tasks</label>
      <input id="search" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)}/>
      <label htmlFor="status">Status</label>
      <select id="status" value={statusFilter ?? ""} onChange={(e) => onStatusFilterChange(
        e.target.value === "" ? null : (e.target.value as Task["status"]))}>
        <option value="">All statuses</option>
        <option value="backlog">Backlog</option>
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <label htmlFor="priority">Priority</label>
      <select id="priority" value={priorityFilter ?? ""} onChange={(e) => onPriorityFilterChange(
        e.target.value === "" ? null : (e.target.value as Task["priority"])
      )}>
        <option value="">All priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      
      {projectState ? projectState : (
        <>
          <label htmlFor="project">Project</label>
          <select id="project" disabled={projectDisabled} value={selectedProjectId ?? ""} onChange={(e) => onSelectedProjectIdChange(e.target.value === "" ? null : Number(e.target.value))}>
            <option value="">All projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </>
      )}
      
      <label htmlFor="sort">Sort by</label>
      <select id="sort" value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value as TaskSortOrder)}>
        <option value="default">Default</option>
        <option value="due-asc">Due date: earliest first</option>
        <option value="due-desc">Due date: latest first</option>
      </select>
    </>
  );
}

export default TaskControls