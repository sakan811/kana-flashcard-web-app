import { describe, it, expect } from "vitest";

describe("API Error Handling", () => {
  it("returns 400 for missing fields on signup", async () => {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "" }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 401 for invalid credentials on signin", async () => {
    const res = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "notarealuser", password: "badpass" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 401 for unauthenticated /api/flashcards/submit", async () => {
    const res = await fetch("http://localhost:3000/api/flashcards/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kanaId: "fake", isCorrect: true }),
    });
    expect(res.status).toBe(401);
  });
});
