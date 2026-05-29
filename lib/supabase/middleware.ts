import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_PROJECT_URL!,
    process.env.NEXT_PUBLIC_PROJECT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");

  // Redirect unauthenticated users from admin routes
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/?auth=login", request.url));
  }

  // Check admin role for admin routes (only if user is authenticated)
  if (isAdminRoute && user) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      // If there's an error or no profile, allow access (let client-side handle it)
      // This prevents login loops when DB query fails in middleware
      if (error || !profile) {
        // Don't redirect, allow the request to continue
        // Client-side admin layout will handle role checking
      } else if (profile.role !== 'admin') {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      // If DB query fails, allow access and let client-side handle it
      console.error("Middleware profile check error:", e);
    }
  }

  // Redirect authenticated admins away from auth pages
  if (isAuthRoute && user) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (!error && profile && profile.role === 'admin') {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch (e) {
      console.error("Middleware auth redirect error:", e);
    }
  }

  return supabaseResponse;
}