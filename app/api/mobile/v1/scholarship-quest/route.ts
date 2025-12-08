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

    // Assessment questions structure matching the web component (scholarship-quest-game.tsx)
    const assessmentQuestions = {
      sections: [
        {
          id: "motivation",
          title: "Motivation",
          icon: "sparkles",
        },
        {
          id: "academic",
          title: "Academic Background",
          icon: "graduation-cap",
        },
        {
          id: "experience",
          title: "Experience",
          icon: "briefcase",
        },
        {
          id: "language",
          title: "Languages",
          icon: "globe",
        },
        {
          id: "planning",
          title: "Planning",
          icon: "clock",
        },
      ],
      questions: [
        // Motivation Section
        {
          field: "motivation",
          label: "Why do you want to pursue a graduate degree?",
          type: "textarea",
          icon: "sparkles",
          helper: "Explain your academic and career motivations for pursuing higher education",
          section: "motivation",
          required: true,
          minLength: 50,
        },
        {
          field: "timing",
          label: "Why is now the right time for graduate studies?",
          type: "textarea",
          icon: "clock",
          helper: "Explain why this point in your career is ideal for further education",
          section: "motivation",
          required: true,
          minLength: 50,
        },
        {
          field: "degree",
          label: "Which degree are you interested in pursuing?",
          type: "radio",
          options: [
            { value: "masters", label: "Master's Degree" },
            { value: "phd", label: "PhD" },
            { value: "both", label: "Both (Master's followed by PhD)" },
          ],
          icon: "award",
          section: "motivation",
          required: true,
        },
        {
          field: "fieldOfStudy",
          label: "What field do you want to study?",
          type: "text",
          icon: "book-open",
          helper: "Specify your intended field/discipline of study",
          section: "motivation",
          required: true,
          minLength: 2,
        },

        // Academic Background Section
        {
          field: "undergradCGPA",
          label: "What was your undergraduate CGPA?",
          type: "text",
          icon: "file-text",
          helper: "Enter your cumulative GPA from your undergraduate degree",
          section: "academic",
          required: true,
          validation: "gpa",
        },
        {
          field: "gpaScale",
          label: "What GPA scale was used at your university?",
          type: "radio",
          options: [
            { value: "4", label: "4.0 Scale" },
            { value: "5", label: "5.0 Scale" },
            { value: "other", label: "Other Scale" },
          ],
          icon: "file-text",
          section: "academic",
          required: true,
        },
        {
          field: "customGpaScale",
          label: "Please specify your GPA scale",
          type: "text",
          icon: "file-text",
          helper: "Enter the maximum value of your GPA scale (e.g., 10)",
          condition: { field: "gpaScale", value: "other" },
          section: "academic",
          required: false,
        },
        {
          field: "undergradCourses",
          label: "What courses did you take in your undergraduate program?",
          type: "textarea",
          icon: "book-open",
          helper: "List major courses you completed in your undergraduate studies",
          section: "academic",
          required: true,
          minLength: 10,
        },
        {
          field: "relevantCourses",
          label: "Which courses are most relevant to your intended field of study?",
          type: "textarea",
          icon: "book-open",
          helper: "Highlight courses that directly relate to your graduate study plans",
          section: "academic",
          required: true,
          minLength: 10,
        },

        // Experience Section
        {
          field: "workExperience",
          label: "How many years of relevant work experience do you have?",
          type: "text",
          icon: "briefcase",
          helper: "Enter the number of years of professional experience related to your field",
          section: "experience",
          required: true,
          validation: "number",
        },
        {
          field: "workExperienceDetails",
          label: "Please describe your relevant work experience",
          type: "textarea",
          icon: "briefcase",
          helper: "Describe positions, responsibilities, and achievements",
          condition: { field: "workExperience", operator: ">", value: "0" },
          section: "experience",
          required: false,
          minLength: 50,
        },
        {
          field: "leadership",
          label: "Have you held leadership positions?",
          type: "radio",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          icon: "users",
          section: "experience",
          required: true,
        },
        {
          field: "leadershipDetails",
          label: "Please describe your leadership experiences and outcomes",
          type: "textarea",
          icon: "users",
          helper: "Detail your responsibilities and accomplishments as a leader",
          condition: { field: "leadership", value: "yes" },
          section: "experience",
          required: false,
          minLength: 50,
        },
        {
          field: "communityService",
          label: "Have you participated in community service or volunteer work?",
          type: "radio",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          icon: "users",
          section: "experience",
          required: true,
        },
        {
          field: "communityServiceDetails",
          label: "Please describe your community service or volunteer work",
          type: "textarea",
          icon: "users",
          helper: "Include organizations, roles, and impact of your service",
          condition: { field: "communityService", value: "yes" },
          section: "experience",
          required: false,
          minLength: 50,
        },
        {
          field: "awards",
          label: "Have you received any academic or professional awards/honors?",
          type: "radio",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          icon: "award",
          section: "experience",
          required: true,
        },
        {
          field: "awardDetails",
          label: "Please list your awards and honors",
          type: "textarea",
          icon: "award",
          helper: "Include the name, date, and significance of each award",
          condition: { field: "awards", value: "yes" },
          section: "experience",
          required: false,
          minLength: 10,
        },
        {
          field: "publications",
          label: "Do you have any publications or presentations?",
          type: "radio",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          icon: "file-text",
          helper: "Include articles, papers, conference presentations, etc.",
          section: "experience",
          required: true,
        },
        {
          field: "publicationDetails",
          label: "Please list your publications and presentations",
          type: "textarea",
          icon: "file-text",
          helper: "Include title, publication venue, date, and your role",
          condition: { field: "publications", value: "yes" },
          section: "experience",
          required: false,
          minLength: 10,
        },

        // Language Section
        {
          field: "languages",
          label: "Which languages do you speak?",
          type: "text",
          icon: "globe",
          helper: "List all languages you speak and your proficiency level in each",
          section: "language",
          required: true,
          minLength: 2,
        },
        {
          field: "englishProficiency",
          label: "What is your level of English proficiency?",
          type: "radio",
          options: [
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
            { value: "native", label: "Native Speaker" },
            { value: "certified", label: "Certified (IELTS/TOEFL/etc.)" },
          ],
          icon: "globe",
          section: "language",
          required: true,
        },
        {
          field: "certificationDetails",
          label: "Please provide details of your English certification",
          type: "text",
          icon: "file-text",
          helper: "Include test name, score, and date (e.g., IELTS 7.5, June 2023)",
          condition: { field: "englishProficiency", value: "certified" },
          section: "language",
          required: false,
          minLength: 2,
        },
        {
          field: "linkedin",
          label: "Do you have a LinkedIn profile?",
          type: "radio",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          icon: "briefcase",
          section: "language",
          required: true,
        },
        {
          field: "linkedinOptimized",
          label: "Is your LinkedIn profile optimized for scholarship applications?",
          type: "radio",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "unsure", label: "Not Sure" },
          ],
          icon: "briefcase",
          condition: { field: "linkedin", value: "yes" },
          helper: "An optimized profile highlights academic achievements, research, and scholarly activities",
          section: "language",
          required: false,
        },

        // Planning Section
        {
          field: "intendedCountries",
          label: "Which countries are you interested in studying in?",
          type: "text",
          icon: "globe",
          helper: "List the countries where you'd like to pursue your graduate studies",
          section: "planning",
          required: true,
          minLength: 2,
        },
        {
          field: "fundingNeeds",
          label: "What level of scholarship funding do you require?",
          type: "radio",
          options: [
            { value: "full", label: "Full Funding (Tuition + Living Expenses)" },
            { value: "partial", label: "Partial Funding (Tuition Only)" },
            { value: "flexible", label: "Flexible (Will Consider Any Funding)" },
          ],
          icon: "award",
          section: "planning",
          required: true,
        },
        {
          field: "studyTimeline",
          label: "When do you plan to begin your graduate studies?",
          type: "radio",
          options: [
            { value: "immediate", label: "As Soon as Possible" },
            { value: "within1year", label: "Within 1 Year" },
            { value: "1to2years", label: "1-2 Years from Now" },
            { value: "2+years", label: "More than 2 Years from Now" },
          ],
          icon: "clock",
          section: "planning",
          required: true,
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
