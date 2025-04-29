import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing username or password" },
        { status: 400 },
      );
    }
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: username },
    });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: username,
        name: username,
        password: hashed,
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
