import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { verifyMobileToken } from "./lib/tokens/verifyTokens";

const protectedRoutes = ["/dashboard"];
const redirectAfterLogin = "/dashboard";

// Mobile API routes that require authentication
const mobileProtectedApiRoutes = [

 "/api/categories" ,
  "/api/contents"
];

export default async function middleware(request: NextRequest) {
  // Check for mobile API token in Authorization header
  const mobileToken = request.headers.get('authorization')?.split('Bearer ')[1];

  // Web session authentication
  const session = await auth();

  const isLoginOrHomePage =
    request.nextUrl.pathname === "/" 

  // If the user is logged in and is trying to access login or home page, redirect them to the dashboard
  if (session && isLoginOrHomePage) {
    const redirectURL = new URL(redirectAfterLogin, request.nextUrl.origin);
    return NextResponse.redirect(redirectURL.toString());
  }

  // Check for protected web routes
  const isWebProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check for protected mobile API routes
  const isMobileApiProtected = mobileProtectedApiRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Web route protection
  if (!session && isWebProtected) {
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // Mobile API route protection
  if (isMobileApiProtected) {
    // If no mobile token is present, deny access
    if (!mobileToken) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }), 
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify mobile token (you'll need to implement this function)
    try {
      const userId = await verifyMobileToken(mobileToken);

      // If token verification fails
      if (!userId) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid token' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Token verification failed' }), 
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }

  return NextResponse.next();
}



export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};