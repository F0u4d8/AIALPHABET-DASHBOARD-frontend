import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest, 
    { params }: { params: { categoryId: string } }
  ) {
const categoryId = params.categoryId;

    try {
      // Find category and its contents
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: { contents: true }
      });
  
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' }, 
          { status: 404 }
        );
      }
  
      return NextResponse.json(category.contents, { status: 200 });
    } catch (error) {
      console.error('Contents fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contents' }, 
        { status: 500 }
      );
    }
  }