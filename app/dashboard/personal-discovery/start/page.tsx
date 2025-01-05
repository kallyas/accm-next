"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function StartPersonalDiscoveryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/personal-discovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit personal discovery");
      }

      toast({
        title: "Personal Discovery Submitted",
        description: "Your personal discovery information has been saved.",
      });

      router.push("/dashboard/personal-discovery");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit personal discovery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Start Personal Discovery</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Discovery Questionnaire</CardTitle>
          <CardDescription>
            Fill out the following information to begin your personal discovery
            journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="strengths"
                className="block text-sm font-medium text-gray-700"
              >
                Strengths (comma-separated)
              </label>
              <Input type="text" id="strengths" name="strengths" required />
            </div>
            <div>
              <label
                htmlFor="weaknesses"
                className="block text-sm font-medium text-gray-700"
              >
                Weaknesses (comma-separated)
              </label>
              <Input type="text" id="weaknesses" name="weaknesses" required />
            </div>
            <div>
              <label
                htmlFor="opportunities"
                className="block text-sm font-medium text-gray-700"
              >
                Opportunities (comma-separated)
              </label>
              <Input
                type="text"
                id="opportunities"
                name="opportunities"
                required
              />
            </div>
            <div>
              <label
                htmlFor="threats"
                className="block text-sm font-medium text-gray-700"
              >
                Threats (comma-separated)
              </label>
              <Input type="text" id="threats" name="threats" required />
            </div>
            <div>
              <label
                htmlFor="achievements"
                className="block text-sm font-medium text-gray-700"
              >
                Achievements (comma-separated)
              </label>
              <Input
                type="text"
                id="achievements"
                name="achievements"
                required
              />
            </div>
            <div>
              <label
                htmlFor="familyAspirations"
                className="block text-sm font-medium text-gray-700"
              >
                Family Aspirations
              </label>
              <Textarea
                id="familyAspirations"
                name="familyAspirations"
                required
              />
            </div>
            <div>
              <label
                htmlFor="careerAspirations"
                className="block text-sm font-medium text-gray-700"
              >
                Career Aspirations
              </label>
              <Textarea
                id="careerAspirations"
                name="careerAspirations"
                required
              />
            </div>
            <div>
              <label
                htmlFor="financialBusinessAspirations"
                className="block text-sm font-medium text-gray-700"
              >
                Financial/Business Aspirations
              </label>
              <Textarea
                id="financialBusinessAspirations"
                name="financialBusinessAspirations"
                required
              />
            </div>
            <div>
              <label
                htmlFor="socialAspirations"
                className="block text-sm font-medium text-gray-700"
              >
                Social Aspirations
              </label>
              <Textarea
                id="socialAspirations"
                name="socialAspirations"
                required
              />
            </div>
            <div>
              <label
                htmlFor="desiredPosition"
                className="block text-sm font-medium text-gray-700"
              >
                Desired Position (comma-separated)
              </label>
              <Input
                type="text"
                id="desiredPosition"
                name="desiredPosition"
                required
              />
            </div>
            <div>
              <label
                htmlFor="requiredSkills"
                className="block text-sm font-medium text-gray-700"
              >
                Required Skills (comma-separated)
              </label>
              <Input
                type="text"
                id="requiredSkills"
                name="requiredSkills"
                required
              />
            </div>
            <div>
              <label
                htmlFor="coursesAndTrainings"
                className="block text-sm font-medium text-gray-700"
              >
                Courses and Trainings (comma-separated)
              </label>
              <Input
                type="text"
                id="coursesAndTrainings"
                name="coursesAndTrainings"
                required
              />
            </div>
            <div>
              <label
                htmlFor="strategies"
                className="block text-sm font-medium text-gray-700"
              >
                Strategies (comma-separated)
              </label>
              <Input type="text" id="strategies" name="strategies" required />
            </div>
            <div>
              <label
                htmlFor="shortTermGoals"
                className="block text-sm font-medium text-gray-700"
              >
                Short-term Goals (comma-separated)
              </label>
              <Input
                type="text"
                id="shortTermGoals"
                name="shortTermGoals"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Personal Discovery"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
