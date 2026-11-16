import { Link, useParams } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import useTasks from "../hooks/useTasks";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import TaskList from "../components/TaskList";
import { ArrowLeft, Folder, CalendarDays } from "lucide-react";

function ProjectDetailPage() {
  const { id } = useParams();

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    fetchProjects
  } = useProjects();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    fetchTasks
  } = useTasks();

  const project = projects.find(
    project => String(project.id) === id
  );

  const projectTasks = tasks.filter(
    task => String(task.projectId) === id
  );

  if (projectsLoading) {
    return <p role="status">Loading project...</p>;
  }

  if (projectsError) {
    return (
      <div className="projects-page__error">
        <p role="alert">{projectsError}</p>

        <Button
          variant="secondary"
          onClick={() => fetchProjects()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="projects-page__empty">
        <h1>Project not found</h1>
        <Link to="/projects">Back to projects</Link>
      </div>
    );
  }

  const formattedDate = project.deadline
  ? new Date(`${project.deadline}T00:00:00`).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  : "No due date";

  return (
    <div className="project-detail">
      <Link
        to="/projects"
        className="project-detail__back"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </Link>

      <header className="project-detail__header">
        <div className="project-detail__heading">
          <div className="project-detail__eyebrow">
            <span className="project-detail__icon">
              <Folder size={22} aria-hidden="true" />
            </span>

            <span>Project overview</span>
          </div>

          <h1>{project.name}</h1>
        </div>

        <Badge
          variant={
            project.status === "active"
              ? "success"
              : "neutral"
          }
        >
          {project.status === "active"
            ? "Active"
            : "Completed"}
        </Badge>
      </header>

      <section className="project-detail__panel">
        <h2>Project details</h2>

        <div className="project-detail__description">
          <h3>Description</h3>
          <p>{project.description}</p>
        </div>

        <dl className="project-detail__metadata">
          <div>
            <dt>Due date</dt>

            <dd>
              <CalendarDays
                size={18}
                aria-hidden="true"
              />

              {formattedDate}
            </dd>
          </div>
        </dl>
      </section>

      <section className="project-detail__tasks">
        <div className="project-detail__tasks-header">
          <h2>Project tasks</h2>

          {!tasksLoading && !tasksError && (
            <span>
              {projectTasks.length}{" "}
              {projectTasks.length === 1
                ? "task"
                : "tasks"}
            </span>
          )}
        </div>

        {tasksLoading ? (
          <p role="status">Loading tasks...</p>
        ) : tasksError ? (
          <div className="projects-page__error">
            <p role="alert">{tasksError}</p>

            <Button
              variant="secondary"
              onClick={() => fetchTasks()}
            >
              Try again
            </Button>
          </div>
        ) : projectTasks.length === 0 ? (
          <div className="projects-page__empty">
            <p>No tasks assigned to this project.</p>
          </div>
        ) : (
          <div className="project-detail__task-list">
            <TaskList
              tasks={projectTasks}
              projects={projects}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectDetailPage