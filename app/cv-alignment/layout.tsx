import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "CV Alignment - Mentorship Platform",
  description: "Upload and analyze your CV against industry standards",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession();

  return children;
}
