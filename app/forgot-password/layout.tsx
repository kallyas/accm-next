import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - African Centre For Career Mentorship",
  description: "Reset your password for the ACCM platform",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}