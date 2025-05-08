"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  Loader2,
  Upload,
  FilePlus2,
  FileWarning,
  FileText,
  CheckCircle2,
  X,
  AlertTriangle,
  ChevronRight,
  Eye,
  Info,
} from "lucide-react";

// Type definitions
interface CVUploadResponse {
  id: string;
  fileName: string;
}

// Constants with clearer naming
const ALLOWED_FILE_TYPES = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE_DISPLAY = "5MB";
const ANALYSIS_STEPS = [
  "Extracting text and formatting",
  "Analyzing structure and layout",
  "Evaluating content relevance",
  "Checking for industry keywords",
  "Generating improvement suggestions",
];

export default function CVAlignmentPage() {
  // Enhanced state with more descriptive statuses
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

  // File validation with comprehensive checks
  const validateFile = (file: File): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidType =
      ALLOWED_FILE_TYPES.includes(fileExtension) &&
      ALLOWED_MIME_TYPES.includes(file.type);
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
        description: `File must be less than ${MAX_FILE_SIZE_DISPLAY}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // File drag & drop handlers
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

  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Simulated upload with progress
  const uploadWithProgress = async (file: File): Promise<CVUploadResponse> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.open("POST", "/api/cv/upload");

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during upload"));
      };

      xhr.send(formData);
    });
  };

  // Simulated analysis with steps
  const simulateAnalysis = async (cvId: string): Promise<void> => {
    // Reset analysis step
    setAnalysisStep(0);

    // Simulate analysis steps with delays
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAnalysisStep(i + 1);
    }

    // Actual API call
    const analyzeResponse = await fetch("/api/cv/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvId }),
    });

    if (!analyzeResponse.ok) {
      throw new Error("CV Analysis Failed");
    }

    return analyzeResponse.json();
  };

  // Combined upload and analyze flow
  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    try {
      // Start upload
      setUploadStatus("uploading");
      setUploadProgress(0);

      // Upload with progress tracking
      const uploadData = await uploadWithProgress(selectedFile);

      // Start analysis
      setUploadStatus("analyzing");
      await simulateAnalysis(uploadData.id);

      // Success handling
      setUploadStatus("completed");
      toast({
        title: "CV Processing Complete",
        description: `${selectedFile.name} has been uploaded and analyzed.`,
      });

      // Switch to success tab
      setActiveTab("success");

      // Optional: Automatic redirect after delay
      // setTimeout(() => router.push("/dashboard/cvs"), 3000);
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

  // Reset the form
  const handleReset = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setAnalysisStep(0);
    setActiveTab("upload");
  };

  // Render appropriate content based on the active tab
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 md:text-4xl tracking-tight text-center bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          CV Alignment
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Upload your CV for professional analysis and receive personalized
          improvement suggestions using our 4WFramework methodology.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger
              value="upload"
              disabled={
                uploadStatus === "uploading" || uploadStatus === "analyzing"
              }
            >
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="info"
              disabled={
                uploadStatus === "uploading" || uploadStatus === "analyzing"
              }
            >
              Process
            </TabsTrigger>
            <TabsTrigger
              value="success"
              disabled={uploadStatus !== "completed"}
            >
              Results
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  CV Upload
                </CardTitle>
                <CardDescription>
                  Upload your current CV for professional analysis and
                  improvement suggestions
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Drag and drop area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-300 dark:border-slate-700"
                  } ${selectedFile ? "bg-slate-50 dark:bg-slate-800/50" : ""}`}
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
                        className="space-y-2"
                      >
                        <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <FileCheck2 className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium">File Selected</h3>
                        <p className="text-sm text-muted-foreground break-all max-w-md mx-auto">
                          {selectedFile.name}
                        </p>
                        <div className="flex justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                          >
                            <X className="mr-1 h-4 w-4" /> Remove
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-file"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                      >
                        <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-medium">Upload Your CV</h3>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop your file here or click to browse
                        </p>
                        <div className="flex justify-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            PDF
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            DOC
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            DOCX
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Maximum file size: {MAX_FILE_SIZE_DISPLAY}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Upload progress or status */}
                {uploadStatus === "uploading" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {uploadStatus === "analyzing" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing CV...</span>
                      <span>
                        {Math.round(
                          (analysisStep / ANALYSIS_STEPS.length) * 100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (analysisStep / ANALYSIS_STEPS.length) * 100
                      )}
                      className="h-2"
                    />
                    <p className="text-sm text-muted-foreground italic">
                      {ANALYSIS_STEPS[analysisStep] || "Preparing analysis..."}
                    </p>
                  </div>
                )}

                {uploadStatus === "error" && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-700 dark:text-red-400">
                        Upload Failed
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        There was a problem uploading or analyzing your CV.
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
                  className="w-full sm:w-auto"
                >
                  {uploadStatus === "uploading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Uploading
                    </>
                  ) : uploadStatus === "analyzing" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Analyzing
                    </>
                  ) : uploadStatus === "completed" ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Completed
                    </>
                  ) : uploadStatus === "error" ? (
                    <>
                      <FileWarning className="mr-2 h-4 w-4" /> Try Again
                    </>
                  ) : (
                    <>
                      <FilePlus2 className="mr-2 h-4 w-4" /> Upload & Analyze
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={
                    uploadStatus === "uploading" || uploadStatus === "analyzing"
                  }
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>

                <div className="flex-1"></div>

                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("info")}
                  className="w-full sm:w-auto"
                >
                  Learn about the process{" "}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5 text-blue-500" />
                  CV Alignment Process
                </CardTitle>
                <CardDescription>
                  Learn how our CV analysis and alignment process works
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">How It Works</h3>
                    <ol className="space-y-3">
                      {ANALYSIS_STEPS.map((step, index) => (
                        <li key={index} className="flex">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      4WFramework Analysis
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Our CV analysis is based on the proprietary 4WFramework
                      developed by Abel Wilson Walekhwa, which evaluates:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                        <div className="space-y-1">
                          <span className="font-medium">
                            Industry Alignment
                          </span>
                          <p className="text-xs text-muted-foreground">
                            How well your CV matches industry standards and
                            expectations
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                        <div className="space-y-1">
                          <span className="font-medium">
                            Keyword Optimization
                          </span>
                          <p className="text-xs text-muted-foreground">
                            Analysis of relevant keywords and phrases for ATS
                            compatibility
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                        <div className="space-y-1">
                          <span className="font-medium">
                            Content Evaluation
                          </span>
                          <p className="text-xs text-muted-foreground">
                            Assessment of accomplishments, skills, and
                            experience presentation
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                        <div className="space-y-1">
                          <span className="font-medium">Structural Review</span>
                          <p className="text-xs text-muted-foreground">
                            Format, layout, and organization analysis for
                            optimal readability
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-500" />
                    What You'll Receive
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Detailed CV Analysis Report</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Industry-Specific Recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>ATS Compatibility Score</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Section-by-Section Improvement Tips</span>
                    </li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("upload")}
                >
                  Back to Upload
                </Button>

                {uploadStatus === "completed" && (
                  <Button onClick={() => setActiveTab("success")}>
                    View Results <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Success Tab */}
          <TabsContent value="success" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <CardTitle className="text-center">
                  Analysis Complete!
                </CardTitle>
                <CardDescription className="text-center">
                  Your CV has been successfully analyzed using our 4WFramework
                  methodology
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 text-center">
                <p>
                  We've analyzed your CV and prepared a detailed report with
                  personalized improvement suggestions.
                </p>

                <div className="flex flex-col items-center justify-center gap-4">
                  <Button
                    onClick={() => router.push("/dashboard/cvs")}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                  >
                    View Your CV Analysis Report
                  </Button>

                  <Button variant="outline" onClick={handleReset}>
                    Upload Another CV
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-6 text-left">
                  <h4 className="font-medium mb-2">What's Next?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on your CV analysis, consider these next steps:
                  </p>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2 text-xs font-medium">
                        1
                      </span>
                      <span>Review your detailed analysis report</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2 text-xs font-medium">
                        2
                      </span>
                      <span>Implement the suggested improvements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2 text-xs font-medium">
                        3
                      </span>
                      <span>
                        Book a session with Abel for personalized guidance
                      </span>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Optional: Testimonials or additional information */}
        <div className="mt-10 text-center">
          <h2 className="text-xl font-semibold mb-2">Why Analyze Your CV?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A professionally aligned CV increases your chances of getting
            interviews by up to 60%. Our 4WFramework analysis helps you stand
            out in competitive job markets.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
