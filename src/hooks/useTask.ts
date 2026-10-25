import { useEffect, useState } from "react";
import type { Task } from "../types";

function useTask(id: string | undefined) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  async function fetchTask() {
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
      const response = await fetch(`http://localhost:3000/tasks/${id}`);

      if(response.status === 404) {
        setNotFound(true);
        return;
      }
      
      if(!response.ok) {
        throw new Error("Failed to fetch task.");
      }

      const data: Task = await response.json();
      setTask(data);
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
    fetchTask();
  }, [id]);

  return {task, error, loading, notFound, fetchTask};
}

export default useTask