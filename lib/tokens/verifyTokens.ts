import jwt from 'jsonwebtoken';
import prisma from '../db';
import { Permissions, UserProfile, UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || '';


export async function verifyMobileToken(token: string ): Promise<string | null> {
    try {
    
      
        const decoded = jwt.verify(token, JWT_SECRET) as { 
            id: string, 
            email: string, 
            role: UserRole ,
            permission : Permissions ,
            profile? : Partial <UserProfile> 
          };
      
          // Verify user still exists in database
          const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { 
              id: true
            }
          });
      
          if (!user) {
            return null
          }
      
          return user.id;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
  