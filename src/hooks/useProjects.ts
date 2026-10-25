import { useEffect, useState } from "react";
import type { Project } from "../types";

function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchProjects() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/projects");

      if(!response.ok) {
        throw new Error("Failed to fetch projects.");
      }

      const data: Project[] = await response.json();
      setProjects(data);
    } catch(error) {
      if(error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects
  }
}

export default useProjects