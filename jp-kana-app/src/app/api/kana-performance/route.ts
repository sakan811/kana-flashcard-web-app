import { NextRequest } from "next/server";
import prisma from "../../../lib/prisma";
import { withAuth, verifyUserId, createErrorResponse, createSuccessResponse } from "@/lib/api-utils";

export const GET = withAuth(async (request: NextRequest, userId: string) => {
  const searchParams = request.nextUrl.searchParams;
  const requestedUserId = searchParams.get("userId");
  const kanaType = searchParams.get("kanaType") as
    | "hiragana"
    | "katakana"
    | null;

  try {
    // Verify the requested userId matches the authenticated userId
    const effectiveUserId = verifyUserId(requestedUserId, userId);

    if (!kanaType) {
      return createErrorResponse("Missing kanaType parameter", 400);
    }

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    console.log(`Fetching performance data for user ${effectiveUserId} and kana type ${kanaType}`);
    
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: effectiveUserId,
        kanaType: kanaType,
      },
    });

    const performanceData = performances.map((perf) => ({
      kana: perf.kana,
      kanaType: perf.kanaType,
      correctCount: perf.correctCount,
      totalCount: perf.totalCount,
      accuracy:
        perf.totalCount > 0 ? (perf.correctCount / perf.totalCount) * 100 : 0,
    }));

    return createSuccessResponse(performanceData);
  } catch (error) {
    console.error(`Error getting ${kanaType} performance:`, error);
    
    if (error instanceof Error && error.message === "User ID does not match authenticated session") {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse(
      "Database connection error. Please check your database configuration and environment variables.",
      500
    );
  }
});
