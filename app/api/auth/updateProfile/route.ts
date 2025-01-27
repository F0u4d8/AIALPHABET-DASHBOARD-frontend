import prisma from "@/lib/db";
import { verifyMobileToken } from "@/lib/tokens/verifyTokens";
import {  profileUpdateSchema } from "@/lib/zodSchemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateToken } from "@/lib/tokens/generateTokens";



export async function PUT(request: NextRequest) {
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
          
      // Parse and validate request body
      const body = await request.json();
      const { username, avatarUrl , email } = await profileUpdateSchema.parseAsync(body);
  



      const newProfile = await prisma.user.update({
        where : {
            id : userId
        } ,
        data : {
            profile : {
                update : {
                    username , avatarUrl
                }
            } , 
            email : email
        }
      })


      const { password: _, ...userWithoutPassword } = newProfile;


      const user = await prisma.user.findUnique({where : {id : userId} , select : {id : true , email : true , permission : true , role : true , profile : true } })

      const token = generateToken(userWithoutPassword );
      return NextResponse.json({
        message: 'Profile updated successfully',
      token , user
      }, { status: 201 });
  
    } catch (error) {
      console.error('Profile creation error:', error);
      
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          error: error.errors[0].message
        }, { status: 400 });
      }
  
      return NextResponse.json({
        error: 'Profile creation failed'
      }, { status: 500 });
    }
  }



  export async function GET(request: NextRequest) {
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
          const user = await prisma.user.findUnique({
            where : {
              id : userId
            } ,select : {
               profile : true ,
               email : true ,

            }
            
          })

          return NextResponse.json({
          user
          }, { status: 201 });

  }