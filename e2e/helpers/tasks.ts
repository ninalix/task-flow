import type { APIRequestContext } from "@playwright/test";

export async function createTestTask(request: APIRequestContext) {
  const response = await request.post(
    "http://127.0.0.1:3001/tasks",
    {
      data: {
        title: "Original Task",
        description: "Task before editing",
        status: "todo",
        priority: "low",
        projectId: "1",
        dueDate: "2026-12-31"
      }
    }
  );

  if (!response.ok()) {
    throw new Error(`Failed to create test task: ${response.status()}`);
  }

  return response.json();
}