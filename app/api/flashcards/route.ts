/*
 * SakuMari - Japanese Kana Flashcard App
 * Copyright (C) 2025  Sakan Nirattisaykul
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Single query with joins
    const kanaWithProgress = await prisma.kana.findMany({
      include: {
        progress: {
          select: {
            accuracy: true,
          },
        },
      },
    });

    // Transform the data
    const result = kanaWithProgress.map((kana) => ({
      id: kana.id,
      character: kana.character,
      romaji: kana.romaji,
      accuracy: kana.progress[0]?.accuracy || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching kana data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
