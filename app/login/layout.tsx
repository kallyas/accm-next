import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - African Centre For Career Mentorship",
  description: "Sign in to your ACCM account to access mentorship programs and resources",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}