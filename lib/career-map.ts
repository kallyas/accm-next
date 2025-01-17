import { CAREER_SUGGESTIONS } from "@/components/career-map-config";
import { CareerAssessmentAnswers, CareerSuggestion } from "@/types/general";

interface MatchScore {
  careerPath: string;
  score: number;
  matchingFactors: string[];
  confidence: number;
}

export function generateCareerMatches(
  answers: CareerAssessmentAnswers
): MatchScore[] {
  const matches: MatchScore[] = [];

  // Helper function to calculate text similarity
  function calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(" "));
    const words2 = new Set(text2.toLowerCase().split(" "));
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  // Helper function to analyze text sentiment and themes
  function analyzeText(text: string): string[] {
    const themes: string[] = [];
    const lowercaseText = text.toLowerCase();

    // Check for common career-related themes
    const themeKeywords = {
      innovation: ["create", "innovate", "new", "develop", "invent"],
      helping: ["help", "support", "assist", "care", "serve"],
      leadership: ["lead", "manage", "direct", "guide", "organize"],
      technical: ["build", "code", "design", "analyze", "solve"],
      creative: ["design", "create", "artistic", "creative", "imagine"],
      research: ["research", "study", "investigate", "analyze", "discover"],
    };

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      if (keywords.some((keyword) => lowercaseText.includes(keyword))) {
        themes.push(theme);
      }
    });

    return themes;
  }

  // Process each career path
  Object.entries(CAREER_SUGGESTIONS).forEach(([path, career]) => {
    let score = 0;
    const matchingFactors: string[] = [];

    // Education match (20%)
    if (answers.education) {
      const educationMatch = career.education.some((edu) =>
        edu.toLowerCase().includes(answers.education.toLowerCase())
      );
      if (educationMatch) {
        score += 0.2;
        matchingFactors.push("Education alignment");
      }
    }

    // Field match (15%)
    if (answers.fieldOfStudy) {
      const fieldMatch = career.sectors.some((sector) =>
        sector.toLowerCase().includes(answers.fieldOfStudy.toLowerCase())
      );
      if (fieldMatch) {
        score += 0.15;
        matchingFactors.push("Field of study match");
      }
    }

    // Work environment preference (10%)
    if (answers.workEnvironment) {
      const environmentMatch = career.workEnvironment.some(
        (env) => env.toLowerCase() === answers.workEnvironment.toLowerCase()
      );
      if (environmentMatch) {
        score += 0.1;
        matchingFactors.push("Preferred work environment");
      }
    }

    // Skills match (25%)
    if (answers.keyStrengths) {
      const strengthsArray = answers.keyStrengths.split(",");
      const matchingStrengths = strengthsArray.filter((strength) =>
        career.skills.some((skill) =>
          skill.toLowerCase().includes(strength.toLowerCase())
        )
      );
      const strengthScore =
        (matchingStrengths.length / strengthsArray.length) * 0.25;
      score += strengthScore;
      if (matchingStrengths.length > 0) {
        matchingFactors.push("Matching skills");
      }
    }

    // Values alignment (15%)
    if (answers.values) {
      const valuesArray = answers.values.split(",");
      const matchingValues = valuesArray.filter((value) =>
        career.matchingFactors.values.some((v) =>
          v.toLowerCase().includes(value.toLowerCase())
        )
      );
      const valueScore = (matchingValues.length / valuesArray.length) * 0.15;
      score += valueScore;
      if (matchingValues.length > 0) {
        matchingFactors.push("Values alignment");
      }
    }

    // Interests match (15%)
    if (answers.interests) {
      const interestsArray = answers.interests.split(",");
      const matchingInterests = interestsArray.filter((interest) =>
        career.matchingFactors.interests.some((i) =>
          i.toLowerCase().includes(interest.toLowerCase())
        )
      );
      const interestScore =
        (matchingInterests.length / interestsArray.length) * 0.15;
      score += interestScore;
      if (matchingInterests.length > 0) {
        matchingFactors.push("Interest alignment");
      }
    }

    // Passion and Life Goals Analysis (bonus points up to 20%)
    let passionScore = 0;
    if (answers.passion) {
      const passionThemes = analyzeText(answers.passion);
      const careerThemes = analyzeText(career.description);
      const matchingThemes = passionThemes.filter((theme) =>
        careerThemes.includes(theme)
      );
      passionScore =
        (matchingThemes.length / Math.max(passionThemes.length, 1)) * 0.1;
      score += passionScore;
      if (matchingThemes.length > 0) {
        matchingFactors.push("Passion alignment");
      }
    }

    if (answers.impact) {
      const impactThemes = analyzeText(answers.impact);
      const careerThemes = analyzeText(career.description);
      const matchingThemes = impactThemes.filter((theme) =>
        careerThemes.includes(theme)
      );
      const impactScore =
        (matchingThemes.length / Math.max(impactThemes.length, 1)) * 0.1;
      score += impactScore;
      if (matchingThemes.length > 0) {
        matchingFactors.push("Impact goals alignment");
      }
    }

    // Calculate confidence based on completeness of answers and strength of matches
    const confidence = Math.min(
      score * career.confidence,
      0.95 // Cap maximum confidence at 95%
    );

    matches.push({
      careerPath: path,
      score,
      matchingFactors,
      confidence,
    });
  });

  // Sort matches by score in descending order
  return matches.sort((a, b) => b.score - a.score);
}

export function getTopCareerSuggestions(
  answers: CareerAssessmentAnswers,
  limit: number = 3
): Array<CareerSuggestion & { matchingFactors: string[]; confidence: number }> {
  const matches = generateCareerMatches(answers);

  return matches.slice(0, limit).map((match) => ({
    ...CAREER_SUGGESTIONS[match.careerPath],
    matchingFactors: match.matchingFactors,
    confidence: match.confidence,
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
