import { useEffect, useState } from "react";
import type { Task } from "../types";

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/tasks");

      if(!response.ok) {
        throw new Error("Failed to fetch tasks.");
      }

      const data: Task[] = await response.json();
      setTasks(data);
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
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks
  }
}

export default useTasks