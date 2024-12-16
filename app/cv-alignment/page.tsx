"use client";

import { useState } from "react";
import { CVAlignmentForm } from "@/components/cv-alignment-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CVAlignmentPage() {
  const [userCV, setUserCV] = useState<File | null>(null);
  const [systemCV, setSystemCV] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const handleUserCVUpload = (file: File) => {
    setUserCV(file);
  };

  const handleSystemCVFetch = async () => {
    // In a real application, this would fetch the system CV from your backend
    const response = await fetch("/api/system-cv");
    const data = await response.json();
    setSystemCV(data.cvContent);
  };

  const handleCompare = async () => {
    if (!userCV || !systemCV) return;

    // In a real application, you would send both CVs to your backend for comparison
    const formData = new FormData();
    formData.append("userCV", userCV);
    formData.append("systemCV", systemCV);

    const response = await fetch("/api/compare-cv", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setComparisonResult(result.comparison);
  };

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">CV Alignment Service</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Upload your CV to compare it against our system-provided template and
        receive personalized feedback.
      </p>
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload CV</TabsTrigger>
          <TabsTrigger value="result">Comparison Result</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your CV</CardTitle>
                <CardDescription>Upload your CV for comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <CVAlignmentForm onUpload={handleUserCVUpload} />
                {userCV && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4">Preview Your CV</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Your CV Preview</DialogTitle>
                        <DialogDescription>
                          This is a preview of your uploaded CV
                        </DialogDescription>
                      </DialogHeader>
                      <iframe
                        src={URL.createObjectURL(userCV)}
                        className="w-full h-[600px]"
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>System CV Template</CardTitle>
                <CardDescription>Our recommended CV format</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSystemCVFetch}>Load System CV</Button>
                {systemCV && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4 ml-4">Preview System CV</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>System CV Preview</DialogTitle>
                        <DialogDescription>
                          This is our recommended CV format
                        </DialogDescription>
                      </DialogHeader>
                      <iframe srcDoc={systemCV} className="w-full h-[600px]" />
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>
          <Button
            className="mt-8"
            onClick={handleCompare}
            disabled={!userCV || !systemCV}
          >
            Compare CVs
          </Button>
        </TabsContent>
        <TabsContent value="result">
          <Card>
            <CardHeader>
              <CardTitle>Comparison Result</CardTitle>
              <CardDescription>
                Here's how your CV compares to our system template
              </CardDescription>
            </CardHeader>
            <CardContent>
              {comparisonResult ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: comparisonResult }}
                />
              ) : (
                <p>
                  No comparison result yet. Please upload your CV and run the
                  comparison first.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
