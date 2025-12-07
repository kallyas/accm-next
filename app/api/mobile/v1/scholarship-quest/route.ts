import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  handleApiError,
} from "@/lib/mobile-api-utils";

/**
 * GET /api/mobile/v1/scholarship-quest
 *
 * Returns scholarship quest landing page data including:
 * - User's scholarship assessment status
 * - Features and benefits
 * - How it works steps
 * - FAQ data
 * - Testimonials
 * - Assessment questions structure
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    // Fetch user's scholarship assessment status
    const scholarshipAssessment = await db.scholarshipAssessment.findUnique({
      where: { userId: authResult.id },
    });

    // Assessment status for the user
    const assessmentStatus = {
      completed: !!scholarshipAssessment,
      hasStarted: !!scholarshipAssessment,
      completedAt: scholarshipAssessment?.createdAt || null,
      canStartAssessment: !scholarshipAssessment, // Can start if not completed
    };

    // Assessment questions structure based on the actual database schema
    const assessmentQuestions = {
      sections: [
        {
          id: "background",
          title: "Background",
          description: "Your education and demographics",
          icon: "user",
        },
        {
          id: "career",
          title: "Career Path",
          description: "Your employment and career preferences",
          icon: "briefcase",
        },
        {
          id: "aspirations",
          title: "Aspirations",
          description: "Your passions and future goals",
          icon: "sparkles",
        },
      ],
      questions: [
        // Background Section
        {
          field: "educationLevel",
          label: "What is your current education level?",
          type: "radio",
          options: [
            { value: "high_school", label: "High School" },
            { value: "certificate", label: "Certificate" },
            { value: "diploma", label: "Diploma" },
            { value: "bachelors", label: "Bachelor's Degree" },
            { value: "masters", label: "Master's Degree" },
            { value: "phd", label: "PhD" },
            { value: "other", label: "Other" },
          ],
          icon: "graduation-cap",
          section: "background",
          required: true,
        },
        {
          field: "fieldPreference",
          label: "What is your field preference?",
          type: "radio",
          options: [
            { value: "arts", label: "Arts & Humanities" },
            { value: "sciences", label: "Sciences & Technology" },
          ],
          icon: "book-open",
          section: "background",
          required: true,
        },
        {
          field: "ageRange",
          label: "What is your age range?",
          type: "radio",
          options: [
            { value: "under_18", label: "Under 18" },
            { value: "18_24", label: "18-24" },
            { value: "25_34", label: "25-34" },
            { value: "35_44", label: "35-44" },
            { value: "45_54", label: "45-54" },
            { value: "55_plus", label: "55+" },
          ],
          icon: "calendar",
          section: "background",
          required: true,
        },
        {
          field: "gender",
          label: "What is your gender?",
          type: "radio",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "non_binary", label: "Non-binary" },
            { value: "prefer_not_to_say", label: "Prefer not to say" },
            { value: "other", label: "Other" },
          ],
          icon: "user",
          section: "background",
          required: true,
        },

        // Career Section
        {
          field: "employmentPreference",
          label: "What is your preferred employment type?",
          type: "radio",
          options: [
            { value: "self_employed", label: "Self-Employed" },
            { value: "government", label: "Government" },
            { value: "private", label: "Private Sector" },
          ],
          icon: "briefcase",
          section: "career",
          required: true,
        },
        {
          field: "selfEmploymentType",
          label: "What type of self-employment are you interested in?",
          type: "radio",
          options: [
            { value: "profit", label: "For-Profit" },
            { value: "non_profit", label: "Non-Profit" },
          ],
          icon: "building",
          condition: { field: "employmentPreference", value: "self_employed" },
          section: "career",
          required: false,
        },
        {
          field: "careerSector",
          label: "What is your preferred career sector?",
          type: "radio",
          options: [
            { value: "academia", label: "Academia & Research" },
            { value: "policy", label: "Policy & Government" },
            { value: "industry", label: "Industry & Business" },
          ],
          icon: "target",
          section: "career",
          required: true,
        },

        // Aspirations Section
        {
          field: "unpaidPassion",
          label: "What do you love doing without financial compensation?",
          type: "textarea",
          icon: "heart",
          helper: "Describe activities or work you would do even without pay",
          section: "aspirations",
          required: true,
          maxLength: 1000,
        },
        {
          field: "personalPassion",
          label: "What are you passionate about?",
          type: "textarea",
          icon: "flame",
          helper: "Share what truly excites and motivates you",
          section: "aspirations",
          required: true,
          maxLength: 1000,
        },
        {
          field: "lifeGoal",
          label: "What problem do you want to solve in the world?",
          type: "textarea",
          icon: "lightbulb",
          helper: "Describe the impact you want to make",
          section: "aspirations",
          required: true,
          maxLength: 1000,
        },
        {
          field: "futureTitle",
          label: "What title do you see yourself having in the future?",
          type: "text",
          icon: "award",
          helper: "E.g., Chief Scientist, Policy Director, Social Entrepreneur",
          section: "aspirations",
          required: true,
          maxLength: 100,
        },
        {
          field: "futureTasks",
          label: "What tasks will you be doing in that role?",
          type: "textarea",
          icon: "list",
          helper: "Describe your day-to-day responsibilities and activities",
          section: "aspirations",
          required: true,
          maxLength: 1000,
        },
        {
          field: "requiredSkills",
          label: "What skills are required for your desired career path?",
          type: "textarea",
          icon: "check-circle",
          helper: "List the key competencies and abilities you need to develop",
          section: "aspirations",
          required: true,
          maxLength: 1000,
        },
        {
          field: "desiredCourses",
          label: "What courses or training do you need?",
          type: "textarea",
          icon: "book",
          helper: "Specify the educational programs or courses you want to pursue",
          section: "aspirations",
          required: true,
          maxLength: 1000,
        },
      ],
    };

    // Static content for the scholarship quest landing page
    const pageData = {
      hero: {
        title: "Scholarship Quest",
        subtitle: "Discover your scholarship opportunities, receive personalized recommendations, and access guidance for successful applications.",
        ctaText: "Start Assessment",
      },

      features: [
        {
          id: "global-scholarships",
          icon: "award",
          title: "Global Scholarships",
          description: "Access top funded programs worldwide",
        },
        {
          id: "academic-resources",
          icon: "book-open",
          title: "Academic Resources",
          description: "Expert guides and application tips",
        },
        {
          id: "personalized-matching",
          icon: "sparkles",
          title: "Personalized Matching",
          description: "Find programs that fit your profile",
        },
        {
          id: "application-support",
          icon: "graduation-cap",
          title: "Application Support",
          description: "Guidance through every step",
        },
      ],

      howItWorks: [
        {
          step: 1,
          title: "Complete Assessment",
          description: "Provide details about your academic background and career goals",
        },
        {
          step: 2,
          title: "Get Matched",
          description: "Receive personalized scholarship recommendations based on your profile",
        },
        {
          step: 3,
          title: "Access Resources",
          description: "Utilize guides and templates to prepare strong applications",
        },
        {
          step: 4,
          title: "Apply Successfully",
          description: "Submit your applications with confidence and track your progress",
        },
      ],

      testimonials: [
        {
          id: 1,
          name: "Ngozi Adichie",
          title: "Fulbright Scholar, Nigeria",
          initials: "NA",
          message: "The assessment helped me identify scholarships I wouldn't have found otherwise. The application resources were invaluable for preparing my materials.",
        },
        {
          id: 2,
          name: "Kwame Mensah",
          title: "Commonwealth Scholar, Ghana",
          initials: "KM",
          message: "From questionnaire to acceptance, the platform guided me through every step. I'm now pursuing my Master's in London with full funding.",
        },
      ],

      faq: [
        {
          id: 1,
          question: "How long does the assessment take?",
          answer: "The assessment takes approximately 15-20 minutes to complete. You can save your progress and return later.",
        },
        {
          id: 2,
          question: "What types of scholarships can I find?",
          answer: "Our platform includes a diverse range of scholarships, including merit-based, need-based, field-specific, and country-specific opportunities.",
        },
        {
          id: 3,
          question: "Is my information kept private?",
          answer: "Yes, your personal information is secure and only used to match you with relevant scholarship opportunities. We never share your details without permission.",
        },
        {
          id: 4,
          question: "Can I get help with my application?",
          answer: "Absolutely! We provide resources, templates, and guides to help you prepare competitive applications. Premium members can also access personalized application reviews.",
        },
      ],
    };

    return successResponse({
      assessmentStatus,
      assessmentQuestions,
      pageData,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
