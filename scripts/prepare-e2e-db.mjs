import { mkdir, copyFile } from "node:fs/promises";

await mkdir("e2e/.tmp", { recursive: true });

await copyFile("e2e/fixtures/db.test.json", "e2e/.tmp/db.json");

console.log("E2E database reset successfully.");
