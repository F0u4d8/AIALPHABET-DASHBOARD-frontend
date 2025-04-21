import prisma from "@/lib/db";
import { verifyMobileToken } from "@/lib/tokens/verifyTokens";
import { profileSchema } from "@/lib/zodSchemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { generateToken } from "@/lib/tokens/generateTokens";
import { Permissions, UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function GET(request: NextRequest) {
  try {
    const mobileToken = request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!mobileToken) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = await verifyMobileToken(mobileToken);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        permission: true,
        role: true,
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user profile",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const mobileToken = request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!mobileToken) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = await verifyMobileToken(mobileToken);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { username, avatarUrl } = await profileSchema.parseAsync(body);

    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 409 }
      );
    }

    // Create user profile
    const newProfile = await prisma.userProfile.create({
      data: {
        userId: userId,
        username,
        avatarUrl,
      },
    });
    const decoded = jwt.verify(mobileToken, JWT_SECRET) as {
      id: string;
      email: string;
      role: UserRole;
      permission: Permissions[];
    };

    const token = generateToken(decoded, newProfile);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        permission: true,
        role: true,
        profile: true,
      },
    });

    return NextResponse.json(
      {
        message: "Profile created successfully",
        token,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Profile creation failed",
      },
      { status: 500 }
    );
  }
}
