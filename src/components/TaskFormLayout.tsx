import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type TaskFormLayoutProps = {
  title: string;
  description: string;
  backTo: string;
  backLabel: string;
  children: ReactNode;
};

function TaskFormLayout({
  title,
  description,
  backTo,
  backLabel,
  children
}: TaskFormLayoutProps) {
  return (
    <div className="task-form-page">
      <Link
        to={backTo}
        className="task-form-page__back"
      >
        ← {backLabel}
      </Link>

      <header className="task-form-page__header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <section className="task-form-page__panel">
        <h2>Task information</h2>
        {children}
      </section>
    </div>
  );
}

export default TaskFormLayout