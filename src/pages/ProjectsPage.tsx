import useProjects from "../hooks/useProjects";
import ProjectItem from "../components/ProjectItem";
import Button from "../components/ui/Button";

function ProjectsPage() {
  const { projects, loading, error, fetchProjects } =
    useProjects();

  return (
    <div className="projects-page">
      <header className="projects-page__header">
        <h1>Projects</h1>
        <p>Manage and track your projects in one place.</p>
      </header>

      {loading ? (
        <p role="status">Loading projects...</p>
      ) : error ? (
        <div className="projects-page__error">
          <p role="alert">{error}</p>

          <Button
            variant="secondary"
            onClick={() => fetchProjects()}
          >
            Try again
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="projects-page__empty">
          <h2>No projects found</h2>
          <p>Your projects will appear here.</p>
        </div>
      ) : (
        <div className="projects-page__grid">
          {projects.map(project => (
            <ProjectItem
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage