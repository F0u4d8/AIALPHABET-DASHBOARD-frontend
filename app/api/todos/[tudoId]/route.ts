import prisma from "@/lib/db";
import { verifyMobileToken } from "@/lib/tokens/verifyTokens";
import { NextRequest, NextResponse } from "next/server";


// app/api/todos/[todoId]/route.ts






export async function GET(
  request: NextRequest, 
  { params }: { params: { tudoId: string } }
) {

  const tudoId = params.tudoId;

  try {
    // Find specific content
    const todo = await prisma.todo.findUnique({
      where: { id: tudoId },
    
    });

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error('todo fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' }, 
      { status: 500 }
    );
  }
}






export async function PUT(
    request: NextRequest, 
    { params }: { params: { todoId: string } }
  ) {

    try {
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
          
    const todoId = params.todoId;
  
      // Find todo owned by the user
      const existingTodo = await prisma.todo.findUnique({
        where: { 
          id: todoId, 
          userId: userId
        }
      });
  
      if (!existingTodo) {
        return NextResponse.json(
          { error: 'Todo not found' }, 
          { status: 404 }
        );
      }
  
      // Parse request body
      const body = await request.json();
  
      // Update todo
      const updatedTodo = await prisma.todo.update({
        where: { id: todoId },
        data: {
          title: body.title ?? existingTodo.title,
          isCompleted: body.isCompleted ?? existingTodo.isCompleted ,
          description : body.description ?? existingTodo.description ,
          priority : body.priority ?? existingTodo.priority ,
        }
      });
  
      return NextResponse.json(updatedTodo, { status: 200 });
    } catch (error) {
      console.error('Todo update error:', error);
      return NextResponse.json(
        { error: 'Failed to update todo' }, 
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    request: NextRequest, 
    { params }: { params: { todoId: string } }
  ) {
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
       
  
    const todoId = params.todoId;
  
      // Delete todo owned by the user
      await prisma.todo.delete({
        where: { 
          id: todoId, 
          userId: userId
        }
      });
  
      return NextResponse.json(
        { message: 'Todo deleted successfully' }, 
        { status: 204 }
      );
    } catch (error) {
      console.error('Todo deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete todo' }, 
        { status: 500 }
      );
    }
  }