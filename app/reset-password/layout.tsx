import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - African Centre For Career Mentorship",
  description: "Reset your password for the ACCM platform",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}