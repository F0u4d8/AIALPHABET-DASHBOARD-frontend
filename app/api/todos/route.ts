import prisma from "@/lib/db";
import { verifyMobileToken } from "@/lib/tokens/verifyTokens";
import { todoSchema } from "@/lib/zodSchemas";
import { NextRequest, NextResponse } from "next/server";

// app/api/todos/route.ts
export async function GET(request: NextRequest) {
    try {

  
     // Verify authentication
     const mobileToken = request.headers.get('authorization')?.split('Bearer ')[1];

     if (!mobileToken) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }), 
      { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
 
 const userId = await verifyMobileToken(mobileToken);
 
      if (!userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
   
      // Fetch todos for the authenticated user
      const todos = await prisma.todo.findMany({
        where: { userId: userId }
      });
  
      return NextResponse.json(todos, { status: 200 });
    } catch (error) {
      console.error('Todos fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch todos' }, 
        { status: 500 }
      );
    }
  }
  
  export async function POST(request: NextRequest) {

    try {


        // Verify authentication
        const mobileToken = request.headers.get('authorization')?.split('Bearer ')[1];

        if (!mobileToken) {
       return new NextResponse(
         JSON.stringify({ error: 'Authentication required' }), 
         { 
           status: 401, 
           headers: { 'Content-Type': 'application/json' } 
         }
       );
     }
    
    const userId = await verifyMobileToken(mobileToken);
    
         if (!userId) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
           }
           
      // Parse request body
      const body = await request.json();
  
      // Validate todo data (you might want more robust validation)
     const {title ,priority ,isCompleted ,description   } = await todoSchema.parseAsync(body);
  
      // Create todo for the authenticated user
      const newTodo = await prisma.todo.create({
        data: {
          userId :userId ,
          title: title ,
          isCompleted: isCompleted || false ,
          description : description ,
          priority : priority ,
        }
      });
  
      return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
      console.error('Todo creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create todo' }, 
        { status: 500 }
      );
    }
  }