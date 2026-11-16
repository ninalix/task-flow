import { Link } from "react-router-dom";
import { Folder, CalendarDays, ArrowRight } from "lucide-react";
import type { Project } from "../types";
import Badge from "./ui/Badge";

type ProjectItemProps = {
  project: Project;
};

function ProjectItem({ project }: ProjectItemProps) {
  const formattedDate = project.deadline
    ? new Date(`${project.deadline}T00:00:00`).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "No due date";

  return (
    <Link
      to={`/projects/${project.id}`}
      className="project-card"
      aria-label={`View project: ${project.name}`}
    >
      <div className="project-card__header">
        <span className="project-card__icon">
          <Folder size={22} aria-hidden="true" />
        </span>

        <Badge
          variant={project.status === "active" ? "success" : "neutral"}
        >
          {project.status === "active" ? "Active" : "Completed"}
        </Badge>
      </div>

      <div className="project-card__content">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
      </div>

      <div className="project-card__footer">
        <span className="project-card__date">
          <CalendarDays size={16} aria-hidden="true" />
          {formattedDate}
        </span>

        <span className="project-card__link">
          View project
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default ProjectItem;