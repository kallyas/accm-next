import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define redirect messages for each status
const redirectMessages: Record<string, string> = {
  PAYMENT_PENDING: "Please complete your payment to access this feature",
  PERSONAL_DISCOVERY_PENDING: "Complete your personal discovery questionnaire to proceed",
  CV_ALIGNMENT_PENDING: "Please complete your CV alignment before accessing this section",
  SCHOLARSHIP_MATRIX_PENDING: "Complete your scholarship matrix to access the essays section",
};

// Define protected routes and their corresponding redirect paths
const protectedRouteConfig: Record<string, { routes: string[], redirectPath: string }> = {
  PAYMENT_PENDING: {
    routes: ["/dashboard/personal-discovery", "/dashboard/cvs", "/scholarship-quest", "/dashboard/essays"],
    redirectPath: "/dashboard/billing"
  },
  PERSONAL_DISCOVERY_PENDING: {
    routes: ["/dashboard/cvs", "/scholarship-quest", "/dashboard/essays", "/cv-alignment"],
    redirectPath: "/dashboard/status"
  },
  CV_ALIGNMENT_PENDING: {
    routes: ["/scholarship-quest", "/dashboard/essays"],
    redirectPath: "/status"
  },
  SCHOLARSHIP_MATRIX_PENDING: {
    routes: ["/dashboard/essays"],
    redirectPath: "/status"
  }
};

// Helper function to create redirect URL with message
function createRedirectUrl(baseUrl: string, message: string, request: NextRequest): URL {
  const url = new URL(baseUrl, request.url);
  url.searchParams.set("message", encodeURIComponent(message));
  // Optionally preserve the original URL for after completing the required step
  url.searchParams.set("returnTo", encodeURIComponent(request.url));
  return url;
}

export async function middleware(request: NextRequest) {
  // Check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = createRedirectUrl(
      "/login",
      "Please log in to access this page",
      request
    );
    loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Check progress status
  try {
    const progressResponse = await fetch(
      new URL("/api/check-progress", request.url),
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!progressResponse.ok) {
      return NextResponse.redirect(
        createRedirectUrl(
          "/error",
          "Something went wrong. Please try again later.",
          request
        )
      );
    }

    const { progressStatus } = await progressResponse.json();
    console.log("Progress status:", progressStatus);
    const currentPath = request.nextUrl.pathname;
    const config = protectedRouteConfig[progressStatus];

    // Check if current path is protected for the user's progress status
    if (config && config.routes.includes(currentPath)) {
      return NextResponse.redirect(
        createRedirectUrl(
          config.redirectPath,
          redirectMessages[progressStatus],
          request
        )
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(
      createRedirectUrl(
        "/error",
        "An unexpected error occurred. Please try again later.",
        request
      )
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

// Example of how to use in a page component:
/*
// page.tsx
interface PageProps {
  searchParams: {
    message?: string;
    returnTo?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  const message = searchParams.message ? decodeURIComponent(searchParams.message) : null;
  const returnTo = searchParams.returnTo ? decodeURIComponent(searchParams.returnTo) : null;

  return (
    <div>
      {message && (
        <div className="alert alert-info">
          {message}
          {returnTo && (
            <p>Complete this step to return to your previous location.</p>
          )}
        </div>
      )}
      {/* Rest of your page content *//*}
    </div>
  );
}
*/