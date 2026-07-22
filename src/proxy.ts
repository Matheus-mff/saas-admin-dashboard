import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session");
  const isAuthenticated = session?.value === "authenticated";

  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/products/:path*",
    "/orders/:path*",
    "/settings/:path*",
    "/login",
  ],
};