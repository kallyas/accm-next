"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function EnrollButton({ courseId }: { courseId: string }) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const response = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        throw new Error("Failed to enroll in the course");
      }

      toast({
        title: "Enrolled Successfully",
        description:
          "You have been enrolled in the course. Start learning now!",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in the course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full text-lg py-6">Enroll in Course</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you ready to start learning?</AlertDialogTitle>
          <AlertDialogDescription>
            By enrolling, you'll gain access to all course materials and can
            track your progress. Let's begin your learning journey!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleEnroll} disabled={isEnrolling}>
            {isEnrolling ? "Enrolling..." : "Enroll Now"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
