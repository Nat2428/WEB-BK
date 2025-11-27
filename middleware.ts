import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get("user_id");

  // Public routes yang tidak perlu auth
  const publicRoutes = ["/", "/login"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes berdasarkan role
  if (pathname.startsWith("/siswa")) {
    if (!userCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Role check akan dilakukan di page component
    return NextResponse.next();
  }

  if (pathname.startsWith("/guru")) {
    if (!userCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!userCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};


