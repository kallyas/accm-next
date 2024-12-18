"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { FileCheck2, Loader2 } from "lucide-react";

// Type definitions
interface CVUploadResponse {
  id: string;
  fileName: string;
}

// Constants
const ALLOWED_FILE_TYPES = [".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CVAlignmentPage() {
  // State management with more descriptive states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "analyzing" | "completed"
  >("idle");

  const router = useRouter();

  // File validation function
  const validateFile = (file: File): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidType = ALLOWED_FILE_TYPES.includes(fileExtension);
    const isValidSize = file.size <= MAX_FILE_SIZE;

    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a file with extension: ${ALLOWED_FILE_TYPES.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return false;
    }

    if (!isValidSize) {
      toast({
        title: "File Too Large",
        description: `File must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // File change handler with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  // Combined upload and analyze flow
  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus("uploading");
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload CV
      const uploadResponse = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("CV Upload Failed");
      }

      const uploadData: CVUploadResponse = await uploadResponse.json();

      // Analyze CV
      setUploadStatus("analyzing");
      const analyzeResponse = await fetch("/api/cv/analyze", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId: uploadData.id }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("CV Analysis Failed");
      }

      // Success handling
      setUploadStatus("completed");
      toast({
        title: "CV Processing Complete",
        description: `${selectedFile.name} has been uploaded and analyzed.`,
      });

      // Redirect to CV dashboard
      router.push("/dashboard/cvs");
    } catch (error) {
      console.error(error);
      toast({
        title: "Processing Error",
        description: "Failed to upload or analyze CV. Please try again.",
        variant: "destructive",
      });
      setUploadStatus("idle");
    }
  };

  // Render loading states
  const getButtonContent = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <>
            <Loader2 className="mr-2 animate-spin" /> Uploading
          </>
        );
      case "analyzing":
        return (
          <>
            <FileCheck2 className="mr-2 animate-pulse" /> Analyzing
          </>
        );
      case "completed":
        return (
          <>
            <FileCheck2 className="mr-2" /> Completed
          </>
        );
      default:
        return "Upload and Analyze CV";
    }
  };

  return (
    <div className="container max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>CV Alignment</CardTitle>
          <CardDescription>
            Upload your CV for comprehensive analysis and improvement insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            onChange={handleFileChange}
            accept={ALLOWED_FILE_TYPES.join(",")}
            className="cursor-pointer"
          />
          <Button
            onClick={handleUploadAndAnalyze}
            disabled={!selectedFile || uploadStatus !== "idle"}
            className="w-full"
          >
            {getButtonContent()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
