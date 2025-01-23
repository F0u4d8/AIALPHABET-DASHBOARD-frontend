import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ categoryId: string }>  }
  ) {
const categoryId =(await params).categoryId;
console.log(categoryId);

    try {
      // Find category and its contents
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {contents :{
          select: {
            id: true,
            image: true ,appStoreUrl :true , playStoreUrl :true , title:true
          }
        }}
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