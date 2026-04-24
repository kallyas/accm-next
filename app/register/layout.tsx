import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - African Centre For Career Mentorship",
  description:
    "Register for ACCM to access mentorship programs, scholarship coaching, and career resources",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}