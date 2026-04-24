import { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CV Alignment - African Centre For Career Mentorship",
  description:
    "Upload your CV for professional analysis using our 4WFramework methodology",
};

export default function CVAlignmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}