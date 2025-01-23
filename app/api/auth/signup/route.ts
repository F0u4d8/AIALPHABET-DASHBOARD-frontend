import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signUpSchema } from '@/lib/zodSchemas';
import prisma from '@/lib/db';
import { generateToken } from '@/lib/tokens/generateTokens';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, qrCode } = await signUpSchema.parseAsync(body);

    // Verify QR Code and get associated book permission
    const qrCodeRecord = await prisma.qRCode.findUnique({
      where: { code: qrCode },
      include: {
        book: true
      }
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

    // Create user with the book's permission
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        permission: qrCodeRecord.book.permission,
      }
    });

    // Mark QR code as used and record usage
    await prisma.qRCode.update({
      where: { id: qrCodeRecord.id },
      data: {
        used: true,
        usedAt: new Date(),
        
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    // Generate JWT token
    const token = generateToken(userWithoutPassword);

    return NextResponse.json({
      token,
      requireProfileSetup: true,
      permission: qrCodeRecord.book.permission
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