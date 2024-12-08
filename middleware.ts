import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const protectedRoutes = ["/dashboard"];
const redirectAfterLogin = "/dashboard"; // Redirect destination after login

export default async function middleware(request: NextRequest) {
  const session = await auth();


  const isLoginOrHomePage =
    request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/login";

  // If the user is logged in and is trying to access login or home page, redirect them to the dashboard
  if (session && isLoginOrHomePage) {
    const redirectURL = new URL(redirectAfterLogin, request.nextUrl.origin);
    return NextResponse.redirect(redirectURL.toString());
  }


  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );




  if (!session && isProtected) {
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};