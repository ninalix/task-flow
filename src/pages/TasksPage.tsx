import { useState } from "react";
import { Link } from "react-router-dom"
import type { Task, TaskSortOrder } from "../types";
import TaskList from "../components/TaskList";
import useTasks from "../hooks/useTasks";
import useProjects from "../hooks/useProjects";
import TaskControls from "../components/TaskControls";

function TasksPage() {
  const {tasks, loading: tasksLoading, error: tasksError, fetchTasks} = useTasks();
  const {projects, loading: projectsLoading, error: projectsError, fetchProjects} = useProjects();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Task["status"] | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Task["priority"] | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [sortOrder, setSortOrder] = useState<TaskSortOrder>("default");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase().trim());

    const matchesStatus = statusFilter === null || task.status === statusFilter;

    const matchesPriority = priorityFilter === null || task.priority === priorityFilter;

    const matchesProject = selectedProjectId === null || task.projectId === selectedProjectId;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  let visibleTasks;

  if(sortOrder === "default") {
    visibleTasks = filteredTasks;
  } else {
    visibleTasks = filteredTasks.sort((a, b) => {
      if(!a.dueDate && !b.dueDate) {
        return 0;
      }

      if(!a.dueDate) {
        return 1;
      }

      if(!b.dueDate) {
        return -1;
      }

      if(sortOrder === "due-asc") {
        return a.dueDate.localeCompare(b.dueDate);
      }

      return b.dueDate.localeCompare(a.dueDate);
    });
  }

  const pageSize = 10;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;

  const totalPages = Math.max(1, Math.ceil(visibleTasks.length / pageSize));

  const paginatedTasks = visibleTasks.slice(startIndex, endIndex);

  let content;

  if(tasksLoading) {
    content = <p>Loading tasks...</p>;
  } else if(tasksError) {
    content = 
      <>
        <p role="alert">{tasksError}</p>
        <button onClick={fetchTasks}>Try again</button>
      </>;
  } else if(tasks.length === 0) {
    content = <p>No tasks found.</p>;
  } else if(visibleTasks.length === 0) {
    content = <p>No tasks match your search or filters.</p>;
  } else {
    content = <TaskList tasks={paginatedTasks} projects={projects} />
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div className="page-heading">
          <h1>Tasks</h1>
          <p>Manage and organise your tasks.</p>
        </div>

        <Link to="/tasks/new" className="button button-primary create-task-link">
          + Create task
        </Link>
      </div>
      <TaskControls 
        searchTerm={searchTerm} 
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
        }}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={(value) => {
          setPriorityFilter(value);
          setCurrentPage(1);
        }}
        selectedProjectId={selectedProjectId}
        onSelectedProjectIdChange={(value) => {
          setSelectedProjectId(value);
          setCurrentPage(1);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={(value) => {
          setSortOrder(value);
          setCurrentPage(1);
        }}
        projects={projects}
        projectsLoading={projectsLoading}
        projectsError={projectsError}
        fetchProjects={fetchProjects}
      />
      {content}
      {!tasksLoading && !tasksError && visibleTasks.length > pageSize && (
        <div className="pagination">
          <button type="button" onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button type="button" onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage >= totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TasksPage