import { CAREER_SUGGESTIONS } from "@/components/career-map-config";
import { CareerAssessmentAnswers, CareerSuggestion, MatchResult } from "@/types/general";

import _ from "lodash";

interface WeightedScore {
  score: number;
  weight: number;
  description: string;
  category: string;
}

export function generateCareerMatches(
  answers: CareerAssessmentAnswers
  // careerData: Record<string, Record<string, CareerSuggestion>>
): MatchResult[] {
  // read json data from career-map.json and store it in careerData
  const careerData = CAREER_SUGGESTIONS;
  // Helper function to calculate text similarity using Jaccard similarity
  function calculateTextSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  // Enhanced text analysis for career alignment
  function analyzeCareerAlignment(
    text: string,
    careerDescription: string
  ): WeightedScore {
    const keywords = {
      technical: [
        "software",
        "engineering",
        "technology",
        "data",
        "technical",
        "coding",
        "development",
      ],
      creative: ["design", "art", "creative", "content", "visual", "artistic"],
      business: [
        "business",
        "management",
        "strategy",
        "leadership",
        "entrepreneurship",
      ],
      healthcare: [
        "health",
        "medical",
        "patient",
        "care",
        "clinical",
        "treatment",
      ],
      scientific: [
        "research",
        "science",
        "analysis",
        "laboratory",
        "experiment",
      ],
      legal: ["legal", "law", "justice", "rights", "advocacy"],
      education: ["teach", "education", "learning", "training", "instruction"],
    };

    let maxCategoryScore = 0;
    let dominantCategory = "";

    Object.entries(keywords).forEach(([category, words]) => {
      const categoryScore = words.reduce((score, word) => {
        const regex = new RegExp(word, "gi");
        return (
          score +
          ((text.match(regex) || []).length +
            (careerDescription.match(regex) || []).length)
        );
      }, 0);

      if (categoryScore > maxCategoryScore) {
        maxCategoryScore = categoryScore;
        dominantCategory = category;
      }
    });

    const similarityScore = calculateTextSimilarity(text, careerDescription);

    return {
      score: similarityScore,
      weight: 0.15,
      description: `${
        dominantCategory.charAt(0).toUpperCase() + dominantCategory.slice(1)
      } orientation`,
      category: "Interest Alignment",
    };
  }

  // Calculate education match with level consideration
  function calculateEducationMatch(
    userEducation: string,
    careerEducation: string[]
  ): WeightedScore {
    const educationLevels = {
      "high school": 1,
      "some college": 2,
      associate: 3,
      bachelor: 4,
      master: 5,
      doctorate: 6,
      phd: 6,
      "professional degree": 6,
    };

    const userLevel =
      Object.entries(educationLevels).find(([level]) =>
        userEducation.toLowerCase().includes(level)
      )?.[1] || 0;

    const requiredLevel = Math.max(
      ...careerEducation.map(
        (edu) =>
          Object.entries(educationLevels).find(([level]) =>
            edu.toLowerCase().includes(level)
          )?.[1] || 0
      )
    );

    const score =
      userLevel >= requiredLevel ? 1 : userLevel / Math.max(requiredLevel, 1);

    return {
      score,
      weight: 0.2,
      description:
        userLevel >= requiredLevel
          ? "Education requirements met"
          : "Partial education match",
      category: "Education",
    };
  }

  // Process all sectors and careers
  const allMatches: MatchResult[] = [];

  Object.entries(careerData).forEach(([sector, careers]) => {
    Object.entries(careers).forEach(([careerId, career]) => {
      const scores: WeightedScore[] = [];
      const matchingFactors: string[] = [];

      // Education match (20%)
      if (answers.education) {
        const educationScore = calculateEducationMatch(
          answers.education,
          career.education
        );
        scores.push(educationScore);
        if (educationScore.score > 0.7) {
          matchingFactors.push(educationScore.description);
        }
      }

      // Skills match (25%)
      if (answers.keyStrengths) {
        const userSkills = answers.keyStrengths.split(",");
        const matchingSkills = userSkills.filter((skill) =>
          career.skills.some((s) =>
            s.toLowerCase().includes(skill.toLowerCase())
          )
        );
        const skillScore = {
          score: matchingSkills.length / Math.max(userSkills.length, 1),
          weight: 0.25,
          description: `${matchingSkills.length} matching skills`,
          category: "Skills",
        };
        scores.push(skillScore);
        if (skillScore.score > 0.5) {
          matchingFactors.push("Strong skill alignment");
        }
      }

      // Work environment preference (10%)
      if (answers.workEnvironment) {
        const envScore = {
          score: career.workEnvironment.some(
            (env) =>
              env.toLowerCase() === answers.workEnvironment?.toLowerCase()
          )
            ? 1
            : 0,
          weight: 0.1,
          description: "Preferred work environment",
          category: "Environment",
        };
        scores.push(envScore);
        if (envScore.score === 1) {
          matchingFactors.push("Work environment match");
        }
      }

      // Field/Sector alignment (15%)
      if (answers.fieldOfStudy) {
        const fieldScore = {
          score: career.sectors.some((s) =>
            s.toLowerCase().includes(answers.fieldOfStudy?.toLowerCase() || "")
          )
            ? 1
            : 0,
          weight: 0.15,
          description: "Field alignment",
          category: "Field",
        };
        scores.push(fieldScore);
        if (fieldScore.score === 1) {
          matchingFactors.push("Field of study match");
        }
      }

      // Career aspirations analysis (15%)
      if (answers.passion || answers.impact || answers.fiveYearGoal) {
        const aspirationText = [
          answers.passion || "",
          answers.impact || "",
          answers.fiveYearGoal || "",
        ].join(" ");

        const aspirationScore = analyzeCareerAlignment(
          aspirationText,
          career.description
        );
        scores.push(aspirationScore);
        if (aspirationScore.score > 0.6) {
          matchingFactors.push("Strong career aspiration alignment");
        }
      }

      // Calculate sector alignment
      const sectorAlignment = calculateTextSimilarity(
        answers.fieldOfStudy || "",
        sector
      );

      // Calculate final weighted score
      const totalWeight = scores.reduce((sum, score) => sum + score.weight, 0);
      const matchScore =
        scores.reduce((sum, score) => sum + score.score * score.weight, 0) /
        Math.max(totalWeight, 1);

      // Calculate confidence based on data completeness and match strength
      const dataCompleteness =
        Object.values(answers).filter(Boolean).length /
        Object.keys(answers).length;

      const confidence = Math.min(
        matchScore * career.confidence * dataCompleteness,
        0.95
      );

      allMatches.push({
        ...career,
        matchScore,
        matchingFactors,
        confidence,
        sectorAlignment,
        detailedScores: scores,
      });
    });
  });

  // Sort matches by weighted combination of matchScore and sectorAlignment
  return _.orderBy(
    allMatches,
    [
      (match) => match.matchScore * 0.7 + match.sectorAlignment * 0.3,
      "confidence",
    ],
    ["desc", "desc"]
  );
}

export function getTopCareerSuggestions(
  answers: CareerAssessmentAnswers,
  careerData: Record<string, Record<string, CareerSuggestion>>,
  limit: number = 5
): MatchResult[] {
  const matches = generateCareerMatches(answers, careerData);
  return matches.slice(0, limit).map((match) => ({
    ...match,
    matchingFactors: match.matchingFactors.slice(0, 5), // Limit to top 5 matching factors
  }));
}

// Function to save the assessment results
export async function saveAssessmentResults(
  userId: string,
  answers: CareerAssessmentAnswers,
  suggestions: Array<
    CareerSuggestion & { matchingFactors: string[]; confidence: number }
  >
) {
  try {
    const response = await fetch("/api/career-assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        answers,
        suggestions,
        completedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save assessment results");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving assessment results:", error);
    throw error;
  }
}
