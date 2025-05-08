import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SessionRequiredBanner } from "@/components/session-required-banner";

export default async function BookSessionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Optionally, you can redirect unauthenticated users
  // if (!session) {
  //   return redirect("/login?callbackUrl=/book-session");
  // }

  return (
    <div className="relative min-h-screen">
      {/* Decorative gradient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Show banner for non-authenticated users */}
      {!session && <SessionRequiredBanner />}
      
      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
