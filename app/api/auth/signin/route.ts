import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: "Please provide both username and password" },
        { status: 400 },
      );
    }

    // Check if the user exists in database
    const user = await prisma.user.findUnique({
      where: { email: username },
      select: { id: true, name: true, email: true, password: true },
    });

    // User not found
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Account not found. Please check your username or sign up." },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    // Authentication successful
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      {
        error: "Unable to sign in. Please try again later.",
      },
      { status: 500 },
    );
  }
}
