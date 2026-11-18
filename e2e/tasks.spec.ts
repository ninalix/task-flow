import { test, expect } from "@playwright/test";

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