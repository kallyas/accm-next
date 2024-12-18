import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CVAnalysisResult {
  overallScore: number;
  issues: string[];
  recommendations: string[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPagination(page: number, pageSize: number) {
  const limit = pageSize;
  const from = page ? page * limit : 0;
  const to = page ? from + pageSize - 1 : pageSize - 1;

  return { from, to };
}

export function analyzeCVContent(text: string): CVAnalysisResult {
  // Normalize text by converting to lowercase and removing special characters
  const normalizedText = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  // Define a helper function to check for section presence
  const containsSection = (keywords: string[]): boolean => {
    return keywords.some((keyword) => normalizedText.includes(keyword));
  };

  // Define analysis criteria with dynamic checks
  const criteria = [
    {
      check: () => containsSection(["contact information"]),
      issue: "Missing clear contact information",
      recommendation: "Add a prominent section with full contact details",
      severity: 2, // Medium severity
    },
    {
      check: () => containsSection(["professional summary", "objective"]),
      issue: "No professional summary or objective",
      recommendation:
        "Add a concise professional summary highlighting key strengths",
      severity: 3, // High severity
    },
    {
      check: () => containsSection(["skills", "technical skills", "expertise"]),
      issue: "Lacking clear skills section",
      recommendation:
        "Create a dedicated skills section with relevant technical and soft skills",
      severity: 2, // Medium severity
    },
    {
      check: () =>
        containsSection([
          "experience",
          "work history",
          "professional experience",
        ]),
      issue: "Incomplete work experience details",
      recommendation:
        "Provide detailed work experience with job responsibilities and achievements",
      severity: 3, // High severity
    },
    {
      check: () => containsSection(["education"]),
      issue: "Missing or incomplete education section",
      recommendation:
        "Include full educational background with degrees, institutions, and graduation dates",
      severity: 2, // Medium severity
    },
    {
      check: () =>
        containsSection(["certifications", "certificates", "awards"]),
      issue: "Missing certifications or awards section",
      recommendation:
        "Include any relevant certifications, licenses, or awards received",
      severity: 1, // Low severity
    },
    {
      check: () => containsSection(["languages"]),
      issue: "Lacking a languages section",
      recommendation: "If applicable, include languages you are proficient in",
      severity: 1, // Low severity
    },
    {
      check: () => containsSection(["projects", "portfolio"]),
      issue: "No projects or portfolio section",
      recommendation:
        "Include notable projects or a link to an online portfolio",
      severity: 1, // Low severity
    },
  ];

  // Perform analysis
  const issues: string[] = [];
  const recommendations: string[] = [];
  let totalSeverity = 0;

  criteria.forEach((criterion) => {
    if (!criterion.check()) {
      issues.push(criterion.issue);
      recommendations.push(criterion.recommendation);
      totalSeverity += criterion.severity;
    }
  });

  // Calculate overall score dynamically based on severity
  const baseScore = 100;
  const scoreDeduction = Math.min(totalSeverity * 10, 100); // Ensure deduction doesn't go below 0
  const overallScore = Math.max(0, baseScore - scoreDeduction);

  return {
    overallScore,
    issues,
    recommendations,
  };
}
