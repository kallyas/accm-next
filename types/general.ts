export type PersonalDiscoveryData = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  achievements: string[];
  threats: string[];
  familyAspirations: string[];
  careerAspirations: string[];
  financialBusinessAspirations: string[];
  socialAspirations: string[];
  desiredPosition: string[];
  requiredSkills: string[];
  coursesAndTrainings: string[];
  strategies: string[];
  shortTermGoals: string[];
};

export interface ExtendedAnalyticsData {
  overview: {
    totalUsers: number;
    totalMentors: number;
    totalScholarships: number;
    totalSubscriptions: number;
    activeUsers: number;
    activeSubscriptions: number;
    activityRate: string;
  };
  users: {
    recent: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      createdAt: string;
      progressStatus: string;
    }>;
    progressDistribution: Array<{
      progressStatus: string;
      _count: number;
    }>;
    growth: Array<{
      month: number;
      year: number;
      _count: number;
    }>;
  };
  engagement: {
    courseEngagement: {
      averageProgress: string;
      totalEnrollments: number;
    };
    personalDiscovery: {
      total: number;
      completionRate: string;
    };
    cvSubmissions: Array<{
      month: number;
      year: number;
      _count: number;
    }>;
  };
  subscriptions: {
    statusDistribution: Array<{
      status: string;
      _count: number;
    }>;
    popularPlans: Array<{
      name: string;
      price: number;
      _count: {
        subscriptions: number;
      };
    }>;
  };
  learning: {
    courseCompletions: Array<{
      title: string;
      averageProgress: string;
      _count: {
        enrollments: number;
      };
    }>;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  about: string;
  imageUrl: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  expertise: string[];
}

export type Question = {
  id: QuestionId;
  question: string;
  options?: string[];
  type: "radio" | "text" | "textarea" | "checkbox" | "multiSelect";
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    maxSelections?: number;
    required?: boolean;
  };
  group:
    | "personal"
    | "career"
    | "education"
    | "preferences"
    | "future"
    | "skills"
    | "interests"
    | "values"
    | "aspirations";
};

// Basic type for question IDs
export type QuestionId =
  | "education"
  | "field"
  | "age"
  | "gender"
  | "employment"
  | "selfEmployment"
  | "sector"
  | "passion"
  | "lifePassion"
  | "lifeGoal"
  | "futureTitle"
  | "futureTasks"
  | "requiredSkills"
  | "requiredCourses"
  | "userName"
  | "email"
  | "location"
  | "keyStrengths"
  | "interests"
  | "values"
  | "impact"
  | "fiveYearGoal"
  | "workEnvironment"
  | "workStyle"
  | "fieldOfStudy";

// Type for assessment answers
export type CareerAssessmentAnswers = {
  [K in QuestionId]: string;
};

// Main career suggestion type
export type CareerSuggestion = {
  title: string;
  confidence: number;
  description: string;
  skills: string[];
  education: string[];
  matchingFactors: {
    interests: string[];
    values: string[];
    strengths: string[];
  };
  salary: {
    entry: number;
    mid: number;
    senior: number;
  };
  growthOutlook: string;
  workEnvironment: string[];
  sectors: string[];
};

// Type for the entire career database structure
export type CareerDatabase = {
  [sector: string]: {
    [careerId: string]: CareerSuggestion;
  };
};

// Types for matching results
export interface WeightedScore {
  score: number;
  weight: number;
  description: string;
  category: string;
}

export interface MatchResult extends CareerSuggestion {
  matchScore: number;
  matchingFactors: {
    interests: string[];
    values: string[];
    strengths: string[];
  };
  confidence: number;
  sectorAlignment: number;
  detailedScores: WeightedScore[];
}

// Types for specific sectors
export type CareerSector =
  | "technology"
  | "healthcare"
  | "business"
  | "creative"
  | "science"
  | "legal"
  | "engineering"
  | "transportation"
  | "political"
  | "aviation";

// Utility type for career paths within a sector
export type CareerPaths = {
  [K in CareerSector]: Record<string, CareerSuggestion>;
};

export interface CareerMapState {
  currentQuestion: number;
  answers: Partial<CareerAssessmentAnswers>;
  isSubmitting: boolean;
  error: string | null;
  result: CareerSuggestion | null;
}
