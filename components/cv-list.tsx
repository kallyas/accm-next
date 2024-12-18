"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Lightbulb, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getR2Url } from "@/lib/cloudflare-r2";
import moment from "moment";

type CV = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  analysisResult: string | null;
};

export function CVList({ initialCvs }: { initialCvs: CV[] }) {
  const [cvs, setCvs] = useState<CV[]>(initialCvs);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);

  const handleDelete = async (cvId: string) => {
    if (confirm("Are you sure you want to delete this CV?")) {
      try {
        const response = await fetch(`/api/cv/${cvId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setCvs(cvs.filter((cv) => cv.id !== cvId));
          toast({
            title: "CV Deleted",
            description: "Your CV has been successfully deleted.",
          });
        } else {
          throw new Error("Failed to delete CV");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete CV. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      {cvs.length === 0 && (
        <div className="h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No CVs uploaded yet.</p>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cvs.map((cv) => {
          const fileName =
            cv.fileName.length > 20
              ? `${cv.fileName.slice(0, 20)}...`
              : cv.fileName;

          const analysisResult = JSON.parse(cv.analysisResult!);
          return (
            <Card key={cv.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{fileName}</CardTitle>
                    <CardDescription>
                      Uploaded on {moment(cv.uploadedAt).format("DD/MM/YYYY")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cv.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="mr-2">
                  <a href={cv.fileUrl} download>
                    Download CV
                  </a>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedCV(cv)}>
                      View Analysis
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>CV Analysis Insights</DialogTitle>
                      <DialogDescription>
                        Comprehensive analysis for {selectedCV?.fileName}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 my-6">
                      {/* Overall Score */}
                      <div className="bg-background border rounded-lg p-6 text-center">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">
                          Overall Score
                        </h3>
                        <div className="flex items-center justify-center">
                          <div
                            className={`
              w-24 h-24 rounded-full flex items-center justify-center 
              ${
                analysisResult.overallScore >= 80
                  ? "bg-green-100 text-green-700"
                  : analysisResult.overallScore >= 50
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              } font-bold text-3xl
            `}
                          >
                            {analysisResult.overallScore}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Issues */}
                        <div className="border rounded-lg p-6">
                          <h3 className="text-base font-medium text-muted-foreground mb-4 flex items-center">
                            <AlertCircle
                              className="mr-2 text-red-500"
                              size={18}
                            />
                            Identified Issues
                          </h3>
                          <div className="overflow-y-auto max-h-[200px] pr-2">
                            {analysisResult.issues.length > 0 ? (
                              <ul className="space-y-3">
                                {analysisResult.issues.map(
                                  (issue: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start text-red-600"
                                    >
                                      <X
                                        className="mr-2 mt-1 shrink-0"
                                        size={16}
                                      />
                                      <span className="text-sm">{issue}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-green-600">
                                No major issues found
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="border rounded-lg p-6">
                          <h3 className="text-base font-medium text-muted-foreground mb-4 flex items-center">
                            <Lightbulb
                              className="mr-2 text-yellow-500"
                              size={18}
                            />
                            Improvement Recommendations
                          </h3>
                          <div className="overflow-y-auto max-h-[200px] pr-2">
                            {analysisResult.recommendations.length > 0 ? (
                              <ul className="space-y-3">
                                {analysisResult.recommendations.map(
                                  (recommendation: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start text-blue-600"
                                    >
                                      <CheckCircle2
                                        className="mr-2 mt-1 shrink-0"
                                        size={16}
                                      />
                                      <span className="text-sm">
                                        {recommendation}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-green-600">
                                Your CV looks great!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          toast({
                            title: "Detailed Report",
                            description:
                              "Detailed CV improvement guide coming soon!",
                          });
                        }}
                      >
                        Get Detailed Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-6">
        <Button asChild variant="secondary">
          <Link href="/cv-alignment">Upload New CV</Link>
        </Button>
      </div>
    </div>
  );
}
