"use client";

import { useEffect, useState } from "react";
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
import { YouTubePlayer } from "@/components/video-player";

export default function StartPersonalDiscoveryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isVideoWatched, setIsVideoWatched] = useState(false);

  useEffect(() => {
    setIsVideoWatched(localStorage.getItem("isWatched") === "true");
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("/api/personal-discovery", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit personal discovery");
      }

      toast({
        title: "Personal Discovery Submitted",
        description:
          "Your personal discovery information has been saved and is being analyzed.",
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

  const handleVideoComplete = () => {
    localStorage.setItem("isWatched", "true");
    setIsVideoWatched(true);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Start Personal Discovery</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Watch Introduction Video</CardTitle>
          <CardDescription>
            Please watch this video to learn about the personal discovery
            process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <YouTubePlayer
            videoUrl="https://www.youtube.com/watch?v=an3DR_wv5w8"
            onComplete={handleVideoComplete}
          />
        </CardContent>
      </Card>
      {isVideoWatched && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Discovery Questionnaire</CardTitle>
            <CardDescription>
              Fill out the following information or upload a document to begin
              your personal discovery journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Upload Personal Discovery Document (optional)
                </label>
                <Input
                  type="file"
                  id="file"
                  accept=".doc,.docx,.pdf"
                  onChange={handleFileChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload a Word or PDF document if you have already completed
                  your personal discovery.
                </p>
              </div>
              <div>
                <label
                  htmlFor="strengths"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Strengths (comma-separated)
                </label>
                <Input type="text" id="strengths" name="strengths" required />
              </div>
              <div>
                <label
                  htmlFor="weaknesses"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Weaknesses (comma-separated)
                </label>
                <Input type="text" id="weaknesses" name="weaknesses" required />
              </div>
              <div>
                <label
                  htmlFor="opportunities"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Threats (comma-separated)
                </label>
                <Input type="text" id="threats" name="threats" required />
              </div>
              <div>
                <label
                  htmlFor="achievements"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Strategies (comma-separated)
                </label>
                <Input type="text" id="strategies" name="strategies" required />
              </div>
              <div>
                <label
                  htmlFor="shortTermGoals"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
      )}
    </div>
  );
}
