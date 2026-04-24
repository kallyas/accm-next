"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  X,
  AlertTriangle,
  ChevronRight,
  Info,
  Sparkles,
  FileCheck2,
} from "lucide-react";

const ALLOWED_FILE_TYPES = [".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE_DISPLAY = "5MB";
const ANALYSIS_STEPS = [
  "Extracting text and formatting",
  "Analyzing structure and layout",
  "Evaluating content relevance",
  "Checking for industry keywords",
  "Generating improvement suggestions",
];

export default function CVAlignmentPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "analyzing" | "completed" | "error"
  >("idle");
  const [activeTab, setActiveTab] = useState("upload");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateFile = (file: File): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidType = ALLOWED_FILE_TYPES.includes(fileExtension);
    const isValidSize = file.size <= MAX_FILE_SIZE;

    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: `Please upload: ${ALLOWED_FILE_TYPES.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    if (!isValidSize) {
      toast({
        title: "File Too Large",
        description: `File must be less than ${MAX_FILE_SIZE_DISPLAY}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 50));
        setUploadProgress(i);
      }

      setUploadStatus("analyzing");
      for (let i = 0; i <= ANALYSIS_STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, 600));
        setAnalysisStep(i);
      }

      setUploadStatus("completed");
      toast({
        title: "CV Processing Complete",
        description: `${selectedFile.name} has been uploaded and analyzed.`,
      });
      setActiveTab("success");
    } catch (error) {
      console.error(error);
      setUploadStatus("error");
      toast({
        title: "Processing Error",
        description: "Failed to upload or analyze CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setAnalysisStep(0);
    setActiveTab("upload");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[88rem]">
        <header className="px-5 py-8 sm:px-7 lg:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center border border-[#1A1B4B] bg-[#1A1B4B]">
              <span className="text-lg font-semibold uppercase text-white">A</span>
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1A1B4B]">
              ACCM
            </span>
          </div>
        </header>

        <main className="px-5 pb-16 sm:px-7 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-10">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
                  <Sparkles className="mr-2 h-3.5 w-3.5 inline" />
                  CV Alignment
                </p>
                <h1 className="mt-4 text-balance text-[clamp(2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.98] text-[#1A1B4B]">
                  Upload your CV
                </h1>
                <p className="mt-4 text-sm leading-7 text-[#1A1B4B]/60">
                  Receive personalized improvement suggestions using our 4WFramework methodology.
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger
                    value="upload"
                    disabled={uploadStatus === "uploading" || uploadStatus === "analyzing"}
                    className="text-xs uppercase tracking-wider"
                  >
                    Upload
                  </TabsTrigger>
                  <TabsTrigger
                    value="info"
                    disabled={uploadStatus === "uploading" || uploadStatus === "analyzing"}
                    className="text-xs uppercase tracking-wider"
                  >
                    Process
                  </TabsTrigger>
                  <TabsTrigger
                    value="success"
                    disabled={uploadStatus !== "completed"}
                    className="text-xs uppercase tracking-wider"
                  >
                    Results
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-0">
                  <Card className="border border-[#1A1B4B]/20 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm uppercase tracking-wider text-[#1A1B4B]">
                        <FileText className="mr-2 h-4 w-4" />
                        Upload your CV
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div
                        className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                          dragActive
                            ? "border-[#1A1B4B] bg-[#ece8df]/50"
                            : selectedFile
                            ? "border-[#1A1B4B] bg-[#ece8df]/30"
                            : "border-[#1A1B4B]/20 hover:border-[#1A1B4B]/40"
                        }`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileInput}
                      >
                        <Input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileChange}
                          accept={ALLOWED_FILE_TYPES.join(",")}
                          className="hidden"
                        />

                        <AnimatePresence mode="wait">
                          {selectedFile ? (
                            <motion.div
                              key="file-selected"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-3"
                            >
                              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#1A1B4B]/20 bg-[#ece8df]">
                                <FileCheck2 className="h-6 w-6 text-[#1A1B4B]" />
                              </div>
                              <p className="text-sm font-medium text-[#1A1B4B]">
                                {selectedFile.name}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFile(null);
                                }}
                                className="text-xs uppercase tracking-wider"
                              >
                                <X className="mr-1 h-3 w-3" /> Remove
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="no-file"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-3"
                            >
                              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#1A1B4B]/20 bg-[#ece8df]">
                                <Upload className="h-6 w-6 text-[#1A1B4B]/50" />
                              </div>
                              <p className="text-sm font-medium text-[#1A1B4B]">
                                Drag and drop or click to browse
                              </p>
                              <div className="flex justify-center gap-2">
                                {["PDF", "DOC", "DOCX"].map((ext) => (
                                  <Badge
                                    key={ext}
                                    variant="outline"
                                    className="text-[0.6rem] uppercase tracking-wider border-[#1A1B4B]/30 text-[#1A1B4B]"
                                  >
                                    {ext}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-[0.65rem] text-[#1A1B4B]/50">
                                Maximum: {MAX_FILE_SIZE_DISPLAY}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {uploadStatus === "uploading" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-[#1A1B4B]">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress
                            value={uploadProgress}
                            className="h-1.5"
                            style={{
                              "--progress-fill": "#1A1B4B",
                            } as React.CSSProperties}
                          />
                        </div>
                      )}

                      {uploadStatus === "analyzing" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-[#1A1B4B]">
                            <span>Analyzing CV...</span>
                            <span>
                              {Math.round((analysisStep / ANALYSIS_STEPS.length) * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={Math.round(
                              (analysisStep / ANALYSIS_STEPS.length) * 100
                            )}
                            className="h-1.5"
                            style={{
                              "--progress-fill": "#26A649",
                            } as React.CSSProperties}
                          />
                          <p className="text-xs text-[#1A1B4B]/50 italic">
                            {ANALYSIS_STEPS[analysisStep] || "Preparing analysis..."}
                          </p>
                        </div>
                      )}

                      {uploadStatus === "error" && (
                        <div className="flex items-start border border-red-500/20 bg-red-50 p-3">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-red-600">
                              Upload Failed
                            </p>
                            <p className="text-xs text-red-500/70">
                              Please try again.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        onClick={handleUploadAndAnalyze}
                        disabled={!selectedFile || uploadStatus !== "idle"}
                        className="h-10 text-[0.72rem] uppercase tracking-wider bg-[#1A1B4B] text-white hover:bg-[#1A1B4B]/90"
                      >
                        {uploadStatus === "uploading" || uploadStatus === "analyzing" ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" /> Upload & Analyze
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={
                          uploadStatus === "uploading" || uploadStatus === "analyzing"
                        }
                        className="h-10 text-[0.72rem] uppercase tracking-wider border-[#1A1B4B]/30 text-[#1A1B4B]"
                      >
                        Reset
                      </Button>

                      <div className="flex-1" />

                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab("info")}
                        className="text-xs uppercase tracking-wider text-[#1A1B4B]/60"
                      >
                        Learn about the process{" "}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="info" className="mt-0">
                  <Card className="border border-[#1A1B4B]/20 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm uppercase tracking-wider text-[#1A1B4B]">
                        <Info className="mr-2 h-4 w-4" />
                        CV Alignment Process
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B]">
                            How it works
                          </h3>
                          <ol className="space-y-4">
                            {ANALYSIS_STEPS.map((step, index) => (
                              <li key={index} className="flex items-center">
                                <div className="flex-shrink-0 h-6 w-6 border border-[#1A1B4B]/20 bg-[#ece8df] text-[0.7rem] font-medium text-[#1A1B4B] flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <span className="text-xs text-[#1A1B4B]/60">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B]">
                            4WFramework Analysis
                          </h3>
                          <p className="text-xs text-[#1A1B4B]/60">
                            Our CV analysis is based on the proprietary 4WFramework which evaluates:
                          </p>
                          <ul className="space-y-3">
                            {[
                              {
                                title: "Industry Alignment",
                                desc: "How well your CV matches industry standards",
                              },
                              {
                                title: "Keyword Optimization",
                                desc: "Analysis of relevant keywords for ATS",
                              },
                              {
                                title: "Content Evaluation",
                                desc: "Assessment of accomplishments and skills",
                              },
                              {
                                title: "Structural Review",
                                desc: "Format and layout analysis",
                              },
                            ].map((item, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 mr-2 text-[#26A649]" />
                                <div className="space-y-0.5">
                                  <span className="text-xs font-medium text-[#1A1B4B]">
                                    {item.title}
                                  </span>
                                  <p className="text-[0.65rem] text-[#1A1B4B]/50">
                                    {item.desc}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Separator />

                      <div className="border border-[#1A1B4B]/10 p-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B] mb-3">
                          What you will receive
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            "Detailed CV Analysis Report",
                            "Industry Recommendations",
                            "ATS Compatibility Score",
                            "Improvement Tips",
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-[#26A649]" />
                              <span className="text-xs text-[#1A1B4B]/70">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="justify-between pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("upload")}
                        className="h-9 text-xs uppercase tracking-wider border-[#1A1B4B]/30 text-[#1A1B4B]"
                      >
                        Back to Upload
                      </Button>

                      {uploadStatus === "completed" && (
                        <Button
                          onClick={() => setActiveTab("success")}
                          className="h-9 text-xs uppercase tracking-wider bg-[#1A1B4B] text-white"
                        >
                          View Results <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="success" className="mt-0">
                  <Card className="border border-[#1A1B4B]/20 bg-white">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-[#26A649]/20 bg-[#26A649]/10">
                        <CheckCircle2 className="h-8 w-8 text-[#26A649]" />
                      </div>
                      <CardTitle className="text-lg uppercase tracking-wider text-[#1A1B4B]">
                        Analysis Complete
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 text-center">
                      <p className="text-sm text-[#1A1B4B]/60">
                        Your CV has been analyzed. View your detailed report for personalized improvement suggestions.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={() => router.push("/dashboard/cvs")}
                          className="h-10 text-[0.72rem] uppercase tracking-wider bg-[#1A1B4B] text-white"
                        >
                          View Analysis Report
                        </Button>

                        <Button
                          variant="outline"
                          onClick={handleReset}
                          className="h-10 text-[0.72rem] uppercase tracking-wider border-[#1A1B4B]/30 text-[#1A1B4B]"
                        >
                          Upload Another CV
                        </Button>
                      </div>

                      <div className="mt-6 border border-[#1A1B4B]/10 p-4 text-left">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B] mb-3">
                          What&apos;s next
                        </h4>
                        <ol className="space-y-2 text-xs">
                          {[
                            "Review your detailed analysis report",
                            "Implement suggested improvements",
                            "Book a session with Abel for guidance",
                          ].map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="flex-shrink-0 h-4 w-4 border border-[#1A1B4B]/20 bg-[#ece8df] text-[0.6rem] font-medium text-[#1A1B4B] flex items-center justify-center mr-2">
                                {i + 1}
                              </span>
                              <span className="text-[#1A1B4B]/70">{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-12 text-center">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1A1B4B]">
                  Why analyze your CV?
                </h2>
                <p className="mt-2 text-xs text-[#1A1B4B]/60 max-w-md mx-auto">
                  A professionally aligned CV increases your chances of getting interviews by up to 60%.
                  Our 4WFramework analysis helps you stand out.
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}