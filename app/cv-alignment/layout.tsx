import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CV Alignment - African Centre For Career Mentorship",
  description:
    "Upload your CV for professional analysis using our 4WFramework methodology",
  keywords:
    "CV analysis, resume review, career mentorship, 4WFramework, professional development",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function CVAlignmentLayout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);

  // Optional: Redirect unauthenticated users
  // if (!session) {
  //   return redirect("/login?callbackUrl=/cv-alignment");
  // }

  return (
    <div className="relative min-h-screen">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main content with Toaster for notifications */}
      <div className="relative z-10">
        {children}
        <Toaster />
      </div>
    </div>
  );
}
