import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "../../app/api/flashcards/route";
import { POST } from "../../app/api/flashcards/submit/route";
import { NextRequest } from "next/server";

// Mock the auth function
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

// Mock prisma
const mockPrisma = {
  kana: {
    findMany: vi.fn(),
  },
  kanaProgress: {
    upsert: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

describe("Flashcards API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/flashcards", () => {
    test("returns 401 when user is not authenticated", async () => {
      mockAuth.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    test("returns 401 when user session has no ID", async () => {
      mockAuth.mockResolvedValue({ user: {} });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    test("returns kana data for authenticated user", async () => {
      const mockKanaData = [
        {
          id: "1",
          character: "あ",
          romaji: "a",
          progress: [{ accuracy: 0.8 }],
        },
        {
          id: "2",
          character: "い",
          romaji: "i",
          progress: [],
        },
      ];

      mockAuth.mockResolvedValue({ user: { id: "user123" } });
      mockPrisma.kana.findMany.mockResolvedValue(mockKanaData);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        { id: "1", character: "あ", romaji: "a", accuracy: 0.8 },
        { id: "2", character: "い", romaji: "i", accuracy: 0 },
      ]);
      expect(mockPrisma.kana.findMany).toHaveBeenCalledWith({
        include: {
          progress: {
            where: { user_id: "user123" },
            select: { accuracy: true },
          },
        },
      });
    });

    test("handles database errors gracefully", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user123" } });
      mockPrisma.kana.findMany.mockRejectedValue(new Error("Database error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });

    test("handles prisma connection timeout", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user123" } });
      mockPrisma.kana.findMany.mockRejectedValue(
        new Error("Connection timeout")
      );

      const response = await GET();
      
      expect(response.status).toBe(500);
    });
  });

  describe("POST /api/flashcards/submit", () => {
    test("returns 401 when user is not authenticated", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/flashcards/submit", {
        method: "POST",
        body: JSON.stringify({ kanaId: "1", isCorrect: true }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    test("handles malformed request body", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user123" } });

      const request = new NextRequest("http://localhost:3000/api/flashcards/submit", {
        method: "POST",
        body: "invalid json",
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      
      expect(response.status).toBe(500);
    });

    test("successfully creates new progress record", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user123" } });
      
      const mockProgressRecord = {
        id: "progress1",
        attempts: 1,
        correct_attempts: 1,
      };

      mockPrisma.kanaProgress.upsert.mockResolvedValue(mockProgressRecord);
      mockPrisma.kanaProgress.update.mockResolvedValue({});

      const request = new NextRequest("http://localhost:3000/api/flashcards/submit", {
        method: "POST",
        body: JSON.stringify({ kanaId: "kana1", isCorrect: true }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.kanaProgress.upsert).toHaveBeenCalledWith({
        where: {
          kana_id_user_id: {
            kana_id: "kana1",
            user_id: "user123",
          },
        },
        update: {
          attempts: { increment: 1 },
          correct_attempts: { increment: 1 },
        },
        create: {
          kana_id: "kana1",
          user_id: "user123",
          attempts: 1,
          correct_attempts: 1,
        },
      });
    });

    test("handles database constraint violations", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user123" } });
      mockPrisma.kanaProgress.upsert.mockRejectedValue(
        new Error("Foreign key constraint violation")
      );

      const request = new NextRequest("http://localhost:3000/api/flashcards/submit", {
        method: "POST",
        body: JSON.stringify({ kanaId: "invalid-id", isCorrect: true }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      
      expect(response.status).toBe(500);
    });

    test("correctly handles incorrect answers", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user123" } });
      
      const mockProgressRecord = {
        id: "progress1",
        attempts: 1,
        correct_attempts: 0,
      };

      mockPrisma.kanaProgress.upsert.mockResolvedValue(mockProgressRecord);
      mockPrisma.kanaProgress.update.mockResolvedValue({});

      const request = new NextRequest("http://localhost:3000/api/flashcards/submit", {
        method: "POST",
        body: JSON.stringify({ kanaId: "kana1", isCorrect: false }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(mockPrisma.kanaProgress.upsert).toHaveBeenCalledWith({
        where: {
          kana_id_user_id: {
            kana_id: "kana1",
            user_id: "user123",
          },
        },
        update: {
          attempts: { increment: 1 },
          correct_attempts: undefined, // Should not increment for incorrect
        },
        create: {
          kana_id: "kana1",
          user_id: "user123",
          attempts: 1,
          correct_attempts: 0,
        },
      });
    });
  });
});