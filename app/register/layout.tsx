import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Mentorship",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full">{children}</div>
    </div>
  );
}