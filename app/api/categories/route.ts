import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
 
    
    // Get query parameter
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
  
    try {
      // Fetch categories with optional filtering
      const categories = query 
        ? await prisma.category.findMany({
            where: { 
              name: { 
                contains: query, 
                mode: 'insensitive' 
              } 
            }
          })
        : await prisma.category.findMany();
  
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' }, 
        { status: 500 }
      );
    }
  }