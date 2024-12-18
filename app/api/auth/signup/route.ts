

// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signInSchema, signUpSchema } from '@/lib/zodSchemas';
import prisma from '@/lib/db';
import { generateToken } from '@/lib/tokens/generateTokens';



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email,password, qrCode } = await signUpSchema.parseAsync(body);

    // Verify QR Code
    const qrCodeRecord = await prisma.qRCode.findUnique({
      where: { code: qrCode }
    });

    if (!qrCodeRecord) {
      return NextResponse.json({ error: 'Invalid QR Code' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    // Delete used QR code
    await prisma.qRCode.delete({
      where: { id: qrCodeRecord.id }
    });
    const { password: _, ...userWithoutPassword } = newUser;
    // Generate JWT token
    const token = generateToken(userWithoutPassword);

 
    return NextResponse.json({
        token,
        requireProfileSetup: true
      }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: error instanceof z.ZodError 
        ? error.errors[0].message 
        : 'Signup failed' 
    }, { status: 500 });
  }
}