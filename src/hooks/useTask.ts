import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types";

function useTask(id: string | undefined) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const fetchTask = useCallback(async (signal?: AbortSignal) => {
    if(!id) {
      setLoading(false);
      setError("");
      setNotFound(false);
      setTask(null);

      return;
    }

    setLoading(true);
    setError("");
    setNotFound(false);
    setTask(null);

    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        signal
      });

      if(response.status === 404) {
        setNotFound(true);
        return;
      }
      
      if(!response.ok) {
        throw new Error("Failed to fetch task.");
      }

      const data: Task = await response.json();

      if (signal?.aborted) return;

      setTask(data);
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
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    // Initial fetch intentionally updates request state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTask(controller.signal);

    return () => {
      controller.abort();
    }
  }, [fetchTask]);

  return {task, error, loading, notFound, fetchTask};
}

export default useTask