import { describe, it, expect } from "vitest";

describe("API Error Handling", () => {
  it("returns 401 for unauthenticated /api/flashcards", async () => {
    const res = await fetch("http://localhost:3000/api/flashcards");
    expect(res.status).toBe(401);
  });

  it("returns 401 for unauthenticated /api/stats", async () => {
    const res = await fetch("http://localhost:3000/api/stats");
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

  it("returns appropriate error for malformed requests", async () => {
    const res = await fetch("http://localhost:3000/api/flashcards/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invalid: "data" }),
    });
    expect([400, 401]).toContain(res.status); // Either bad request or unauthorized
  });
});
