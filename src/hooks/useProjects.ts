import { useCallback, useEffect, useState } from "react";
import type { Project } from "../types";

function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/projects", {
        signal
      });

      if(!response.ok) {
        throw new Error("Failed to fetch projects.");
      }

      const data: Project[] = await response.json();
      
      if (signal?.aborted) return;

      setProjects(data);
    } catch(error) {
      if(signal?.aborted) {
        return;
      }
      if(error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      if(!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    // Initial fetch intentionally updates loading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects
  }
}

export default useProjects