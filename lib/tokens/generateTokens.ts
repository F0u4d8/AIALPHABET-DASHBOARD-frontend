import { User, UserProfile } from '@prisma/client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '7d';

export function generateToken(user: Partial<User>, profile?: Partial <UserProfile>) {
  const payload: Record<string, any> = {
    id: user.id,
    email: user.email,
    permission : user.permission
  };

  // Include profile data if provided
  if (profile) {
    payload.profile = {
      username: profile.username,
      avatarUrl: profile.avatarUrl
    };
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}