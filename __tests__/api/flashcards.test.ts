import { describe, test, expect, vi } from "vitest";
import { GET } from "../../app/api/flashcards/route";
import { POST } from "../../app/api/flashcards/submit/route";
import { NextRequest } from "next/server";

// Use vi.hoisted to declare mocks that can be used in vi.mock
const { mockAuth, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    kana: { findMany: vi.fn() },
    kanaProgress: { upsert: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

describe("Flashcards API", () => {
  describe("GET /api/flashcards", () => {
    test("requires authentication", async () => {
      mockAuth.mockResolvedValue(null);
      const response = await GET();
      expect(response.status).toBe(401);
    });

    test("returns kana data for authenticated user", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user123" } });
      mockPrisma.kana.findMany.mockResolvedValue([
        {
          id: "1",
          character: "あ",
          romaji: "a",
          progress: [{ accuracy: 0.8 }],
        },
      ]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data[0]).toEqual({
        id: "1",
        character: "あ",
        romaji: "a",
        accuracy: 0.8,
      });
    });
  });

  describe("POST /api/flashcards/submit", () => {
    test("creates progress record", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user123" } });
      mockPrisma.kanaProgress.upsert.mockResolvedValue({
        id: "1",
        attempts: 1,
        correct_attempts: 1,
      });

      const request = new NextRequest(
        "http://localhost/api/flashcards/submit",
        {
          method: "POST",
          body: JSON.stringify({ kanaId: "1", isCorrect: true }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(mockPrisma.kanaProgress.upsert).toHaveBeenCalled();
    });
  });
});
