import useTasks from "../hooks/useTasks";
import useProjects from "../hooks/useProjects";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { ListChecks, Clock, CircleCheck, Folder, ArrowRight } from "lucide-react";
import TaskList from "../components/TaskList";
import ProjectItem from "../components/ProjectItem";

function DashboardPage() {
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    fetchTasks
  } = useTasks();

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    fetchProjects
  } = useProjects();

  const totalTasks = tasks.length;

  const inProgressTasks = tasks.filter(
    task => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    task => task.status === "done"
  ).length;

  const activeProjects = projects.filter(
    project => project.status === "active"
  );

  const upcomingTasks = tasks
    .filter(task => task.status !== "done" && task.dueDate)
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
    .slice(0, 5);

  const stats = [
    {
      label: "Total tasks",
      value: totalTasks,
      icon: ListChecks,
      loading: tasksLoading,
      error: tasksError
    },
    {
      label: "In progress",
      value: inProgressTasks,
      icon: Clock,
      loading: tasksLoading,
      error: tasksError
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CircleCheck,
      loading: tasksLoading,
      error: tasksError
    },
    {
      label: "Active projects",
      value: activeProjects.length,
      icon: Folder,
      loading: projectsLoading,
      error: projectsError
    }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1>Dashboard</h1>
          <p>Here's an overview of your workspace.</p>
        </div>

        <Link
          to="/tasks/new"
          className="button button-primary"
        >
          Create task
        </Link>
      </header>

      <section className="dashboard-summary">
        <h2
          id="dashboard-summary"
          className="dashboard__section-title"
        >
          Overview
        </h2>
        <div className="dashboard__stats">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div className="dashboard-stat" key={stat.label}>
                <div className="dashboard-stat__header">
                  <span>{stat.label}</span>

                  <span className="dashboard-stat__icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                </div>

                <p className="dashboard-stat__value">
                  {stat.loading ? "..." : stat.error ? "-" : stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      
      
      <section className="dashboard__section">
        <div className="dashboard__section-header">
          <h2>Upcoming tasks</h2>

          <Link
            to="/tasks"
            className="dashboard__link"
          >
            View all tasks
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {tasksLoading ? (
          <p role="status">Loading tasks...</p>
        ) : tasksError ? (
          <div className="dashboard__error">
            <p role="alert">{tasksError}</p>
            <Button
              variant="secondary"
              onClick={() => fetchTasks()}
            >
              Try again
            </Button>
          </div>
        ) : (upcomingTasks.length === 0) ? (
          <div className="dashboard__empty">
            <p>No upcoming tasks.</p>
          </div>
        ) : (
          <div className="dashboard__task-list">
            <TaskList tasks={upcomingTasks} projects={projects}/>
          </div>
        )}
      </section>

      <section className="dashboard__section">
        <div className="dashboard__section-header">
          <h2>Active projects</h2>

          <Link
            to="/projects"
            className="dashboard__link"
          >
            View all projects
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {projectsLoading ? (
          <p role="status">Loading projects...</p>
        ) : projectsError ? (
          <div className="dashboard__error">
            <p role="alert">{projectsError}</p>
            <Button
              variant="secondary"
              onClick={() => fetchProjects()}
            >
              Try again
            </Button>
          </div>
        ) : activeProjects.length === 0 ? (
          <div className="dashboard__empty">
            <p>No active projects.</p>
          </div>
        ) : (
          <div className="dashboard__projects">
            {activeProjects.slice(0, 4).map(activeProject => (
              <ProjectItem key={activeProject.id} project={activeProject}/>
            ))}
          </div>
        )}
      </section>
    </div>
    
  );
}

export default DashboardPage