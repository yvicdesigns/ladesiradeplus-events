import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only run auth checks for protected/auth routes — avoids timeout on every page
  const needsAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/mon-espace") ||
    pathname === "/connexion" ||
    pathname === "/inscription";

  if (!needsAuth) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/connexion?next=/admin", request.url)
      );
    }
    const role = user.app_metadata?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/?access=denied", request.url));
    }
  }

  // Protect /mon-espace
  if (pathname.startsWith("/mon-espace") && !user) {
    return NextResponse.redirect(
      new URL("/connexion?next=/mon-espace", request.url)
    );
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === "/connexion" || pathname === "/inscription") && user) {
    return NextResponse.redirect(new URL("/mon-espace", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
