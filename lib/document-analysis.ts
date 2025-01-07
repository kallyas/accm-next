import Papa from "papaparse";
import _ from "lodash";
import { parseDocument } from "@/lib/document-parser";

export async function analyzeDocument(
  fileUrl: string,
  extension: string
): Promise<string> {
  try {
    const { content, metadata } = await parseDocument(fileUrl, extension);
    // Perform content analysis
    const analysisResult = await analyzeDocumentContent(content);

    return formatAnalysisResults(analysisResult);
  } catch (error) {
    console.error("Error analyzing document:", error);
    return "Failed to analyze the document. Please review it manually.";
  }
}

interface SectionScore {
  raw: number;
  weighted: number;
  details: {
    completeness: number;
    quality: number;
    specificity: number;
    actionability: number;
    balance: number;
  };
  feedback: string[];
}

interface AnalysisResult {
  sections: {
    strengths: SectionScore;
    weaknesses: SectionScore;
    opportunities: SectionScore;
    threats: SectionScore;
    goals: SectionScore;
    strategies: SectionScore;
  };
  overall: {
    totalScore: number;
    grade: string;
    recommendations: string[];
    skillGaps: string[];
    developmentAreas: string[];
  };
}

// Industry standard weightings for different sections
const SECTION_WEIGHTS = {
  strengths: 0.2,
  weaknesses: 0.15,
  opportunities: 0.15,
  threats: 0.1,
  goals: 0.2,
  strategies: 0.2,
};

// Industry standard scoring criteria
const SCORING_CRITERIA = {
  strengths: {
    minimumItems: 5,
    idealItems: 10,
    categories: [
      "Technical Skills",
      "Soft Skills",
      "Industry Knowledge",
      "Leadership",
      "Education/Certifications",
    ],
    criteria: [
      "Technical Skills",
      "Soft Skills",
      "Industry Knowledge",
      "Leadership",
      "Education/Certifications",
    ],
  },
  weaknesses: {
    minimumItems: 3,
    idealItems: 5,
    categories: ["Personal", "Professional", "Technical", "Behavioral"],
    criteria: [
      "Actionability",
      "Specificity",
      "Growth Potential",
      "Self-Awareness",
    ],
  },
  opportunities: {
    minimumItems: 4,
    idealItems: 8,
    categories: [
      "Market Trends",
      "Professional Growth",
      "Education",
      "Networking",
      "Industry Changes",
    ],
    criteria: ["Relevance", "Feasibility", "Impact", "Timeline"],
  },
  threats: {
    minimumItems: 3,
    idealItems: 6,
    categories: [
      "Market Risks",
      "Competition",
      "Technology Changes",
      "Personal Challenges",
    ],
    criteria: ["Severity", "Likelihood", "Impact", "Mitigation Potential"],
  },
  goals: {
    minimumItems: 5,
    idealItems: 10,
    categories: ["Short-term", "Medium-term", "Long-term"],
    criteria: [
      "Specific",
      "Measurable",
      "Achievable",
      "Relevant",
      "Time-bound",
    ],
  },
  strategies: {
    minimumItems: 5,
    idealItems: 10,
    categories: ["Implementation", "Resources", "Timeline", "Measurement"],
    criteria: [
      "Actionability",
      "Resource Requirements",
      "Timeline",
      "Success Metrics",
    ],
  },
};

// Scoring rubric for quality assessment
const QUALITY_RUBRIC = {
  excellent: {
    range: [90, 100],
    criteria: [
      "Comprehensive coverage",
      "Clear actionability",
      "Strong alignment",
      "Specific details",
      "Measurable outcomes",
    ],
  },
  good: {
    range: [75, 89],
    criteria: [
      "Good coverage",
      "Mostly actionable",
      "Generally aligned",
      "Some specifics",
      "Some measurables",
    ],
  },
  fair: {
    range: [60, 74],
    criteria: [
      "Basic coverage",
      "Limited actionability",
      "Partial alignment",
      "Few specifics",
      "Few measurables",
    ],
  },
  needsWork: {
    range: [0, 59],
    criteria: [
      "Incomplete coverage",
      "Not actionable",
      "Poor alignment",
      "Lacks specifics",
      "No measurables",
    ],
  },
};

function evaluateQualityLevel(score: number): keyof typeof QUALITY_RUBRIC {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "fair";
  return "needsWork";
}

function assessItemQuality(item: string, criteria: string[]): number {
  let score = 0;
  const lowerItem = item.toLowerCase();

  // Base quality indicators (30% of score)
  const qualityIndicators = {
    specificity: /specific|particular|exact|precise/,
    measurability: /measure|quantify|track|number|percent/,
    actionability: /will|shall|must|action|implement|do/,
  };

  Object.values(qualityIndicators).forEach((indicator) => {
    if (indicator.test(lowerItem)) score += 10;
  });

  // Length and detail (20% of score)
  if (item.length > 100) score += 20;
  else if (item.length > 50) score += 10;

  // Criteria alignment (50% of score)
  const matchedCriteria = criteria.filter((criterion) =>
    lowerItem.includes(criterion.toLowerCase())
  );
  score += (matchedCriteria.length / criteria.length) * 50;

  return score;
}

function calculateSectionScore(
  items: string[],
  sectionType: keyof typeof SECTION_WEIGHTS,
  criteria: (typeof SCORING_CRITERIA)[keyof typeof SCORING_CRITERIA]
): SectionScore {
  const score: SectionScore = {
    raw: 0,
    weighted: 0,
    details: {
      completeness: 0,
      quality: 0,
      specificity: 0,
      actionability: 0,
      balance: 0,
    },
    feedback: [],
  };

  // Early return if no items
  if (!items.length) {
    score.feedback.push(`No ${sectionType} found in the document.`);
    return score;
  }

  // Completeness (20% of raw score)
  const completenessScore = Math.min(
    100,
    (items.length / criteria.idealItems) * 100
  );
  score.details.completeness = completenessScore;

  // Quality (30% of raw score)
  const qualityScores = items.map((item) =>
    assessItemQuality(item, criteria.criteria)
  );
  score.details.quality = _.mean(qualityScores) || 0;

  // Specificity (20% of raw score)
  const specificityScores = items.map((item) => {
    if (item.length > 100) return 100;
    if (item.length > 50) return 75;
    return 50;
  });
  score.details.specificity = _.mean(specificityScores) || 0;

  // Actionability (20% of raw score)
  const actionabilityScores = items.map((item) => {
    const hasActionVerbs =
      /implement|develop|create|establish|achieve|complete/.test(
        item.toLowerCase()
      );
    const hasNumbers = /\d+/.test(item);
    const hasTimeline = /by|within|during|after|before/.test(
      item.toLowerCase()
    );

    let actionScore = 0;
    if (hasActionVerbs) actionScore += 40;
    if (hasNumbers) actionScore += 30;
    if (hasTimeline) actionScore += 30;
    return actionScore;
  });
  score.details.actionability = _.mean(actionabilityScores) || 0;

  // Balance (10% of raw score)
  const categoryDistribution = _.countBy(items, (item) => {
    const lowerItem = item.toLowerCase();
    return (
      criteria.categories.find((cat) =>
        lowerItem.includes(cat.toLowerCase())
      ) || "other"
    );
  });

  const categoryBalance =
    (Object.values(categoryDistribution).length / criteria.categories.length) *
    100;
  score.details.balance = Math.min(100, categoryBalance);

  // Calculate weighted component scores
  const componentScores = {
    completeness: score.details.completeness * 0.2,
    quality: score.details.quality * 0.3,
    specificity: score.details.specificity * 0.2,
    actionability: score.details.actionability * 0.2,
    balance: score.details.balance * 0.1,
  };

  // Calculate raw score
  score.raw = _.sum(Object.values(componentScores));

  // Apply section weight
  score.weighted = score.raw * SECTION_WEIGHTS[sectionType];

  // Generate feedback based on QUALITY_RUBRIC
  const qualityLevel = evaluateQualityLevel(score.raw);
  const rubricCriteria = QUALITY_RUBRIC[qualityLevel].criteria;

  if (score.raw < 70) {
    score.feedback.push(
      `${sectionType} needs improvement in: ${rubricCriteria.join(", ")}`
    );
  }

  return score;
}

function assignGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

async function analyzeDocumentContent(
  content: string
): Promise<AnalysisResult> {
  // Extract sections
  const sections = extractDocumentSections(content);

  // Initialize result
  const result: AnalysisResult = {
    sections: {
      strengths: {} as SectionScore,
      weaknesses: {} as SectionScore,
      opportunities: {} as SectionScore,
      threats: {} as SectionScore,
      goals: {} as SectionScore,
      strategies: {} as SectionScore,
    },
    overall: {
      totalScore: 0,
      grade: "",
      recommendations: [],
      skillGaps: [],
      developmentAreas: [],
    },
  };

  // Calculate scores for each section
  Object.entries(sections).forEach(([sectionType, items]) => {
    const sectionKey = sectionType as keyof typeof SCORING_CRITERIA;
    result.sections[sectionKey] = calculateSectionScore(
      items,
      sectionKey,
      SCORING_CRITERIA[sectionKey]
    );
  });

  // Calculate overall score
  const sectionScores = Object.entries(result.sections).map(
    ([_, score]) => score.weighted
  );
  result.overall.totalScore = _.sum(sectionScores);
  result.overall.grade = assignGrade(result.overall.totalScore);

  // Identify skill gaps
  const lowScoringAreas = Object.entries(result.sections)
    .filter(([_, score]) => score.raw < 70)
    .map(([type]) => type);

  result.overall.skillGaps = lowScoringAreas;

  // Generate recommendations
  result.overall.recommendations = [
    ...Object.values(result.sections).flatMap((section) => section.feedback),
    `Focus on improving ${lowScoringAreas.join(
      ", "
    )} to enhance overall assessment`,
    result.overall.totalScore < 80
      ? "Consider seeking professional guidance for personal discovery process"
      : "",
  ].filter(Boolean);

  return result;
}
// Helper function to format the analysis results
export function formatAnalysisResults(results: AnalysisResult): string {
  let output = "# Personal Discovery Analysis Report\n\n";

  output += `## Overall Score: ${results.overall.totalScore.toFixed(
    1
  )} (Grade: ${results.overall.grade})\n\n`;

  // Section scores
  output += "## Section Scores\n\n";
  Object.entries(results.sections).forEach(([section, score]) => {
    output += `### ${section.charAt(0).toUpperCase() + section.slice(1)}\n`;
    output += `- Raw Score: ${score.raw.toFixed(1)}\n`;
    output += `- Weighted Score: ${score.weighted.toFixed(1)}\n`;
    output += "\nDetailed Metrics:\n";
    Object.entries(score.details).forEach(([metric, value]) => {
      output += `- ${metric}: ${value.toFixed(1)}\n`;
    });
    if (score.feedback.length > 0) {
      output += "\nFeedback:\n";
      score.feedback.forEach((feedback) => {
        output += `- ${feedback}\n`;
      });
    }
    output += "\n";
  });

  // Overall recommendations
  if (results.overall.recommendations.length > 0) {
    output += "## Recommendations\n\n";
    results.overall.recommendations.forEach((recommendation) => {
      output += `- ${recommendation}\n`;
    });
  }

  // Skill gaps and development areas
  if (results.overall.skillGaps.length > 0) {
    output += "\n## Areas Needing Improvement\n\n";
    results.overall.skillGaps.forEach((gap) => {
      output += `- ${gap}\n`;
    });
  }

  return output;
}

function extractDocumentSections(content: string) {
  // Define section identifiers with variations
  const sectionIdentifiers = {
    strengths: ["strengths", "strength", "**strengths"],
    weaknesses: ["weaknesses", "weakness", "**weaknesses"],
    opportunities: [
      "opportunities",
      "opportunity",
      "**opportunities",
      "my opportunities",
    ],
    threats: ["threats", "threat", "**threats", "my threats"],
    goals: [
      "goals",
      "goal",
      "where exactly do you want to be",
      "who i want to be",
    ],
    strategies: ["strategies", "strategy", "what strategies"],
  };

  // Initialize sections object
  const sections: Record<string, string[]> = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
    goals: [],
    strategies: [],
  };

  // Split content into lines and remove empty lines
  const lines = content.split("\n").filter((line) => line.trim());

  let currentSection: keyof typeof sections | null = null;
  let isBulletPoint = false;

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();

    // Check if line starts a new section
    let foundSection = false;
    for (const [sectionKey, identifiers] of Object.entries(
      sectionIdentifiers
    )) {
      if (identifiers.some((id) => line.includes(id.toLowerCase()))) {
        currentSection = sectionKey as keyof typeof sections;
        foundSection = true;
        break;
      }
    }

    // If this is a section header, skip to next line
    if (foundSection) continue;

    // Process content if we're in a section
    if (currentSection) {
      // Check if line is a bullet point or numbered item
      const isBulletOrNumber = /^[a-z)\]•\-\d.]/.test(line);

      if (isBulletOrNumber) {
        // Clean up the line by removing bullet points and common prefixes
        const cleanedLine = line
          .replace(/^[a-z)\]•\-\d.]+\s*/, "")
          .replace(/^i\s+/, "")
          .trim();

        if (cleanedLine) {
          sections[currentSection].push(cleanedLine);
        }
      }
    }
  }

  // Log extracted sections for debugging
  console.log("Extracted sections:", {
    strengths: sections.strengths.length,
    weaknesses: sections.weaknesses.length,
    opportunities: sections.opportunities.length,
    threats: sections.threats.length,
    goals: sections.goals.length,
    strategies: sections.strategies.length,
  });

  return sections;
}
