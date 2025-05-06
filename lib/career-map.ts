import { CAREER_SUGGESTIONS } from "@/components/career-map-config";
import { CareerAssessmentAnswers, CareerSuggestion, MatchResult } from "@/types/general";

import _ from "lodash";

interface WeightedScore {
  score: number;
  weight: number;
  description: string;
  category: string;
}

/**
 * Enhanced career matching algorithm with improved accuracy and realistic scoring
 * 
 * @param answers User responses from the career assessment
 * @returns Array of career matches sorted by relevance
 */
export function generateCareerMatches(
  answers: CareerAssessmentAnswers
): MatchResult[] {
  // Retrieve career data from configuration
  const careerData = CAREER_SUGGESTIONS;
  
  // Enhanced text similarity calculation using Jaccard coefficient with term frequency
  function calculateTextSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;
    
    // Normalize and tokenize text
    const normalizeText = (text: string) => {
      return text.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();
    };
    
    const words1 = normalizeText(text1).split(' ');
    const words2 = normalizeText(text2).split(' ');
    
    // Create frequency maps
    const freqMap1 = words1.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const freqMap2 = words2.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate intersection and union with frequency consideration
    const allWords = new Set([...Object.keys(freqMap1), ...Object.keys(freqMap2)]);
    let intersectionSum = 0;
    let unionSum = 0;
    
    allWords.forEach(word => {
      const freq1 = freqMap1[word] || 0;
      const freq2 = freqMap2[word] || 0;
      intersectionSum += Math.min(freq1, freq2);
      unionSum += Math.max(freq1, freq2);
    });
    
    // Return Jaccard similarity coefficient
    return unionSum === 0 ? 0 : intersectionSum / unionSum;
  }

  // Analyze semantic relevance between user aspirations and career descriptions
  function analyzeCareerAlignment(
    text: string,
    careerDescription: string
  ): WeightedScore {
    // Domain-specific keywords mapped to career fields
    const domainKeywords = {
      technical: [
        "software", "engineering", "technology", "data", "technical", "coding", 
        "development", "programming", "algorithm", "system", "computer", "application"
      ],
      creative: [
        "design", "art", "creative", "content", "visual", "artistic", "media", 
        "creativity", "expression", "aesthetic", "imagination", "innovation"
      ],
      business: [
        "business", "management", "strategy", "leadership", "entrepreneurship", 
        "marketing", "finance", "operations", "sales", "market", "client", "customer"
      ],
      healthcare: [
        "health", "medical", "patient", "care", "clinical", "treatment", "therapy", 
        "healing", "wellness", "diagnostic", "healthcare", "medicine"
      ],
      scientific: [
        "research", "science", "analysis", "laboratory", "experiment", "study", 
        "hypothesis", "theory", "investigation", "discovery", "scientific", "academic"
      ],
      legal: [
        "legal", "law", "justice", "rights", "advocacy", "regulation", "compliance", 
        "court", "legislation", "policy", "attorney", "judicial"
      ],
      education: [
        "teach", "education", "learning", "training", "instruction", "knowledge", 
        "curriculum", "student", "academic", "school", "educational", "mentoring"
      ],
      environmental: [
        "environment", "sustainability", "conservation", "climate", "green", "eco",
        "natural", "renewable", "ecological", "sustainable", "nature", "resource"
      ],
      social: [
        "social", "community", "people", "service", "nonprofit", "humanitarian",
        "welfare", "advocacy", "support", "society", "helping", "development"
      ]
    };

    // Calculate domain relevance
    let maxCategoryScore = 0;
    let secondaryCategoryScore = 0;
    let dominantCategory = "";
    let secondaryCategory = "";
    
    // Track category scores for more nuanced analysis
    const categoryScores: Record<string, number> = {};

    Object.entries(domainKeywords).forEach(([category, keywords]) => {
      // Apply TF-IDF inspired approach to keyword relevance
      const categoryScore = keywords.reduce((score, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        const textMatches = (text.match(regex) || []).length;
        const descMatches = (careerDescription.match(regex) || []).length;
        
        // Weight matches by term importance (simplified TF-IDF approach)
        const keywordRelevance = (textMatches * 1.5) + (descMatches * 0.75);
        return score + keywordRelevance;
      }, 0);
      
      categoryScores[category] = categoryScore;
      
      if (categoryScore > maxCategoryScore) {
        secondaryCategoryScore = maxCategoryScore;
        secondaryCategory = dominantCategory;
        maxCategoryScore = categoryScore;
        dominantCategory = category;
      } else if (categoryScore > secondaryCategoryScore) {
        secondaryCategoryScore = categoryScore;
        secondaryCategory = category;
      }
    });

    // Calculate text similarity with additional contextual weighting
    const baseSimilarity = calculateTextSimilarity(text, careerDescription);
    
    // Adjust similarity score based on semantic context
    const domainRelevance = maxCategoryScore > 0 ? 
      (maxCategoryScore + (secondaryCategoryScore * 0.5)) / 
      (Object.keys(domainKeywords).length * 5) : 0;
    
    // Combined semantic score with balance between direct similarity and domain relevance
    const semanticScore = (baseSimilarity * 0.6) + (domainRelevance * 0.4);
    
    // Format the description based on dominant and secondary categories
    let alignmentDescription = "";
    if (dominantCategory) {
      alignmentDescription = `${dominantCategory.charAt(0).toUpperCase() + dominantCategory.slice(1)} orientation`;
      if (secondaryCategory && secondaryCategoryScore > maxCategoryScore * 0.6) {
        alignmentDescription += ` with ${secondaryCategory} aspects`;
      }
    } else {
      alignmentDescription = "General career interests";
    }

    return {
      score: Math.min(semanticScore, 0.95), // Cap at 0.95 for realism
      weight: 0.15,
      description: alignmentDescription,
      category: "Interest Alignment",
    };
  }

  // Enhanced education match that considers level and field relevance
  function calculateEducationMatch(
    userEducation: string,
    careerEducation: string[]
  ): WeightedScore {
    // Improved education level mapping with more granular distinctions
    const educationLevels = {
      "high school": 1,
      "some college": 2,
      "certificate": 2.5,
      "technical certificate": 2.5,
      "associate": 3,
      "associate's": 3,
      "bachelor": 4,
      "bachelor's": 4,
      "undergraduate": 4,
      "master": 5,
      "master's": 5,
      "graduate": 5,
      "doctorate": 6,
      "phd": 6,
      "doctoral": 6,
      "professional degree": 6,
      "md": 6,
      "jd": 6,
      "bootcamp": 2.5,
      "self-taught": 2,
      "certification": 2.5
    };

    // Extract education level and field (if present)
    let userLevel = 0;
    let userField = "";
    
    // Find the highest education level mentioned
    Object.entries(educationLevels).forEach(([levelName, levelValue]) => {
      if (userEducation.toLowerCase().includes(levelName) && levelValue > userLevel) {
        userLevel = levelValue;
      }
    });
    
    // Extract potential field of study from education
    const fieldMatches = userEducation.match(/in\s+([A-Za-z\s&]+)/);
    if (fieldMatches && fieldMatches[1]) {
      userField = fieldMatches[1].trim().toLowerCase();
    }

    // Find required education level and field matches
    const requiredLevel = Math.max(
      ...careerEducation.map(edu => {
        let highestLevel = 0;
        Object.entries(educationLevels).forEach(([levelName, levelValue]) => {
          if (edu.toLowerCase().includes(levelName) && levelValue > highestLevel) {
            highestLevel = levelValue;
          }
        });
        return highestLevel;
      })
    );
    
    // Calculate field relevance if both user field and career education fields exist
    let fieldRelevance = 0;
    if (userField) {
      fieldRelevance = careerEducation.reduce((maxRelevance, edu) => {
        // Extract fields from career education requirements
        const eduFieldMatches = edu.match(/in\s+([A-Za-z\s&]+)/);
        const eduField = eduFieldMatches && eduFieldMatches[1] ? 
          eduFieldMatches[1].trim().toLowerCase() : "";
        
        if (eduField) {
          // Calculate field similarity
          const similarity = calculateTextSimilarity(userField, eduField);
          return Math.max(similarity, maxRelevance);
        }
        return maxRelevance;
      }, 0);
    }

    // Level match calculation with diminishing returns for over-qualification
    let levelMatch = 0;
    if (userLevel >= requiredLevel) {
      // Full credit for meeting requirements, slight penalty for significant over-qualification
      levelMatch = 1 - Math.max(0, (userLevel - requiredLevel - 1) * 0.1);
    } else {
      // Partial credit for being close to requirements
      levelMatch = userLevel / Math.max(requiredLevel, 1);
    }

    // Combine level match and field relevance for final score
    const combinedScore = userField ? 
      (levelMatch * 0.7) + (fieldRelevance * 0.3) : levelMatch;

    // Generate appropriate description
    let description = "";
    if (userLevel >= requiredLevel) {
      if (fieldRelevance > 0.7) {
        description = "Ideal education match (level and field)";
      } else if (fieldRelevance > 0.3) {
        description = "Education level met with related field";
      } else {
        description = "Education level requirements met";
      }
    } else if (userLevel >= requiredLevel * 0.75) {
      description = "Near education requirements";
    } else {
      description = "Partial education match";
    }

    return {
      score: combinedScore,
      weight: 0.2,
      description,
      category: "Education",
    };
  }

  // Enhanced skill matching with semantic relevance
  function calculateSkillsMatch(
    userSkills: string[],
    careerSkills: string[]
  ): WeightedScore {
    if (!userSkills.length || !careerSkills.length) {
      return {
        score: 0,
        weight: 0.25,
        description: "No skill data available",
        category: "Skills",
      };
    }

    // Normalize skills for comparison
    const normalizeSkill = (skill: string) => skill.toLowerCase().trim();
    const normalizedUserSkills = userSkills.map(normalizeSkill);
    const normalizedCareerSkills = careerSkills.map(normalizeSkill);
    
    // Track exact and semantic matches
    let exactMatches = 0;
    let semanticMatches = 0;
    
    // Map to track which career skills have been matched
    const matchedCareerSkills = new Set<string>();
    
    // First pass: Check for exact or near-exact matches
    normalizedUserSkills.forEach(userSkill => {
      for (const careerSkill of normalizedCareerSkills) {
        // Check for exact match or if career skill contains user skill
        if (careerSkill === userSkill || careerSkill.includes(userSkill)) {
          exactMatches++;
          matchedCareerSkills.add(careerSkill);
          break;
        }
      }
    });
    
    // Second pass: Check for semantic matches among remaining skills
    normalizedUserSkills.forEach(userSkill => {
      let bestSimilarity = 0;
      let bestMatch = "";
      
      normalizedCareerSkills.forEach(careerSkill => {
        if (!matchedCareerSkills.has(careerSkill)) {
          const similarity = calculateTextSimilarity(userSkill, careerSkill);
          if (similarity > 0.6 && similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = careerSkill;
          }
        }
      });
      
      if (bestMatch) {
        semanticMatches++;
        matchedCareerSkills.add(bestMatch);
      }
    });
    
    // Calculate total match score
    const totalMatches = exactMatches + (semanticMatches * 0.7);
    const userSkillCoverage = totalMatches / normalizedUserSkills.length;
    const careerSkillCoverage = matchedCareerSkills.size / normalizedCareerSkills.length;
    
    // Balance between user skills covered and career skills matched
    const score = (userSkillCoverage * 0.6) + (careerSkillCoverage * 0.4);
    
    // Generate description based on match quality
    let description = "";
    const totalExactAndPartial = exactMatches + semanticMatches;
    
    if (totalExactAndPartial === 0) {
      description = "No matching skills";
    } else {
      description = `${exactMatches} direct and ${semanticMatches} related skills`;
    }

    return {
      score,
      weight: 0.25,
      description,
      category: "Skills",
    };
  }

  // Process all sectors and careers
  const allMatches: MatchResult[] = [];

  // Track answer completeness for confidence adjustment
  const totalQuestions = Object.keys(answers).length;
  const answeredQuestions = Object.values(answers).filter(Boolean).length;
  const completenessRatio = answeredQuestions / Math.max(totalQuestions, 1);

  Object.entries(careerData).forEach(([sector, careers]) => {
    Object.entries(careers).forEach(([careerId, career]) => {
      const scores: WeightedScore[] = [];
      const matchingFactors: string[] = [];

      // Education match (20% weight)
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

      // Skills match (25% weight)
      if (answers.keyStrengths) {
        const userSkills = answers.keyStrengths.split(",").map(s => s.trim());
        const skillScore = calculateSkillsMatch(userSkills, career.skills);
        scores.push(skillScore);
        if (skillScore.score > 0.5) {
          matchingFactors.push("Strong skill alignment");
        }
      }

      // Work environment preference (10% weight)
      if (answers.workEnvironment) {
        const userEnvironments = answers.workEnvironment.split(",").map(e => e.trim());
        const envMatches = career.workEnvironment.filter(env => 
          userEnvironments.some(userEnv => 
            env.toLowerCase().includes(userEnv.toLowerCase()) ||
            userEnv.toLowerCase().includes(env.toLowerCase())
          )
        );
        
        const envScore = {
          score: envMatches.length > 0 ? envMatches.length / Math.max(userEnvironments.length, 1) : 0,
          weight: 0.1,
          description: envMatches.length > 0 ? "Preferred work environment" : "Different work environment",
          category: "Environment",
        };
        scores.push(envScore);
        if (envScore.score > 0.5) {
          matchingFactors.push("Work environment match");
        }
      }

      // Field/Sector alignment (15% weight)
      if (answers.fieldOfStudy) {
        const userFields = answers.fieldOfStudy.split(",").map(f => f.trim());
        
        // Check direct and semantic field matches
        const fieldMatches = career.sectors.filter(careerSector => 
          userFields.some(userField => 
            careerSector.toLowerCase().includes(userField.toLowerCase()) ||
            userField.toLowerCase().includes(careerSector.toLowerCase()) ||
            calculateTextSimilarity(userField, careerSector) > 0.6
          )
        );
        
        const fieldScore = {
          score: fieldMatches.length > 0 ? fieldMatches.length / Math.max(userFields.length, 1) : 0,
          weight: 0.15,
          description: fieldMatches.length > 0 ? "Field alignment" : "Different field",
          category: "Field",
        };
        scores.push(fieldScore);
        if (fieldScore.score > 0.5) {
          matchingFactors.push("Field of study match");
        }
      }

      // Work style match (10% weight)
      if (answers.workStyle) {
        // Map work style preferences to potential career matches
        const workStyleMapping: Record<string, string[]> = {
          "Independent Problem Solver": ["independent", "autonomous", "self-directed", "problem solving"],
          "Collaborative Team Member": ["collaborative", "team", "cooperation", "group"],
          "Strategic Leader": ["leadership", "management", "strategic", "direction"],
          "Creative Innovator": ["creative", "innovative", "design", "novel"],
          "Analytical Expert": ["analytical", "analysis", "data-driven", "research"],
          "Support and Enable Others": ["support", "service", "helping", "enabling"],
        };
        
        const userStyles = answers.workStyle.split(",").map(s => s.trim());
        
        // Calculate work style match by analyzing career description
        let styleMatchScore = 0;
        let matchedStyleCount = 0;
        
        userStyles.forEach(style => {
          const styleKeywords = workStyleMapping[style] || [];
          if (styleKeywords.length > 0) {
            const keywordMatches = styleKeywords.some(keyword => 
              career.description.toLowerCase().includes(keyword.toLowerCase())
            );
            if (keywordMatches) {
              matchedStyleCount++;
            }
          }
        });
        
        styleMatchScore = matchedStyleCount / Math.max(userStyles.length, 1);
        
        const workStyleScore = {
          score: styleMatchScore,
          weight: 0.1,
          description: styleMatchScore > 0.5 ? "Work style alignment" : "Partial work style match",
          category: "Work Style",
        };
        
        scores.push(workStyleScore);
        if (workStyleScore.score > 0.6) {
          matchingFactors.push("Work style compatibility");
        }
      }

      // Values alignment (10% weight)
      if (answers.values) {
        const userValues = answers.values.split(",").map(v => v.trim());
        
        // Match user values with potential career values
        const valueMatches = userValues.filter(userValue => 
          Object.values(career.matchingFactors.values).some(careerValue => 
            calculateTextSimilarity(userValue, careerValue) > 0.5
          )
        );
        
        const valueMatchScore = valueMatches.length / Math.max(userValues.length, 1);
        
        const valuesScore = {
          score: valueMatchScore,
          weight: 0.1,
          description: valueMatchScore > 0.5 ? "Values alignment" : "Partial values match",
          category: "Values",
        };
        
        scores.push(valuesScore);
        if (valuesScore.score > 0.6) {
          matchingFactors.push("Values compatibility");
        }
      }

      // Career aspirations analysis (15% weight)
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

      // Calculate sector alignment with semantic similarity
      const sectorAlignment = answers.fieldOfStudy ? 
        Math.max(
          ...answers.fieldOfStudy.split(",").map(field => 
            calculateTextSimilarity(field.trim(), sector)
          )
        ) : 0;

      // Calculate final weighted score
      const totalWeight = scores.reduce((sum, score) => sum + score.weight, 0);
      const matchScore = totalWeight > 0 ?
        scores.reduce((sum, score) => sum + score.score * score.weight, 0) / totalWeight : 0;

      // Adjust confidence based on data completeness and career confidence
      // More nuanced confidence calculation
      const responseQuality = completenessRatio * 0.7 + 0.3; // Minimum 0.3 baseline
      
      // Adjust career base confidence for more realistic distribution
      const adjustedCareerConfidence = career.confidence * 0.8 + 0.15; // Range between 0.15 and 0.95
      
      // Calculate final confidence with diminishing returns for very high scores
      const rawConfidence = matchScore * adjustedCareerConfidence * responseQuality;
      const confidence = Math.min(
        // Apply a mild sigmoid-like curve for more realistic distribution
        0.95,
        rawConfidence < 0.5 ? 
          rawConfidence * 0.8 : // Lower scores get reduced further
          0.4 + (rawConfidence - 0.5) * 1.1 // Higher scores get slight boost
      );

      // Create detailed scores array for visualization
      const detailedScores = scores.map(s => ({
        category: s.category,
        score: s.score,
        weight: s.weight,
        description: s.description
      }));

      allMatches.push({
        ...career,
        matchScore,
        matchingFactors,
        confidence,
        sectorAlignment,
        detailedScores,
      });
    });
  });

  // Improved sorting with weighted consideration of match factors
  return _.orderBy(
    allMatches,
    [
      // Enhanced scoring formula with more balanced weighting
      (match) => match.matchScore * 0.65 + match.sectorAlignment * 0.25 + match.confidence * 0.1,
      "confidence",
    ],
    ["desc", "desc"]
  );
}

/**
 * Get top career suggestions with optimized results
 * 
 * @param answers User assessment answers
 * @param limit Maximum number of suggestions to return
 * @returns Limited set of career matches with essential information
 */
export function getTopCareerSuggestions(
  answers: CareerAssessmentAnswers,
  limit: number = 5
): MatchResult[] {
  const matches = generateCareerMatches(answers);
  
  // Process top matches for display
  return matches.slice(0, limit).map((match) => ({
    ...match,
    // Prioritize the most relevant matching factors
    matchingFactors: match.matchingFactors
      .slice(0, 5)
      // Sort by uniqueness and relevance (using length as a proxy for specificity)
      .sort((a, b) => b.length - a.length),
  }));
}

/**
 * Save assessment results to backend
 * 
 * @param userId User identifier
 * @param answers User assessment answers
 * @param suggestions Career suggestions to save
 */
export async function saveAssessmentResults(
  userId: string,
  answers: CareerAssessmentAnswers,
  suggestions: Array<MatchResult>
) {
  try {
    // Add timestamp and session data
    const assessmentData = {
      userId,
      answers,
      suggestions,
      completedAt: new Date().toISOString(),
      metadata: {
        version: "2.0.0", // Track algorithm version
        questionCount: Object.keys(answers).filter(k => answers[k]).length,
        topMatchConfidence: suggestions[0]?.confidence || 0,
      }
    };

    const response = await fetch("/api/career-assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assessmentData),
    });

    if (!response.ok) {
      throw new Error(`Failed to save assessment results: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving assessment results:", error);
    
    // Fallback to local storage if server request fails
    try {
      localStorage.setItem(
        `careerMap_results_${userId}`,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          answers,
          suggestions,
        })
      );
    } catch (localError) {
      console.error("Failed to save locally:", localError);
    }
    
    throw error;
  }
}