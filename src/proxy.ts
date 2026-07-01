import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isDashboardPage = req.nextUrl.pathname.startsWith("/");

    if (!isAuth && isDashboardPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAuth && token?.role?.toString().toLowerCase() !== "admin" && isDashboardPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
