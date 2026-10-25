import { useState } from "react";
import { Link } from "react-router-dom"
import type { Task, TaskSortOrder } from "../types";
import TaskList from "../components/TaskList";
import useTasks from "../hooks/useTasks";
import TaskControls from "../components/TaskControls";

function TasksPage() {
  const {tasks, loading: tasksLoading, error: tasksError, fetchTasks} = useTasks();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Task["status"] | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Task["priority"] | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [sortOrder, setSortOrder] = useState<TaskSortOrder>("default");

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
    content = <TaskList tasks={visibleTasks}/>
  }

  return (
    <>
      <h1>Tasks</h1>
      <TaskControls 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        selectedProjectId={selectedProjectId}
        onSelectedProjectIdChange={setSelectedProjectId}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />
      <Link to="/tasks/new">Create task</Link>
      {content}
    </>
  );
}

export default TasksPage