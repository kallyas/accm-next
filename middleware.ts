import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Cache control constants
const CACHE_CONTROL_PRIVATE = "private, no-cache, no-store, must-revalidate";

// Optimized route configuration using Map for O(1) lookup
const PROTECTED_ROUTES = new Map([
  [
    "PAYMENT_PENDING",
    {
      message: "Please complete your payment to access this feature",
      routes: new Set([
        "/dashboard/personal-discovery",
        "/dashboard/cvs",
        "/scholarship-quest",
        "/dashboard/essays",
      ]),
      redirectPath: "/dashboard/billing",
    },
  ],
  [
    "PERSONAL_DISCOVERY_PENDING",
    {
      message: "Complete your personal discovery questionnaire to proceed",
      routes: new Set([
        "/dashboard/cvs",
        "/scholarship-quest",
        "/dashboard/essays",
        "/cv-alignment",
      ]),
      redirectPath: "/dashboard/status",
    },
  ],
  [
    "CV_ALIGNMENT_PENDING",
    {
      message:
        "Please complete your CV alignment before accessing this section",
      routes: new Set(["/scholarship-quest", "/dashboard/essays"]),
      redirectPath: "/status",
    },
  ],
  [
    "SCHOLARSHIP_MATRIX_PENDING",
    {
      message: "Complete your scholarship matrix to access the essays section",
      routes: new Set(["/dashboard/essays"]),
      redirectPath: "/status",
    },
  ],
]);

// Memoized URL creator for better performance
const createRedirectURL = (() => {
  const urlCache = new Map<string, URL>();

  return (baseUrl: string, message: string, request: NextRequest): URL => {
    const cacheKey = `${baseUrl}:${message}:${request.url}`;

    if (!urlCache.has(cacheKey)) {
      const url = new URL(baseUrl, request.url);
      url.searchParams.set("message", encodeURIComponent(message));
      url.searchParams.set("returnTo", encodeURIComponent(request.url));
      urlCache.set(cacheKey, url);
    }

    return new URL(urlCache.get(cacheKey)!.toString());
  };
})();

// Optimized error response creator
const createErrorRedirect = (request: NextRequest, message: string) => {
  return NextResponse.redirect(
    createRedirectURL("/error", message, request),
    {}
  );
};

export async function middleware(request: NextRequest) {
  try {
    const currentPath = request.nextUrl.pathname;

    // Fast path: check authentication
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = createRedirectURL(
        "/login",
        "Please log in to access this page",
        request
      );
      loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(loginUrl, {});
    }

    // Fast path: skip progress check for admin routes
    if (currentPath.startsWith("/admin")) {
      // Verify admin role for admin routes
      if (!token.role || token.role !== "USER") {
        return createErrorRedirect(
          request,
          "You don't have permission to access this page"
        );
      }
      return NextResponse.next({});
    }

    // Only fetch progress status for non-admin routes
    const progressResponse = await fetch(
      new URL("/api/check-progress", request.url),
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store", // Ensure fresh data
      }
    );

    if (!progressResponse.ok) {
      return createErrorRedirect(
        request,
        "Something went wrong. Please try again later."
      );
    }

    const { progressStatus } = await progressResponse.json();

    // O(1) lookup using Map
    const config = PROTECTED_ROUTES.get(progressStatus);

    // Fast path: if no config exists or route isn't protected, continue
    if (!config || !config.routes.has(currentPath)) {
      return NextResponse.next({});
    }

    // Redirect if route is protected
    return NextResponse.redirect(
      createRedirectURL(config.redirectPath, config.message, request),
      {}
    );
  } catch (error) {
    console.error("Middleware error:", error);
    return createErrorRedirect(
      request,
      "An unexpected error occurred. Please try again later."
    );
  }
}

// Optimized matcher configuration using exact paths for better routing performance
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/scholarship-quest",
    "/cv-alignment",
    "/book-session",
    "/dashboard/essays",
  ],
};
