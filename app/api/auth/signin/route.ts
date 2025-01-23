import prisma from "@/lib/db";
import { signInSchema } from "@/lib/zodSchemas";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/tokens/generateTokens";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = await signInSchema.parseAsync(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include : {profile : true}
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const { password: _, ...userWithoutPassword } = user;

    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },include : {user : true}
    });

    if (!existingProfile) {
      const token = generateToken(userWithoutPassword);

      return NextResponse.json(
        {
          token, requireProfileSetup: true
        },
        { status: 201 }
      );
    }

    // Generate JWT token

    const token = generateToken(userWithoutPassword, existingProfile);
    return NextResponse.json(
      {
        token,user : userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: "Signin failed" }, { status: 500 });
  }
}
