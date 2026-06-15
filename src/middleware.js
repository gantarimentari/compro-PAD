import { NextResponse } from "next/server";
export function middleware(request) {
  const isAuthenticated = request.cookies.get("auth_status")?.value === "1";
  const role = request.cookies.get("auth_role")?.value;
  const path = request.nextUrl.pathname;

  const protectedPaths = ["/notifications", "/profile", "/dashboard"];
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));

  const isAuthPath = path.startsWith("/auth");
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/dashboard") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
  
};



export const config = {
  matcher: ['/notifications/:path*', '/profile/:path*', '/dashboard/:path*', '/auth/:path*'], 
  
};