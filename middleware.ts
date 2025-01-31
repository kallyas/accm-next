import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Cache control constants
const CACHE_CONTROL_PRIVATE = "private, no-cache, no-store, must-revalidate";

// Define route access patterns
const ROUTE_ACCESS = {
  ADMIN: {
    allowedPaths: new Set(["/admin"]),
    redirectPath: "/admin",
    restrictedRedirectMessage: "",
  },
  USER: {
    allowedPaths: new Set([
      "/dashboard",
      "/dashboard/personal-discovery",
      "/dashboard/cvs",
      "/scholarship-quest",
      "/dashboard/essays",
      "/cv-alignment",
      "/book-session",
    ]),
    redirectPath: "/dashboard",
    restrictedRedirectMessage: "",
  },
};

// Protected routes configuration
const PROTECTED_ROUTES = new Map([
  [
    "PAYMENT_PENDING",
    {
      message: "Please complete your payment to access this feature",
      routes: new Set([
        "/dashboard/personal-discovery",
        "/dashboard/cvs",
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
      routes: new Set(["/dashboard/essays"]),
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

// Memoized URL creator
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

// Error response creator
const createErrorRedirect = (request: NextRequest, message: string) => {
  return NextResponse.redirect(createRedirectURL("/error", message, request), {
    headers: {
      "Cache-Control": CACHE_CONTROL_PRIVATE,
    },
  });
};

// Check if path is allowed for role
const isPathAllowedForRole = (
  path: string,
  role: "ADMIN" | "USER"
): boolean => {
  const normalizedPath = path.replace(/\/$/, "");
  const roleConfig = ROUTE_ACCESS[role];

  return Array.from(roleConfig.allowedPaths).some(
    (allowedPath) =>
      normalizedPath === allowedPath ||
      normalizedPath.startsWith(`${allowedPath}/`)
  );
};

export async function middleware(request: NextRequest) {
  try {
    const currentPath = request.nextUrl.pathname;

    // Authentication check
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
      return NextResponse.redirect(loginUrl, {
        headers: {
          "Cache-Control": CACHE_CONTROL_PRIVATE,
        },
      });
    }

    const userRole = token.role as "ADMIN" | "USER";

    // Role-based access control
    if (!isPathAllowedForRole(currentPath, userRole)) {
      const roleConfig = ROUTE_ACCESS[userRole];
      return NextResponse.redirect(
        createRedirectURL(
          roleConfig.redirectPath,
          roleConfig.restrictedRedirectMessage,
          request
        ),
        {
          headers: {
            "Cache-Control": CACHE_CONTROL_PRIVATE,
          },
        }
      );
    }

    // Skip progress check for admin routes
    if (userRole === "ADMIN") {
      return NextResponse.next({
        headers: {
          "Cache-Control": CACHE_CONTROL_PRIVATE,
        },
      });
    }

    // Progress check for user routes
    const progressResponse = await fetch(
      new URL("/api/check-progress", request.url),
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    if (!progressResponse.ok) {
      return createErrorRedirect(
        request,
        "Something went wrong. Please try again later."
      );
    }

    const { progressStatus } = await progressResponse.json();
    const config = PROTECTED_ROUTES.get(progressStatus);

    if (config && config.routes.has(currentPath)) {
      return NextResponse.redirect(
        createRedirectURL(config.redirectPath, config.message, request),
        {
          headers: {
            "Cache-Control": CACHE_CONTROL_PRIVATE,
          },
        }
      );
    }

    return NextResponse.next({
      headers: {
        "Cache-Control": CACHE_CONTROL_PRIVATE,
      },
    });
  } catch (error) {
    console.error("Middleware error:", error);
    return createErrorRedirect(
      request,
      "An unexpected error occurred. Please try again later."
    );
  }
}

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
