import prisma from "@/lib/db";
import { verifyMobileToken } from "@/lib/tokens/verifyTokens";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest ) {

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
const aiModel = await prisma.aiModel.findFirst({
   
})
return NextResponse.json(aiModel, { status: 200 });
        } catch (error) {
            console.error('aiModel fetch error:', error);
            return NextResponse.json(
              { error: 'Failed to fetch aiModel' }, 
              { status: 500 }
            );
        }

}