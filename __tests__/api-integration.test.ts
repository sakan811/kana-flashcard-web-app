import { describe, it, expect } from "vitest";

describe("API Integration", () => {
  it("GET /api/flashcards returns 401 if unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/flashcards");
    expect(res.status).toBe(401);
  });

  it("GET /api/stats returns 401 if unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/stats");
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/signup creates a user", async () => {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "apitestuser",
        password: "apitestpass",
      }),
    });
    // 409 if already exists, 200 if created
    expect([200, 409]).toContain(res.status);
  });

  it("POST /api/auth/signin fails with wrong password", async () => {
    const res = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "apitestuser", password: "wrongpass" }),
    });
    expect(res.status).toBe(401);
  });
});
