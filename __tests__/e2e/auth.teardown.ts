import { test as teardown } from "@playwright/test";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, "../../playwright/.auth/user.json");

teardown("cleanup auth", async () => {
  // Clean up the auth file
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
  }
});
