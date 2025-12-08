import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  handleApiError,
} from "@/lib/mobile-api-utils";

/**
 * GET /api/mobile/v1/career-map
 *
 * Returns career map assessment landing page data including:
 * - Assessment questions structure from the web component
 * - User's career assessment status
 * - Features and benefits
 * - How it works steps
 * - Success stories/testimonials
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    // TODO: Check if user has completed career assessment in the database
    // For now, we'll return a basic status
    const assessmentStatus = {
      completed: false,
      hasStarted: false,
      completedAt: null,
      canStartAssessment: true,
    };

    // Assessment questions structure matching the web component (career-map-config.ts)
    const assessmentQuestions = {
      sections: [
        {
          id: "initial",
          title: "Personal Background",
          description: "Tell us about your background, interests, and preferences",
          icon: "book-open",
        },
        {
          id: "career",
          title: "Career Aspirations",
          description: "Share your career goals and work style preferences",
          icon: "target",
        },
      ],
      questions: [
        // Initial Questions (Personal Background)
        {
          field: "userName",
          label: "What's your name?",
          type: "text",
          section: "initial",
          required: true,
          minLength: 2,
          maxLength: 50,
          helper: "This helps us personalize your results",
        },
        {
          field: "email",
          label: "What's your email? (Optional - for saving your results)",
          type: "text",
          section: "initial",
          required: false,
          validation: "email",
          helper: "We'll use this to save your results and send career insights",
        },
        {
          field: "age",
          label: "What's your age range?",
          type: "radio",
          options: [
            { value: "under_18", label: "Under 18" },
            { value: "18_24", label: "18-24" },
            { value: "25_34", label: "25-34" },
            { value: "35_44", label: "35-44" },
            { value: "45_54", label: "45-54" },
            { value: "55_plus", label: "55+" },
          ],
          section: "initial",
          required: true,
        },
        {
          field: "gender",
          label: "What's your gender?",
          type: "radio",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "non_binary", label: "Non-binary" },
            { value: "prefer_not_to_say", label: "Prefer not to say" },
            { value: "other", label: "Other" },
          ],
          section: "initial",
          required: false,
        },
        {
          field: "location",
          label: "Which region are you from?",
          type: "radio",
          options: [
            { value: "north_america", label: "North America" },
            { value: "south_america", label: "South America" },
            { value: "europe", label: "Europe" },
            { value: "asia", label: "Asia" },
            { value: "africa", label: "Africa" },
            { value: "oceania", label: "Oceania" },
            { value: "middle_east", label: "Middle East" },
          ],
          section: "initial",
          required: true,
        },

        // Career Questions
        {
          field: "education",
          label: "What's your highest level of education?",
          type: "radio",
          options: [
            { value: "high_school", label: "High School" },
            { value: "some_college", label: "Some College" },
            { value: "associates", label: "Associate's Degree" },
            { value: "bachelors", label: "Bachelor's Degree" },
            { value: "masters", label: "Master's Degree" },
            { value: "doctorate", label: "Doctorate (PhD)" },
            { value: "professional", label: "Professional Degree (MD, JD, etc.)" },
            { value: "technical_cert", label: "Technical Certification" },
            { value: "bootcamp", label: "Bootcamp/Specialized Training" },
            { value: "self_taught", label: "Self-Taught with Portfolio" },
            { value: "other", label: "Other" },
          ],
          section: "career",
          required: true,
        },
        {
          field: "fieldOfStudy",
          label: "What's your field of study or interest? (Select up to 2)",
          type: "multiSelect",
          options: [
            { value: "arts_design", label: "Arts and Design" },
            { value: "business", label: "Business and Management" },
            { value: "computer_science", label: "Computer Science and IT" },
            { value: "data_science", label: "Data Science and Analytics" },
            { value: "engineering", label: "Engineering and Robotics" },
            { value: "environmental", label: "Environmental Science" },
            { value: "healthcare", label: "Healthcare and Medicine" },
            { value: "life_sciences", label: "Life Sciences and Biotechnology" },
            { value: "physical_sciences", label: "Physical Sciences" },
            { value: "mathematics", label: "Mathematics" },
            { value: "social_sciences", label: "Social Sciences" },
            { value: "psychology", label: "Psychology and Behavioral Science" },
            { value: "law", label: "Law and Policy" },
            { value: "education", label: "Education and Training" },
            { value: "media", label: "Media and Communications" },
            { value: "agriculture", label: "Agriculture and Food Science" },
            { value: "space", label: "Space and Aviation" },
            { value: "sustainability", label: "Sustainability and Energy" },
            { value: "other", label: "Other" },
          ],
          section: "career",
          required: true,
          maxSelections: 2,
          helper: "Choose the fields that most closely match your education or interests",
        },
        {
          field: "techComfort",
          label: "How comfortable are you with technology and digital tools?",
          type: "radio",
          options: [
            { value: "very_comfortable", label: "Very Comfortable - I learn new tech quickly and enjoy it" },
            { value: "comfortable", label: "Comfortable - I can adapt to new tech when needed" },
            { value: "moderate", label: "Moderate - I use basic tech but prefer minimal complexity" },
            { value: "basic", label: "Basic - I stick to simple tools and applications" },
            { value: "limited", label: "Limited - I prefer minimal technology use" },
          ],
          section: "career",
          required: true,
          helper: "This helps us match you with careers that align with your tech comfort level",
        },
        {
          field: "workStyle",
          label: "What's your preferred work style? (Select up to 2)",
          type: "multiSelect",
          options: [
            { value: "independent", label: "Independent Problem Solver" },
            { value: "collaborative", label: "Collaborative Team Member" },
            { value: "strategic_leader", label: "Strategic Leader" },
            { value: "creative", label: "Creative Innovator" },
            { value: "analytical", label: "Analytical Expert" },
            { value: "support", label: "Support and Enable Others" },
            { value: "project_manager", label: "Project Manager" },
            { value: "research", label: "Research and Development" },
            { value: "customer_focused", label: "Customer/Client Focused" },
            { value: "technical", label: "Technical Specialist" },
          ],
          section: "career",
          required: true,
          maxSelections: 2,
        },
        {
          field: "workEnvironment",
          label: "What's your ideal work environment? (Select up to 2)",
          type: "multiSelect",
          options: [
            { value: "office", label: "Traditional Office" },
            { value: "remote", label: "Remote Work" },
            { value: "hybrid", label: "Hybrid/Flexible" },
            { value: "laboratory", label: "Laboratory/Research Facility" },
            { value: "outdoor", label: "Outdoor/Field Work" },
            { value: "studio", label: "Creative Studio" },
            { value: "high_tech", label: "High-Tech Facility" },
            { value: "healthcare", label: "Healthcare Setting" },
            { value: "educational", label: "Educational Institution" },
            { value: "industrial", label: "Industrial/Manufacturing" },
            { value: "travel", label: "Travel/Multiple Locations" },
            { value: "startup", label: "Startup Environment" },
          ],
          section: "career",
          required: true,
          maxSelections: 2,
        },
        {
          field: "employment",
          label: "What type of employment interests you most? (Select up to 2)",
          type: "multiSelect",
          options: [
            { value: "corporate", label: "Corporate Employee" },
            { value: "startup", label: "Startup Employee" },
            { value: "entrepreneur", label: "Entrepreneur/Founder" },
            { value: "freelancer", label: "Freelancer/Contractor" },
            { value: "government", label: "Government/Public Sector" },
            { value: "nonprofit", label: "Non-profit/NGO" },
            { value: "academic", label: "Academic/Research" },
            { value: "consulting", label: "Consulting" },
            { value: "small_business", label: "Small Business Owner" },
            { value: "innovation_lab", label: "Innovation Lab" },
          ],
          section: "career",
          required: true,
          maxSelections: 2,
        },
        {
          field: "keyStrengths",
          label: "Select your top 4 strengths:",
          type: "multiSelect",
          options: [
            { value: "analytical", label: "Analytical Thinking" },
            { value: "creative_problem", label: "Creative Problem Solving" },
            { value: "strategic", label: "Strategic Planning" },
            { value: "technical", label: "Technical Expertise" },
            { value: "research", label: "Research and Analysis" },
            { value: "leadership", label: "Leadership and Management" },
            { value: "communication", label: "Communication and Presentation" },
            { value: "project_management", label: "Project Management" },
            { value: "innovation", label: "Innovation and Ideation" },
            { value: "teaching", label: "Teaching and Mentoring" },
            { value: "emotional_intelligence", label: "Emotional Intelligence" },
            { value: "adaptability", label: "Adaptability" },
            { value: "detail_orientation", label: "Detail Orientation" },
            { value: "critical_thinking", label: "Critical Thinking" },
            { value: "cross_cultural", label: "Cross-cultural Awareness" },
            { value: "systems_thinking", label: "Systems Thinking" },
          ],
          section: "career",
          required: true,
          maxSelections: 4,
        },
        {
          field: "interests",
          label: "What topics interest you the most? (Select up to 4)",
          type: "multiSelect",
          options: [
            { value: "ai_ml", label: "Artificial Intelligence/ML" },
            { value: "sustainability", label: "Sustainability/Climate" },
            { value: "healthcare_innovation", label: "Healthcare Innovation" },
            { value: "space", label: "Space Exploration" },
            { value: "biotechnology", label: "Biotechnology" },
            { value: "digital_tech", label: "Digital Technology" },
            { value: "creative_arts", label: "Creative Arts" },
            { value: "business_strategy", label: "Business Strategy" },
            { value: "social_impact", label: "Social Impact" },
            { value: "research", label: "Scientific Research" },
            { value: "education", label: "Education/Learning" },
            { value: "environment", label: "Environmental Protection" },
            { value: "human_behavior", label: "Human Behavior" },
            { value: "data_analytics", label: "Data and Analytics" },
            { value: "engineering", label: "Engineering Systems" },
            { value: "policy", label: "Policy and Governance" },
            { value: "vr_ar", label: "Virtual/Augmented Reality" },
            { value: "robotics", label: "Robotics and Automation" },
            { value: "fintech", label: "Financial Technology" },
            { value: "marine", label: "Ocean/Marine Science" },
          ],
          section: "career",
          required: true,
          maxSelections: 4,
        },
        {
          field: "values",
          label: "What do you value most in a career? (Select up to 4)",
          type: "multiSelect",
          options: [
            { value: "work_life_balance", label: "Work-Life Balance" },
            { value: "high_income", label: "High Income Potential" },
            { value: "job_security", label: "Job Security" },
            { value: "making_difference", label: "Making a Difference" },
            { value: "continuous_learning", label: "Continuous Learning" },
            { value: "career_growth", label: "Career Growth" },
            { value: "innovation", label: "Innovation and Creativity" },
            { value: "social_impact", label: "Social Impact" },
            { value: "recognition", label: "Professional Recognition" },
            { value: "independence", label: "Independence and Autonomy" },
            { value: "environmental", label: "Environmental Impact" },
            { value: "scientific_discovery", label: "Scientific Discovery" },
            { value: "tech_advancement", label: "Technological Advancement" },
            { value: "global_influence", label: "Global Influence" },
            { value: "ethical_practice", label: "Ethical Practice" },
            { value: "cultural_exchange", label: "Cultural Exchange" },
            { value: "leadership_opportunities", label: "Leadership Opportunities" },
            { value: "research_development", label: "Research and Development" },
            { value: "entrepreneurial", label: "Entrepreneurial Freedom" },
            { value: "collaborative", label: "Collaborative Culture" },
          ],
          section: "career",
          required: true,
          maxSelections: 4,
        },
        {
          field: "challengePreference",
          label: "What type of challenges do you enjoy? (Select up to 3)",
          type: "multiSelect",
          options: [
            { value: "complex_problem", label: "Complex Problem Solving" },
            { value: "creative_design", label: "Creative Design Challenges" },
            { value: "technical_puzzles", label: "Technical Puzzles" },
            { value: "research", label: "Research Questions" },
            { value: "leadership", label: "People and Leadership Challenges" },
            { value: "strategic", label: "Strategic Planning" },
            { value: "innovation", label: "Innovation and Invention" },
            { value: "social_cultural", label: "Social/Cultural Challenges" },
            { value: "environmental", label: "Environmental Challenges" },
            { value: "business", label: "Business/Market Challenges" },
            { value: "scientific", label: "Scientific Discovery" },
            { value: "technological", label: "Technological Development" },
          ],
          section: "career",
          required: true,
          maxSelections: 3,
        },
        {
          field: "impact",
          label: "What kind of impact would you like to make in your career?",
          type: "textarea",
          placeholder: "Consider areas like technology advancement, social change, environmental protection, healthcare improvement, scientific discovery, or business innovation...",
          section: "career",
          required: true,
          minLength: 50,
          maxLength: 500,
        },
        {
          field: "futureInterest",
          label: "Which emerging fields interest you? (Select up to 3)",
          type: "multiSelect",
          options: [
            { value: "ai_ethics", label: "Artificial Intelligence Ethics" },
            { value: "space_tech", label: "Space Technology" },
            { value: "climate_tech", label: "Climate Tech" },
            { value: "quantum", label: "Quantum Computing" },
            { value: "biotechnology", label: "Biotechnology" },
            { value: "neurotechnology", label: "Neurotechnology" },
            { value: "robotics", label: "Robotics and Automation" },
            { value: "vr_ar", label: "Virtual/Augmented Reality" },
            { value: "blockchain", label: "Blockchain/Web3" },
            { value: "sustainable_energy", label: "Sustainable Energy" },
            { value: "smart_cities", label: "Smart Cities" },
            { value: "digital_health", label: "Digital Health" },
            { value: "ocean_tech", label: "Ocean Technology" },
            { value: "synthetic_biology", label: "Synthetic Biology" },
          ],
          section: "career",
          required: true,
          maxSelections: 3,
        },
        {
          field: "fiveYearGoal",
          label: "Where do you see yourself in 5 years?",
          type: "textarea",
          placeholder: "Consider your role, impact, skills, and the type of problems you want to solve...",
          section: "career",
          required: true,
          minLength: 50,
          maxLength: 500,
        },
      ],
    };

    // Static content for the career map landing page
    const pageData = {
      hero: {
        title: "Discover Your Ideal Career Path",
        subtitle: "Take our comprehensive assessment to find careers that match your unique skills, interests, and aspirations.",
        ctaText: "Start Assessment",
      },

      stats: [
        {
          value: "10 Minutes",
          label: "Quick assessment",
          icon: "clock",
        },
        {
          value: "30+ Careers",
          label: "Matched to your profile",
          icon: "briefcase",
        },
        {
          value: "Personalized",
          label: "Detailed insights",
          icon: "bar-chart",
        },
      ],

      features: [
        {
          id: "educational-guidance",
          icon: "graduation-cap",
          title: "Educational Guidance",
          description: "Get clear pathways and educational requirements for each career match, helping you make informed decisions about your learning journey.",
        },
        {
          id: "skills-analysis",
          icon: "target",
          title: "Skills Analysis",
          description: "Identify your core competencies and discover which careers leverage your existing strengths while highlighting areas for development.",
        },
        {
          id: "career-insights",
          icon: "lightbulb",
          title: "Career Insights",
          description: "Access up-to-date information on salary ranges, growth outlook, and industry trends for each career recommendation.",
        },
      ],

      howItWorks: [
        {
          step: 1,
          title: "Complete the Assessment",
          description: "Answer questions about your background, skills, interests, and work style preferences.",
        },
        {
          step: 2,
          title: "AI Analysis",
          description: "Our algorithm analyzes your responses to identify suitable career matches.",
        },
        {
          step: 3,
          title: "Get Personalized Results",
          description: "Receive detailed career matches with compatibility scores and insights.",
        },
        {
          step: 4,
          title: "Take Action",
          description: "Use the provided resources and guidance to explore your career options.",
        },
      ],

      testimonials: [
        {
          id: 1,
          name: "Sarah K.",
          title: "Software Engineer",
          initials: "SK",
          message: "The assessment was so detailed! It matched me with roles I had never considered but that aligned perfectly with my skills. I'm now in a job I love.",
        },
        {
          id: 2,
          name: "Alex M.",
          title: "UX Researcher",
          initials: "AM",
          message: "After feeling stuck in my career, CareerMap showed me options that combined my analytical skills with my passion for human behavior. It was eye-opening!",
        },
      ],

      faq: [
        {
          id: 1,
          question: "How long does the assessment take?",
          answer: "The assessment takes approximately 10-15 minutes to complete. You can save your progress and return later.",
        },
        {
          id: 2,
          question: "How accurate are the results?",
          answer: "Our assessment has been validated through research with thousands of users. However, results should be seen as guidance rather than absolute answers. They're designed to expand your awareness of compatible career options.",
        },
        {
          id: 3,
          question: "How is my data protected?",
          answer: "We take data privacy seriously. Your assessment data is encrypted and stored securely. We never sell your personal information to third parties. You can request deletion of your data at any time.",
        },
        {
          id: 4,
          question: "Can I retake the assessment?",
          answer: "Yes, you can retake the assessment as many times as you want. This can be helpful as your interests and priorities evolve over time.",
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
