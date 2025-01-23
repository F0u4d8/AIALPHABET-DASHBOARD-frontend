import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { JWT } from "next-auth/jwt";
import { signInSchema } from "./lib/zodSchemas";
import prisma from "./lib/db";

class customError extends AuthError {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Day
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const parsedCredentials = signInSchema.safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email, role: "ADMIN" },
            include: { profile: true },
          });

          if (!user) {
            return null;
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          const { password: _, ...userWithoutPassword } = user;

          return userWithoutPassword;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
  
    authorized({ auth, request: { nextUrl } }) {

      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    }
   
  },
});
