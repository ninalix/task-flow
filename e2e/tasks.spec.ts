import { test, expect } from "@playwright/test";
import { createTestTask } from "./helpers/tasks";

test("navigates from tasks list to create task page", async ({page}) => {
  // 1. Navigate to Tasks page
  await page.goto("/tasks");

  // 2. Verify heading
  await expect(
    page.getByRole("heading", {
      name: "Tasks"
    })
  ).toBeVisible();

  // 3. Click Create task
  const link = page.getByRole("link", {
    name: "Create task"
  });
  await link.click();

  // 4. Verify navigation
  await expect(page).toHaveURL(/\/tasks\/new$/);
});

test("shows validation errors when submitting an empty task form", async ({page}) => {
  // 1. Navigate to /tasks/new
  await page.goto("/tasks/new");

  // 2. Click the Create task submit button
  const button = page.getByRole("button", {
    name: "Create task"
  });
  await button.click();

  // 3. Verify the required field error message is visible
  const titleError = page.getByText("Title is required.");
  await expect(titleError).toBeVisible();

  // 4. Verify focus moves to the Title input
  const titleInput = page.getByLabel("Title");
  await expect(titleInput).toBeFocused();
  await expect(titleInput).toHaveAttribute("aria-invalid", "true");
  await expect(titleInput).toHaveAttribute(
    "aria-describedby",
    /title-error/
  );

  // 5. Verify POST request wasn't sent
  const postRequests: string[] = [];

  page.on("request", request => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/tasks"
    ) {
      postRequests.push(request.url());
    }
  });

  expect(postRequests).toHaveLength(0);
});

test("creates a new task successfully", async ({page}) => {
  // 1. Navigate to /tasks/new
  await page.goto("/tasks/new");

  // 2. Fill Title and Description
  await page.getByLabel("Title").fill("Playwright Test Task");
  await page.getByLabel("Description").fill("Created by Playwright E2E test");

  // 3. Select Status, Priority and Project
  await page.getByLabel("Status").selectOption("todo");
  await page.getByLabel("Priority").selectOption("medium");
  await page.getByLabel("Project").selectOption("1");

  // 4. Set Due Date if required
  await page.getByLabel("Due date").fill("2026-12-31");

  // 5. Prepare to wait for POST /tasks response
  const responsePromise = page.waitForResponse(
    response => response.url().includes("/tasks") && response.request().method() === "POST"
  );

  // 6. Click Create task
  await page.getByRole("button", {name: "Create task"}).click();

  // 7. Verify the API response status
  const response = await responsePromise;
  expect(response.status()).toBe(201);

  // 8. Verify successful navigation or the created task
  const createdTask = await response.json();
  await expect(page).toHaveURL(`/tasks/${createdTask.id}`);

  await expect(
    page.getByRole("heading", {
      name: "Playwright Test Task",
      exact: true
    })
  ).toBeVisible();
});

test("edits an existing task successfully", async ({page, request}) => {
  // 1. Create a test task using request.post()
  // 2. Get the created task ID
  const task = await createTestTask(request);

  // 3. Navigate to /tasks/:id/edit
  await page.goto(`/tasks/${task.id}/edit`);

  // 4. Verify the existing title is loaded
  await expect(page.getByLabel("Title")).toHaveValue("Original Task");

  // 5. Update the title
  await page.getByLabel("Title").fill("Updated original task");

  // 6. Update priority to high
  await page.getByLabel("Priority").selectOption("high");

  // 7. Prepare waitForResponse() for PUT or PATCH
  const responsePromise = page.waitForResponse(
    response => new URL(response.url()).pathname === `/tasks/${task.id}` &&
    response.request().method() === "PATCH"
  );

  // 8. Click Save
  await page.getByRole("button", { name: "Save"}).click();

  // 9. Verify API response
  const saveResponse = await responsePromise;
  expect(saveResponse.status()).toBe(200);

  // 10. Verify updated task title on the detail page
  await expect(page.getByRole("heading", {name: "Updated original task"})).toBeVisible();

  // 11. Verify updated task title and priority
  const savedTask = await saveResponse.json();
  expect(savedTask.title).toBe("Updated original task");
  expect(savedTask.priority).toBe("high");
});

test("cancels task deletion and restores focus", async ({page, request}) => {
  // 1. Use request.post() to create a test task
  const task = await createTestTask(request);

  // 2. Navigate to /tasks/:id
  await page.goto(`/tasks/${task.id}`);

  // 3. Click Delete button
  const deleteButton = page.getByRole("button", {name: "Delete"});
  await deleteButton.click();

  // 4. Verify the dialog is visible
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // 5. Verify Cancel button has initial focus
  const cancelButton = dialog.getByRole("button", { name: "Cancel" });
  await expect(cancelButton).toBeFocused();

  // 6. Click Cancel
  await cancelButton.click();

  // 7. Verify dialog is hidden
  await expect(dialog).toBeHidden();

  // 8. Verify focus returns to Delete button
  await expect(deleteButton).toBeFocused();

  const getResponse = await request.get(
    `http://127.0.0.1:3001/tasks/${task.id}`
  );

  expect(getResponse.status()).toBe(200);
});

test("deletes a task successfully", async ({page, request}) => {
  // 1. Create a test task using request.post()
  const task = await createTestTask(request);

  // 2. Navigate to /tasks/:id
  await page.goto(`/tasks/${task.id}`);

  // 3. Click Delete
  const deleteButton = page.getByRole("button", {name: "Delete"});
  await deleteButton.click();

  // 4. Verify the dialog is visible
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // 5. Prepare waitForResponse() for DELETE /tasks/:id
  const responsePromise = page.waitForResponse(
    response => new URL(response.url()).pathname === `/tasks/${task.id}` &&
    response.request().method() === "DELETE"
  );

  // 6. Click Confirm Delete inside dialog
  await dialog.getByRole("button", {name: "Delete task"}).click();

  // 7. Verify API response status
  const deleteResponse = await responsePromise;
  expect([200, 204]).toContain(deleteResponse.status());

  // 8. Verify navigation to /tasks
  await expect(page).toHaveURL("/tasks");

  // 9. Verify task no longer exists in database
  const getResponse = await request.get(
    `http://127.0.0.1:3001/tasks/${task.id}`
  );

  expect(getResponse.status()).toBe(404);
});

test("closes delete dialog with Escape and restores focus", async ({page, request}) => {
  // 1. Create test task using API
  const task = await createTestTask(request);

  // 2. Navigate to task detail
  await page.goto(`/tasks/${task.id}`);

  // 3. Open delete dialog
  const deleteButton = page.getByRole("button", {name: "Delete"});
  await deleteButton.click();

  // 4. Verify dialog is visible
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // 5. Press Escape
  await page.keyboard.press("Escape");

  // 6. Verify dialog is hidden
  await expect(dialog).toBeHidden();

  // 7. Verify focus returns to Delete button
  await expect(deleteButton).toBeFocused();

  // 8. Verify task still exists
  const getResponse = await request.get(
    `http://127.0.0.1:3001/tasks/${task.id}`
  );

  expect(getResponse.status()).toBe(200);
});

test("traps keyboard focus inside delete dialog", async ({page, request}) => {
  // 1. Create task using API
  const task = await createTestTask(request);

  // 2. Navigate to task detail
  await page.goto(`/tasks/${task.id}`);

  // 3. Open delete dialog
  const deleteButton = page.getByRole("button", {name: "Delete"});
  await deleteButton.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // 4. Get Cancel and Delete task buttons inside dialog
  const cancelButton = dialog.getByRole("button", { name: "Cancel" });
  const confirmButton = dialog.getByRole("button", { name: "Delete task" });

  // 5. Focus Delete task button
  await confirmButton.focus();

  // 6. Press Tab
  await page.keyboard.press("Tab");

  // 7. Verify Cancel button is focused
  await expect(cancelButton).toBeFocused();

  // 8. Focus Cancel button
  await cancelButton.focus();

  // 9. Press Shift+Tab
  await page.keyboard.press("Shift+Tab");

  // 10. Verify Delete task button is focused
  await expect(confirmButton).toBeFocused();
});