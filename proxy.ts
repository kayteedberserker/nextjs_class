import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const protectedRoutes = ["/blog" ,"/book", "/posts"];


export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the current path is a protected route
  if (!protectedRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Use req.cookies in middleware (not cookies() from next/headers)
  const token = req.cookies.get("auth_token")?.value;

  console.log("Auth token:", token);

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/blog/:path*', "/book/:path*","/posts/:path*",]
}