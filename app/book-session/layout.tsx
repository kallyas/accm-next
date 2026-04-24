import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Book Session - African Centre For Career Mentorship",
  description: "Book a 1-on-1 mentorship session with Abel Wilson Walekhwa",
};

export default function BookSessionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}