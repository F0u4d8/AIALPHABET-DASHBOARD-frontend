import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ contentId: string }>   }
  ) {

    const contentId = (await params).contentId;
  
    try {
      // Find specific content
      const content = await prisma.content.findUnique({
        where: { id: contentId },
        include: { category: true } // Optional: include related category
      });
  
      if (!content) {
        return NextResponse.json(
          { error: 'Content not found' }, 
          { status: 404 }
        );
      }
  
      return NextResponse.json(content, { status: 200 });
    } catch (error) {
      console.error('Content fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch content' }, 
        { status: 500 }
      );
    }
  }