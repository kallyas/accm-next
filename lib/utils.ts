import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SectionAnalysis {
  name: string;
  score: number;
  issues: string[];
  recommendations: string[];
  wordCount: number;
}

export interface SkillMatch {
  term: string;
  count: number;
  category: string;
  weight: number;
}

export interface KeywordAnalysis {
  found: SkillMatch[];
  missing: SkillMatch[];
  coverage: Record<string, number>;
}

export interface CVAnalysisResult {
  overallScore: number;
  sections: string[];
  issues: string[];
  recommendations: string[];
  details: {
    sectionAnalysis: SectionAnalysis[];
    keywordAnalysis: {
      found: SkillMatch[];
      missing: SkillMatch[];
      coverage: Record<string, number>;
    };
    actionVerbCount: number;
    contentLength: number;
    wordCount: number;
  };
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

export const INDUSTRY_KEYWORDS = {
  tech: [
    { term: "javascript", weight: 3, category: "programming" },
    { term: "react", weight: 3, category: "frontend_framework" },
    { term: "node.js", weight: 3, category: "backend_runtime" },
    { term: "python", weight: 3, category: "programming" },
    { term: "aws", weight: 3, category: "cloud_platform" },
    { term: "devops", weight: 2, category: "operations_methodology" },
    { term: "agile", weight: 2, category: "project_methodology" },
    { term: "machine learning", weight: 3, category: "data_science" },
    { term: "api", weight: 2, category: "development_interface" },
    { term: "docker", weight: 2, category: "containerization" },
    { term: "java", weight: 3, category: "programming" },
    { term: "c#", weight: 3, category: "programming" },
    { term: "c++", weight: 2, category: "programming" },
    { term: "sql", weight: 3, category: "database_query_language" },
    { term: "nosql", weight: 2, category: "database_type" },
    { term: "mongodb", weight: 2, category: "database_nosql" },
    { term: "kubernetes", weight: 3, category: "orchestration" },
    { term: "terraform", weight: 2, category: "iac_tool" },
    { term: "ci/cd", weight: 3, category: "devops_pipeline" },
    { term: "cybersecurity", weight: 3, category: "security" },
    { term: "azure", weight: 3, category: "cloud_platform" },
    { term: "gcp", weight: 3, category: "cloud_platform" },
    { term: "microservices", weight: 2, category: "architecture" },
    { term: "git", weight: 3, category: "version_control" },
    { term: "jira", weight: 2, category: "project_management_tool" },
    { term: "scrum", weight: 2, category: "project_methodology" },
    { term: "data structures", weight: 2, category: "cs_fundamentals" },
    { term: "algorithms", weight: 2, category: "cs_fundamentals" },
    { term: "ui/ux design", weight: 3, category: "design" },
    { term: "big data", weight: 2, category: "data_engineering" },
    { term: "hadoop", weight: 2, category: "big_data_framework" },
    { term: "spark", weight: 2, category: "big_data_framework" },
    { term: "data visualization", weight: 2, category: "data_analysis" },
    { term: "tableau", weight: 2, category: "bi_tool" },
    { term: "power bi", weight: 2, category: "bi_tool" },
    { term: "sdlc", weight: 2, category: "development_lifecycle" },
    { term: "system design", weight: 3, category: "architecture" },
    { term: "api design", weight: 2, category: "development_interface" },
    { term: "software testing", weight: 2, category: "quality_assurance" },
    { term: "unit testing", weight: 2, category: "testing_type" },
    { term: "integration testing", weight: 2, category: "testing_type" },
    { term: "vue.js", weight: 2, category: "frontend_framework" },
    { term: "angular", weight: 2, category: "frontend_framework" },
    { term: "spring boot", weight: 3, category: "backend_framework" },
    { term: "django", weight: 3, category: "backend_framework" },
    { term: "ruby on rails", weight: 2, category: "backend_framework" },
    { term: "mobile development", weight: 2, category: "software_development" },
    { term: "ios development", weight: 2, category: "mobile_platform" },
    { term: "android development", weight: 2, category: "mobile_platform" },
    { term: "react native", weight: 2, category: "mobile_framework" },
    { term: "flutter", weight: 2, category: "mobile_framework" },
    { term: "blockchain", weight: 2, category: "emerging_tech" },
    { term: "iot", weight: 2, category: "emerging_tech" },
    { term: "saas", weight: 2, category: "business_model" },
    { term: "network engineering", weight: 2, category: "infrastructure" },
    { term: "linux", weight: 2, category: "operating_system" },
    { term: "restful apis", weight: 3, category: "api_design" },
    { term: "graphql", weight: 2, category: "api_design" },
    { term: "typescript", weight: 3, category: "programming" },
    { term: "cloud security", weight: 3, category: "security" },
    { term: "serverless", weight: 2, category: "cloud_architecture" },
    { term: "data engineering", weight: 3, category: "data_science" },
    { term: "etl", weight: 2, category: "data_engineering" },
    { term: "natural language processing (nlp)", weight: 3, category: "ai_ml" },
    { term: "computer vision", weight: 3, category: "ai_ml" },
    { term: "deep learning", weight: 3, category: "ai_ml" },
    { term: "tensorflow", weight: 2, category: "ml_framework" },
    { term: "pytorch", weight: 2, category: "ml_framework" },
    { term: "webassembly (wasm)", weight: 1, category: "web_technology" },
    { term: "ar/vr development", weight: 2, category: "emerging_tech" },
    { term: "game development", weight: 2, category: "software_development" },
    { term: "unity", weight: 2, category: "game_engine" },
    { term: "unreal engine", weight: 2, category: "game_engine" },
  ],
  finance: [
    // Expanded from original
    { term: "financial analysis", weight: 3, category: "analysis" },
    { term: "excel", weight: 3, category: "tool" },
    { term: "accounting", weight: 3, category: "core_skill" },
    { term: "investment banking", weight: 3, category: "specialty" },
    { term: "budgeting", weight: 2, category: "management" },
    { term: "risk assessment", weight: 3, category: "analysis" },
    { term: "forecasting", weight: 3, category: "planning" },
    { term: "portfolio management", weight: 3, category: "specialty" },
    { term: "compliance", weight: 3, category: "regulatory" },
    { term: "audit", weight: 3, category: "oversight" },
    { term: "financial modeling", weight: 3, category: "analysis" },
    { term: "valuation", weight: 3, category: "analysis" },
    { term: "due diligence", weight: 2, category: "process" },
    { term: "mergers & acquisitions (m&a)", weight: 3, category: "corporate_finance" },
    { term: "capital markets", weight: 2, category: "financial_markets" },
    { term: "derivatives", weight: 2, category: "financial_instrument" },
    { term: "fixed income", weight: 2, category: "asset_class" },
    { term: "equities", weight: 2, category: "asset_class" },
    { term: "asset management", weight: 3, category: "investment_management" },
    { term: "wealth management", weight: 2, category: "financial_services" },
    { term: "quantitative analysis", weight: 3, category: "analysis" },
    { term: "bloomberg terminal", weight: 2, category: "tool" },
    { term: "sap fico", weight: 2, category: "erp_system" },
    { term: "oracle financials", weight: 2, category: "erp_system" },
    { term: "taxation", weight: 2, category: "specialty" },
    { term: "gaap", weight: 2, category: "accounting_standard" },
    { term: "ifrs", weight: 2, category: "accounting_standard" },
    { term: "fintech", weight: 2, category: "industry_trend" },
    { term: "algorithmic trading", weight: 2, category: "trading_strategy" },
    { term: "risk management", weight: 3, category: "core_skill" },
    { term: "actuarial science", weight: 2, category: "specialty" },
    { term: "corporate finance", weight: 3, category: "specialty" },
    { term: "financial planning", weight: 2, category: "personal_finance" },
    { term: "treasury management", weight: 2, category: "corporate_finance" },
    { term: "internal controls", weight: 2, category: "governance" },
    { term: "sec reporting", weight: 2, category: "regulatory" },
    { term: "credit analysis", weight: 3, category: "analysis" },
    { term: "private equity", weight: 3, category: "investment" },
    { term: "venture capital", weight: 3, category: "investment" },
    { term: "hedge funds", weight: 2, category: "investment" },
    { term: "reconciliation", weight: 2, category: "accounting_process" },
    { term: "financial reporting", weight: 3, category: "core_skill" },
    { term: "cost accounting", weight: 2, category: "accounting_specialty" },
    { term: "soa (sarbanes-oxley)", weight: 2, category: "compliance" },
    { term: "aml (anti-money laundering)", weight: 2, category: "compliance" },
    { term: "kyc (know your customer)", weight: 2, category: "compliance" },
    { term: "financial crime", weight: 2, category: "compliance" },
    { term: "investment strategy", weight: 3, category: "investment" },
    { term: "market analysis", weight: 3, category: "analysis" },
    { term: "economic forecasting", weight: 2, category: "analysis" },
    { term: "python (for finance)", weight: 2, category: "tool_programming" },
    { term: "r (for finance)", weight: 2, category: "tool_programming" },
    { term: "vba", weight: 1, category: "tool_programming" },
  ],
  marketing: [
    // Expanded from original
    { term: "seo", weight: 3, category: "digital_marketing" },
    { term: "social media marketing", weight: 3, category: "digital_marketing" },
    { term: "content marketing", weight: 3, category: "strategy" },
    { term: "marketing analytics", weight: 3, category: "measurement" },
    { term: "campaign management", weight: 2, category: "execution" },
    { term: "brand management", weight: 3, category: "strategy" },
    { term: "market research", weight: 3, category: "research" },
    { term: "customer acquisition", weight: 3, category: "growth" },
    { term: "conversion rate optimization (cro)", weight: 3, category: "performance" },
    { term: "adobe creative suite", weight: 2, category: "tool" },
    { term: "ppc advertising", weight: 3, category: "digital_marketing" },
    { term: "email marketing", weight: 3, category: "digital_marketing" },
    { term: "crm", weight: 2, category: "tool_strategy" },
    { term: "salesforce marketing cloud", weight: 2, category: "marketing_automation" },
    { term: "hubspot", weight: 2, category: "marketing_automation_crm" },
    { term: "google analytics", weight: 3, category: "analytics_tool" },
    { term: "google ads", weight: 3, category: "ppc_tool" },
    { term: "facebook ads", weight: 2, category: "social_ads_tool" },
    { term: "content creation", weight: 3, category: "skill" },
    { term: "copywriting", weight: 3, category: "skill" },
    { term: "graphic design", weight: 2, category: "skill_tool" },
    { term: "video marketing", weight: 2, category: "digital_marketing" },
    { term: "influencer marketing", weight: 2, category: "digital_marketing" },
    { term: "public relations (pr)", weight: 2, category: "communications" },
    { term: "event marketing", weight: 2, category: "experiential_marketing" },
    { term: "product marketing", weight: 3, category: "strategy" },
    { term: "growth hacking", weight: 2, category: "strategy" },
    { term: "affiliate marketing", weight: 2, category: "digital_marketing" },
    { term: "e-commerce marketing", weight: 3, category: "digital_marketing" },
    { term: "marketing automation", weight: 3, category: "tool_strategy" },
    { term: "ux research", weight: 2, category: "research" },
    { term: "a/b testing", weight: 2, category: "optimization" },
    { term: "kpi tracking", weight: 3, category: "measurement" },
    { term: "digital strategy", weight: 3, category: "strategy" },
    { term: "sem (search engine marketing)", weight: 3, category: "digital_marketing" },
    { term: "b2b marketing", weight: 2, category: "audience_focus" },
    { term: "b2c marketing", weight: 2, category: "audience_focus" },
    { term: "lead generation", weight: 3, category: "sales_marketing" },
    { term: "customer journey mapping", weight: 2, category: "strategy" },
    { term: "persona development", weight: 2, category: "strategy" },
    { term: "storytelling", weight: 2, category: "communication" },
    { term: "competitive analysis", weight: 2, category: "research" },
    { term: "google tag manager", weight: 2, category: "analytics_tool" },
    { term: "linkedin marketing", weight: 2, category: "social_media" },
    { term: "twitter marketing", weight: 2, category: "social_media" },
    { term: "instagram marketing", weight: 2, category: "social_media" },
    { term: "tiktok marketing", weight: 2, category: "social_media" },
    { term: "content strategy", weight: 3, category: "strategy" },
    { term: "cms (wordpress, drupal)", weight: 2, category: "tool" },
    { term: "mobile marketing", weight: 2, category: "digital_marketing" },
    { term: "marketing budget management", weight: 2, category: "management" },
    { term: "omnichannel marketing", weight: 2, category: "strategy" },
  ],
  healthcare: [
    { term: "emr/ehr systems", weight: 3, category: "health_informatics" },
    { term: "hipaa compliance", weight: 3, category: "regulatory" },
    { term: "patient care", weight: 3, category: "clinical_skill" },
    { term: "medical terminology", weight: 3, category: "core_knowledge" },
    { term: "diagnosis", weight: 3, category: "clinical_skill" },
    { term: "treatment planning", weight: 3, category: "clinical_skill" },
    { term: "pharmacology", weight: 2, category: "medical_knowledge" },
    { term: "public health", weight: 2, category: "specialty" },
    { term: "healthcare management", weight: 3, category: "administration" },
    { term: "medical billing and coding", weight: 2, category: "administration" },
    { term: "clinical research", weight: 2, category: "research" },
    { term: "telemedicine", weight: 2, category: "health_technology" },
    { term: "epidemiology", weight: 2, category: "public_health" },
    { term: "medical imaging (x-ray, mri, ct)", weight: 2, category: "diagnostics" },
    { term: "nursing skills", weight: 3, category: "clinical_practice" },
    { term: "patient safety", weight: 3, category: "quality_care" },
    { term: "healthcare policy", weight: 2, category: "regulatory_advocacy" },
    { term: "medical devices", weight: 1, category: "technology" },
    { term: "hl7/fhir standards", weight: 2, category: "health_informatics" },
    { term: "healthcare analytics", weight: 2, category: "data_analysis" },
    { term: "acute care", weight: 2, category: "clinical_setting" },
    { term: "chronic disease management", weight: 2, category: "patient_care" },
    { term: "phlebotomy", weight: 1, category: "clinical_procedure" },
    { term: "infection control", weight: 3, category: "safety_procedure" },
    { term: "mental health", weight: 2, category: "specialty" },
    { term: "geriatrics", weight: 2, category: "specialty" },
    { term: "pediatrics", weight: 2, category: "specialty" },
    { term: "surgical procedures", weight: 2, category: "clinical_specialty" },
    { term: "health education", weight: 2, category: "patient_support" },
    { term: "case management", weight: 2, category: "patient_coordination" },
  ],
  education: [
    { term: "curriculum development", weight: 3, category: "instructional_design" },
    { term: "pedagogy", weight: 3, category: "teaching_methodology" },
    { term: "instructional design", weight: 3, category: "course_creation" },
    { term: "e-learning development", weight: 2, category: "edtech" },
    { term: "learning management system (lms)", weight: 3, category: "edtech_tool" },
    { term: "moodle", weight: 2, category: "lms_platform" },
    { term: "canvas", weight: 2, category: "lms_platform" },
    { term: "blackboard", weight: 2, category: "lms_platform" },
    { term: "assessment design", weight: 3, category: "evaluation" },
    { term: "classroom management", weight: 3, category: "teaching_skill" },
    { term: "student engagement", weight: 3, category: "teaching_skill" },
    { term: "special education (sped)", weight: 2, category: "specialization" },
    { term: "educational technology (edtech)", weight: 3, category: "technology_integration" },
    { term: "adult learning theory", weight: 2, category: "pedagogy" },
    { term: "early childhood education", weight: 2, category: "specialization" },
    { term: "higher education administration", weight: 2, category: "management" },
    { term: "academic advising", weight: 2, category: "student_support" },
    { term: "stem/steam education", weight: 2, category: "subject_focus" },
    { term: "differentiated instruction", weight: 2, category: "teaching_strategy" },
    { term: "inclusive education", weight: 2, category: "teaching_philosophy" },
    { term: "lesson planning", weight: 3, category: "teaching_skill" },
    { term: "educational leadership", weight: 2, category: "administration" },
    { term: "blended learning", weight: 2, category: "instructional_model" },
    { term: "gamification in education", weight: 1, category: "edtech_strategy" },
    { term: "corporate training", weight: 2, category: "adult_education" },
    { term: "instructional coaching", weight: 2, category: "professional_development" },
    { term: "educational research", weight: 2, category: "academic_skill" },
    { term: "student assessment", weight: 3, category: "evaluation" },
    { term: "accreditation", weight: 1, category: "compliance" },
    { term: "online course development", weight: 2, category: "edtech" },
  ],
  manufacturing_engineering: [
    { term: "lean manufacturing", weight: 3, category: "process_improvement" },
    { term: "six sigma", weight: 3, category: "quality_management" },
    { term: "cad (computer-aided design)", weight: 3, category: "design_tool" },
    { term: "solidworks", weight: 2, category: "cad_software" },
    { term: "autocad", weight: 2, category: "cad_software" },
    { term: "cam (computer-aided manufacturing)", weight: 2, category: "production_tool" },
    { term: "plc programming", weight: 2, category: "automation" },
    { term: "robotics", weight: 2, category: "automation" },
    { term: "quality control (qc)", weight: 3, category: "quality_assurance" },
    { term: "quality assurance (qa)", weight: 3, category: "quality_assurance" },
    { term: "supply chain management", weight: 2, category: "operations" },
    { term: "process engineering", weight: 3, category: "optimization" },
    { term: "product development lifecycle (pdlc)", weight: 2, category: "product_creation" },
    { term: "materials science", weight: 2, category: "engineering_discipline" },
    { term: "mechanical engineering", weight: 3, category: "engineering_discipline" },
    { term: "electrical engineering", weight: 3, category: "engineering_discipline" },
    { term: "industrial engineering", weight: 2, category: "engineering_discipline" },
    { term: "prototyping", weight: 2, category: "design_process" },
    { term: "fmea (failure mode and effects analysis)", weight: 2, category: "risk_analysis" },
    { term: "root cause analysis", weight: 2, category: "problem_solving" },
    { term: "automation", weight: 3, category: "technology" },
    { term: "iso 9001", weight: 2, category: "quality_standard" },
    { term: "operations management", weight: 3, category: "management" },
    { term: "gd&t (geometric dimensioning and tolerancing)", weight: 2, category: "engineering_standard" },
    { term: "cnc machining", weight: 2, category: "manufacturing_process" },
    { term: "dfm (design for manufacturability)", weight: 2, category: "design_principle" },
    { term: "erp systems (sap, oracle)", weight: 2, category: "operations_tool" },
    { term: "finite element analysis (fea)", weight: 2, category: "simulation" },
    { term: "project management (engineering)", weight: 3, category: "management" },
    { term: "safety protocols (osha)", weight: 2, category: "compliance" },
  ],
  sales: [
    { term: "lead generation", weight: 3, category: "prospecting" },
    { term: "prospecting", weight: 3, category: "business_development" },
    { term: "crm software (salesforce, hubspot)", weight: 3, category: "tool" },
    { term: "sales funnel management", weight: 3, category: "process" },
    { term: "closing techniques", weight: 3, category: "skill" },
    { term: "negotiation skills", weight: 3, category: "skill" },
    { term: "account management", weight: 3, category: "client_relations" },
    { term: "b2b sales", weight: 3, category: "sales_type" },
    { term: "b2c sales", weight: 3, category: "sales_type" },
    { term: "sales forecasting", weight: 2, category: "planning" },
    { term: "cold calling", weight: 2, category: "prospecting_method" },
    { term: "presentation skills", weight: 3, category: "communication" },
    { term: "relationship building", weight: 3, category: "client_relations" },
    { term: "product knowledge", weight: 3, category: "preparation" },
    { term: "achieving sales targets", weight: 3, category: "performance" },
    { term: "consultative selling", weight: 2, category: "sales_methodology" },
    { term: "solution selling", weight: 2, category: "sales_methodology" },
    { term: "key account development", weight: 2, category: "client_management" },
    { term: "sales pipeline management", weight: 3, category: "process" },
    { term: "channel sales", weight: 2, category: "sales_strategy" },
    { term: "inside sales", weight: 2, category: "sales_type" },
    { term: "outside sales / field sales", weight: 2, category: "sales_type" },
    { term: "sales enablement", weight: 2, category: "support_function" },
    { term: "customer retention", weight: 2, category: "client_relations" },
    { term: "upselling / cross-selling", weight: 2, category: "sales_technique" },
    { term: "sales reporting", weight: 2, category: "analytics" },
    { term: "sales strategy", weight: 3, category: "planning" },
    { term: "objection handling", weight: 3, category: "skill" },
    { term: "sales coaching", weight: 1, category: "leadership" },
    { term: "value proposition", weight: 3, category: "communication" },
  ],
  human_resources: [
    { term: "talent acquisition", weight: 3, category: "recruitment" },
    { term: "recruitment lifecycle", weight: 3, category: "recruitment" },
    { term: "onboarding", weight: 3, category: "employee_lifecycle" },
    { term: "employee relations", weight: 3, category: "employee_management" },
    { term: "performance management", weight: 3, category: "employee_development" },
    { term: "compensation and benefits", weight: 3, category: "rewards" },
    { term: "hris (workday, sap successfactors)", weight: 3, category: "hr_technology" },
    { term: "labor law compliance", weight: 3, category: "legal" },
    { term: "training and development (t&d)", weight: 2, category: "employee_development" },
    { term: "organizational development (od)", weight: 2, category: "strategy" },
    { term: "hr analytics / people analytics", weight: 2, category: "data_analysis" },
    { term: "diversity, equity, and inclusion (dei)", weight: 3, category: "culture" },
    { term: "conflict resolution", weight: 2, category: "employee_relations" },
    { term: "change management", weight: 2, category: "strategy" },
    { term: "talent management", weight: 3, category: "strategy" },
    { term: "employee engagement", weight: 3, category: "culture" },
    { term: "workforce planning", weight: 2, category: "strategy" },
    { term: "succession planning", weight: 2, category: "strategy" },
    { term: "hr policy development", weight: 2, category: "governance" },
    { term: "payroll management", weight: 2, category: "administration" },
    { term: "ats (applicant tracking system)", weight: 3, category: "recruitment_tool" },
    { term: "job evaluation", weight: 2, category: "compensation" },
    { term: "employee handbooks", weight: 2, category: "documentation" },
    { term: "benefits administration", weight: 2, category: "compensation_benefits" },
    { term: "hr business partner (hrbp)", weight: 3, category: "role_focus" },
    { term: "employer branding", weight: 2, category: "recruitment_strategy" },
    { term: "performance appraisal", weight: 3, category: "performance_management" },
    { term: "grievance handling", weight: 2, category: "employee_relations" },
    { term: "hr metrics", weight: 2, category: "analytics" },
    { term: "background checks", weight: 1, category: "recruitment_process" },
  ],
  legal: [
    { term: "litigation", weight: 3, category: "practice_area" },
    { term: "corporate law", weight: 3, category: "practice_area" },
    { term: "contract law", weight: 3, category: "practice_area" },
    { term: "legal research (lexisnexis, westlaw)", weight: 3, category: "skill_tool" },
    { term: "legal writing and drafting", weight: 3, category: "skill" },
    { term: "due diligence (legal)", weight: 2, category: "process" },
    { term: "regulatory compliance", weight: 3, category: "practice_area" },
    { term: "intellectual property (ip) law", weight: 2, category: "practice_area" },
    { term: "real estate law", weight: 2, category: "practice_area" },
    { term: "criminal law", weight: 2, category: "practice_area" },
    { term: "civil procedure", weight: 2, category: "legal_knowledge" },
    { term: "evidence", weight: 2, category: "legal_knowledge" },
    { term: "negotiation", weight: 3, category: "skill" },
    { term: "case management software", weight: 2, category: "tool" },
    { term: "paralegal support", weight: 2, category: "skill_role" },
    { term: "e-discovery", weight: 2, category: "litigation_support" },
    { term: "mediation / arbitration", weight: 2, category: "dispute_resolution" },
    { term: "client counseling", weight: 3, category: "skill" },
    { term: "trial preparation", weight: 2, category: "litigation" },
    { term: "legal documentation", weight: 3, category: "skill" },
    { term: "mergers & acquisitions (legal)", weight: 2, category: "corporate_law" },
    { term: "compliance programs", weight: 2, category: "corporate_governance" },
    { term: "data privacy law (gdpr, ccpa)", weight: 2, category: "practice_area" },
    { term: "environmental law", weight: 1, category: "practice_area" },
    { term: "family law", weight: 1, category: "practice_area" },
    { term: "immigration law", weight: 1, category: "practice_area" },
    { term: "legal ethics", weight: 3, category: "professional_standard" },
    { term: "courtroom advocacy", weight: 3, category: "skill_litigation" },
    { term: "statutory interpretation", weight: 2, category: "skill" },
    { term: "legal transcription", weight: 1, category: "support_skill" },
  ],
  creative_design_arts: [
    { term: "graphic design", weight: 3, category: "visual_communication" },
    { term: "adobe illustrator", weight: 3, category: "design_software" },
    { term: "adobe photoshop", weight: 3, category: "design_software" },
    { term: "adobe indesign", weight: 2, category: "design_software" },
    { term: "ui/ux design", weight: 3, category: "user_experience" },
    { term: "figma", weight: 3, category: "ui_ux_tool" },
    { term: "sketch", weight: 2, category: "ui_ux_tool" },
    { term: "adobe xd", weight: 2, category: "ui_ux_tool" },
    { term: "copywriting", weight: 3, category: "writing" },
    { term: "content creation", weight: 3, category: "media_production" },
    { term: "storytelling", weight: 3, category: "communication" },
    { term: "video editing", weight: 2, category: "post_production" },
    { term: "adobe premiere pro", weight: 2, category: "video_software" },
    { term: "final cut pro", weight: 2, category: "video_software" },
    { term: "photography", weight: 2, category: "visual_arts" },
    { term: "illustration", weight: 2, category: "visual_arts" },
    { term: "3d modeling / animation (maya, blender)", weight: 2, category: "digital_art" },
    { term: "brand identity design", weight: 3, category: "branding" },
    { term: "typography", weight: 2, category: "design_principle" },
    { term: "creative direction", weight: 3, category: "leadership" },
    { term: "portfolio development", weight: 3, category: "self_promotion" },
    { term: "user research", weight: 2, category: "ux_process" },
    { term: "wireframing", weight: 2, category: "ux_process" },
    { term: "prototyping", weight: 2, category: "ux_process" },
    { term: "technical writing", weight: 2, category: "writing" },
    { term: "motion graphics", weight: 2, category: "animation" },
    { term: "art direction", weight: 3, category: "visual_leadership" },
    { term: "digital painting", weight: 1, category: "digital_art" },
    { term: "print design", weight: 2, category: "graphic_design" },
    { term: "web design", weight: 3, category: "digital_design" },
  ],
  hospitality_tourism: [
    { term: "customer service excellence", weight: 3, category: "guest_relations" },
    { term: "event management", weight: 3, category: "operations" },
    { term: "hotel management", weight: 3, category: "operations" },
    { term: "food & beverage (f&b) operations", weight: 3, category: "operations" },
    { term: "revenue management", weight: 2, category: "finance_strategy" },
    { term: "property management systems (pms)", weight: 3, category: "tool" },
    { term: "opera pms", weight: 2, category: "pms_software" },
    { term: "guest relations", weight: 3, category: "service" },
    { term: "tourism marketing", weight: 2, category: "marketing" },
    { term: "travel planning and booking", weight: 2, category: "service" },
    { term: "front office operations", weight: 3, category: "hotel_operations" },
    { term: "housekeeping management", weight: 2, category: "hotel_operations" },
    { term: "menu planning and costing", weight: 2, category: "f&b_management" },
    { term: "catering management", weight: 2, category: "event_services" },
    { term: "yield management", weight: 2, category: "revenue_strategy" },
    { term: "sustainable tourism practices", weight: 1, category: "industry_trend" },
    { term: "crisis management (hospitality)", weight: 2, category: "safety_security" },
    { term: "quality assurance (hospitality)", weight: 2, category: "standards" },
    { term: "concierge services", weight: 2, category: "guest_services" },
    { term: "point of sale (pos) systems", weight: 2, category: "tool" },
    { term: "banquet operations", weight: 2, category: "event_services" },
    { term: "staff training and supervision", weight: 2, category: "management" },
    { term: "health and safety regulations (hospitality)", weight: 2, category: "compliance" },
    { term: "inventory management (f&b)", weight: 2, category: "operations" },
    { term: "online travel agencies (otas)", weight: 2, category: "distribution_channel" },
    { term: "destination management", weight: 1, category: "tourism_strategy" },
    { term: "upselling", weight: 2, category: "sales_skill" },
    { term: "complaint resolution", weight: 3, category: "customer_service" },
    { term: "cultural sensitivity", weight: 2, category: "soft_skill" },
    { term: "multilingual skills", weight: 1, category: "asset" },
  ],
  logistics_supply_chain: [
    { term: "supply chain management (scm)", weight: 3, category: "core_function" },
    { term: "logistics planning", weight: 3, category: "operations" },
    { term: "warehouse management systems (wms)", weight: 3, category: "tool_system" },
    { term: "inventory management", weight: 3, category: "operations" },
    { term: "procurement", weight: 3, category: "sourcing" },
    { term: "transportation management systems (tms)", weight: 2, category: "tool_system" },
    { term: "freight forwarding", weight: 2, category: "transportation" },
    { term: "customs clearance", weight: 2, category: "international_trade" },
    { term: "erp systems (sap s/4hana, oracle scm)", weight: 3, category: "tool_system" },
    { term: "demand forecasting", weight: 3, category: "planning" },
    { term: "lean principles / six sigma (logistics)", weight: 2, category: "process_improvement" },
    { term: "global sourcing", weight: 2, category: "procurement" },
    { term: "vendor management", weight: 2, category: "supplier_relations" },
    { term: "last-mile delivery", weight: 2, category: "distribution" },
    { term: "cold chain logistics", weight: 1, category: "specialized_logistics" },
    { term: "reverse logistics", weight: 1, category: "operations" },
    { term: "trade compliance", weight: 2, category: "regulatory" },
    { term: "route optimization", weight: 2, category: "efficiency" },
    { term: "materials requirement planning (mrp)", weight: 2, category: "planning" },
    { term: "supply chain analytics", weight: 2, category: "data_analysis" },
    { term: "shipping and receiving", weight: 2, category: "warehouse_operations" },
    { term: "incoterms", weight: 1, category: "international_trade" },
    { term: "risk management (supply chain)", weight: 2, category: "strategy" },
    { term: "s&op (sales and operations planning)", weight: 2, category: "planning_collaboration" },
    { term: "supply chain visibility", weight: 2, category: "technology_strategy" },
    { term: "contract negotiation (logistics)", weight: 2, category: "skill" },
    { term: "rfid technology", weight: 1, category: "tracking_tool" },
    { term: "sustainable supply chain", weight: 1, category: "industry_trend" },
    { term: "3pl (third-party logistics) management", weight: 2, category: "outsourcing" },
    { term: "distribution network design", weight: 2, category: "strategy" },
  ],
  construction: [
    { term: "construction project management", weight: 3, category: "management" },
    { term: "blueprint reading", weight: 3, category: "technical_skill" },
    { term: "cad / bim software (revit, autocad)", weight: 3, category: "tool" },
    { term: "construction management software (procore, primavera p6)", weight: 3, category: "tool" },
    { term: "cost estimation / quantity surveying", weight: 3, category: "planning" },
    { term: "site supervision / management", weight: 3, category: "on_site_operations" },
    { term: "osha regulations / construction safety", weight: 3, category: "compliance_safety" },
    { term: "building codes and standards", weight: 3, category: "compliance_knowledge" },
    { term: "contract administration / negotiation", weight: 2, category: "legal_commercial" },
    { term: "quality control (construction)", weight: 3, category: "standards" },
    { term: "construction scheduling", weight: 3, category: "planning" },
    { term: "land surveying", weight: 1, category: "pre_construction" },
    { term: "structural engineering principles", weight: 2, category: "technical_knowledge" },
    { term: "mep (mechanical, electrical, plumbing) systems", weight: 2, category: "technical_knowledge" },
    { term: "sustainable construction (leed)", weight: 2, category: "green_building" },
    { term: "risk management (construction)", weight: 2, category: "planning_oversight" },
    { term: "subcontractor coordination", weight: 2, category: "management" },
    { term: "materials procurement (construction)", weight: 2, category: "logistics" },
    { term: "civil engineering (construction related)", weight: 2, category: "technical_knowledge" },
    { term: "heavy equipment operation", weight: 1, category: "on_site_skill" },
    { term: "value engineering", weight: 2, category: "cost_optimization" },
    { term: "change order management", weight: 2, category: "project_control" },
    { term: "progress reporting", weight: 2, category: "communication" },
    { term: "concrete technology", weight: 1, category: "materials" },
    { term: "steel erection", weight: 1, category: "specialized_skill" },
    { term: "project closeout", weight: 2, category: "project_lifecycle" },
    { term: "tendering / bidding process", weight: 2, category: "pre_construction" },
    { term: "inspection", weight: 3, category: "quality_compliance" },
    { term: "formwork", weight: 1, category: "construction_method" },
    { term: "geotechnical engineering", weight: 1, category: "pre_construction" },
  ],
  energy: [
    { term: "reservoir engineering (o&g)", weight: 2, category: "oil_gas_specialty" },
    { term: "drilling operations (o&g)", weight: 2, category: "oil_gas_operations" },
    { term: "petroleum geology (o&g)", weight: 2, category: "oil_gas_exploration" },
    { term: "pipeline integrity management", weight: 2, category: "asset_management" },
    { term: "renewable energy technologies (solar, wind, hydro)", weight: 3, category: "renewables" },
    { term: "pv system design (solar)", weight: 2, category: "solar_energy" },
    { term: "wind turbine technology", weight: 2, category: "wind_energy" },
    { term: "energy trading and marketing", weight: 2, category: "finance_commerce" },
    { term: "power generation", weight: 3, category: "operations" },
    { term: "electrical grid management / smart grid", weight: 2, category: "infrastructure" },
    { term: "energy policy and regulation", weight: 2, category: "governance" },
    { term: "environmental compliance (energy sector)", weight: 3, category: "hse" },
    { term: "hse (health, safety, environment) management", weight: 3, category: "operations_compliance" },
    { term: "energy project management", weight: 3, category: "management" },
    { term: "gis (geographic information systems)", weight: 2, category: "tool_analysis" },
    { term: "scada systems", weight: 2, category: "control_systems" },
    { term: "energy efficiency auditing", weight: 2, category: "consulting_optimization" },
    { term: "carbon capture and storage (ccs)", weight: 1, category: "emerging_tech" },
    { term: "sustainable energy solutions", weight: 2, category: "strategy" },
    { term: "energy storage solutions (batteries)", weight: 2, category: "technology" },
    { term: "resource assessment (renewables)", weight: 2, category: "project_development" },
    { term: "oil and gas exploration", weight: 2, category: "upstream_o&g" },
    { term: "refining processes (o&g)", weight: 1, category: "downstream_o&g" },
    { term: "nuclear energy", weight: 1, category: "power_source" },
    { term: "hydrogen technology", weight: 1, category: "emerging_fuel" },
    { term: "geothermal energy", weight: 1, category: "renewable_source" },
    { term: "offshore operations", weight: 1, category: "specialized_operations" },
    { term: "energy modeling", weight: 2, category: "analysis" },
    { term: "decommissioning (energy facilities)", weight: 1, category: "lifecycle_management" },
    { term: "asset integrity management", weight: 2, category: "operations" },
  ],
  government_public_sector: [
    { term: "public policy analysis", weight: 3, category: "analysis_strategy" },
    { term: "grant writing and management", weight: 3, category: "funding" },
    { term: "government contracting / procurement", weight: 2, category: "operations" },
    { term: "public administration", weight: 3, category: "management" },
    { term: "legislative affairs / lobbying", weight: 2, category: "advocacy" },
    { term: "public budgeting and finance", weight: 3, category: "financial_management" },
    { term: "community outreach and engagement", weight: 2, category: "public_relations" },
    { term: "regulatory affairs / compliance", weight: 3, category: "governance" },
    { term: "urban and regional planning", weight: 2, category: "development" },
    { term: "public speaking", weight: 3, category: "communication" },
    { term: "constituent services", weight: 2, category: "stakeholder_management" },
    { term: "program management / evaluation", weight: 3, category: "operations" },
    { term: "policy implementation", weight: 2, category: "execution" },
    { term: "data analysis for public policy", weight: 2, category: "research_analysis" },
    { term: "stakeholder management", weight: 3, category: "relationship_building" },
    { term: "civic engagement initiatives", weight: 1, category: "community_development" },
    { term: "emergency management / disaster response", weight: 2, category: "public_safety" },
    { term: "international relations / diplomacy", weight: 1, category: "foreign_affairs" },
    { term: "economic development", weight: 2, category: "growth_strategy" },
    { term: "public records management", weight: 1, category: "administration" },
    { term: "foia (freedom of information act) requests", weight: 1, category: "legal_compliance" },
    { term: "public sector ethics", weight: 3, category: "professional_conduct" },
    { term: "intergovernmental affairs", weight: 1, category: "collaboration" },
    { term: "social services administration", weight: 2, category: "public_welfare" },
    { term: "transportation planning", weight: 1, category: "urban_development" },
    { term: "environmental policy", weight: 2, category: "sustainability" },
    { term: "public health administration", weight: 2, category: "health_policy" },
    { term: "survey design and analysis", weight: 2, category: "research" },
    { term: "report writing (government)", weight: 3, category: "communication" },
    { term: "election administration", weight: 1, category: "civic_process" },
  ],
  non_profit: [
    { term: "fundraising / development", weight: 3, category: "revenue_generation" },
    { term: "grant writing", weight: 3, category: "funding" },
    { term: "non-profit management", weight: 3, category: "leadership" },
    { term: "volunteer coordination / management", weight: 3, category: "human_resources" },
    { term: "community outreach", weight: 3, category: "engagement" },
    { term: "advocacy", weight: 2, category: "mission_driven_action" },
    { term: "program management / development", weight: 3, category: "operations" },
    { term: "impact measurement / evaluation", weight: 2, category: "accountability" },
    { term: "donor relations / stewardship", weight: 3, category: "fundraising" },
    { term: "non-profit accounting / finance", weight: 2, category: "financial_management" },
    { term: "board development / governance", weight: 2, category: "leadership" },
    { term: "social media for non-profits", weight: 2, category: "marketing_communication" },
    { term: "public speaking (non-profit)", weight: 2, category: "communication" },
    { term: "event planning (fundraising events)", weight: 2, category: "fundraising_operations" },
    { term: "capacity building", weight: 1, category: "organizational_development" },
    { term: "strategic planning (non-profit)", weight: 2, category: "strategy" },
    { term: "social enterprise models", weight: 1, category: "innovation" },
    { term: "case management (social work)", weight: 2, category: "client_services" },
    { term: "grant management / reporting", weight: 2, category: "compliance_funding" },
    { term: "non-profit marketing and communications", weight: 2, category: "outreach" },
    { term: "crm for non-profits (e.g., Bloomerang, Little Green Light)", weight: 2, category: "tool" },
    { term: "advocacy campaigns", weight: 2, category: "mission_advancement" },
    { term: "storytelling for impact", weight: 3, category: "communication_fundraising" },
    { term: "community needs assessment", weight: 2, category: "research_planning" },
    { term: "coalition building", weight: 1, category: "collaboration" },
    { term: "mission-driven leadership", weight: 3, category: "leadership_values" },
    { term: "program evaluation", weight: 2, category: "impact_assessment" },
    { term: "stakeholder engagement", weight: 3, category: "relationship_management" },
    { term: "social justice advocacy", weight: 2, category: "mission_focus" },
    { term: "resource mobilization", weight: 3, category: "fundraising_development" },
  ],
  science_research: [
    { term: "laboratory techniques", weight: 3, category: "experimental_skill" },
    { term: "data analysis (r, python, spss, matlab)", weight: 3, category: "analytical_skill" },
    { term: "scientific writing / publication", weight: 3, category: "communication" },
    { term: "research methodology", weight: 3, category: "planning_execution" },
    { term: "experimental design", weight: 3, category: "planning" },
    { term: "grant proposal writing", weight: 3, category: "funding" },
    { term: "statistical analysis", weight: 3, category: "data_interpretation" },
    { term: "bioinformatics", weight: 2, category: "computational_biology" },
    { term: "genomics / proteomics", weight: 2, category: "molecular_biology" },
    { term: "microscopy (confocal, electron)", weight: 2, category: "imaging_technique" },
    { term: "spectroscopy (nmr, mass spec)", weight: 2, category: "analytical_technique" },
    { term: "chromatography (hplc, gc)", weight: 2, category: "separation_technique" },
    { term: "cell culture / tissue culture", weight: 2, category: "lab_technique" },
    { term: "molecular biology techniques (pcr, western blot)", weight: 2, category: "lab_technique" },
    { term: "clinical trial management", weight: 2, category: "medical_research" },
    { term: "peer review process", weight: 2, category: "academic_activity" },
    { term: "conference presentations", weight: 2, category: "communication" },
    { term: "literature review", weight: 3, category: "research_skill" },
    { term: "ethical conduct in research", weight: 3, category: "professional_standard" },
    { term: "data management and archiving", weight: 2, category: "research_practice" },
    { term: "hypothesis testing", weight: 3, category: "scientific_method" },
    { term: "quantitative research", weight: 3, category: "research_approach" },
    { term: "qualitative research", weight: 2, category: "research_approach" },
    { term: "metagenomics", weight: 1, category: "specialized_omics" },
    { term: "computational chemistry/biology", weight: 2, category: "simulation_modeling" },
    { term: "instrumentation", weight: 2, category: "lab_equipment" },
    { term: "protocol development", weight: 2, category: "experimental_planning" },
    { term: "data visualization (scientific)", weight: 2, category: "communication" },
    { term: "quality control (research)", weight: 2, category: "research_standards" },
    { term: "lab safety procedures", weight: 3, category: "safety" },
  ],
  retail: [
    { term: "merchandising", weight: 3, category: "product_management" },
    { term: "visual merchandising", weight: 2, category: "store_presentation" },
    { term: "inventory management / stock control", weight: 3, category: "operations" },
    { term: "point of sale (pos) systems", weight: 3, category: "tool_operations" },
    { term: "customer service", weight: 3, category: "client_interaction" },
    { term: "retail sales techniques", weight: 3, category: "sales" },
    { term: "store management", weight: 3, category: "leadership_operations" },
    { term: "loss prevention", weight: 2, category: "security_operations" },
    { term: "retail analytics", weight: 2, category: "data_analysis" },
    { term: "e-commerce platform management (shopify, magento)", weight: 2, category: "online_retail" },
    { term: "supply chain (retail)", weight: 2, category: "logistics" },
    { term: "pricing strategy", weight: 2, category: "merchandising_finance" },
    { term: "product knowledge", weight: 3, category: "sales_service" },
    { term: "customer relationship management (crm) for retail", weight: 2, category: "customer_loyalty" },
    { term: "retail marketing / promotions", weight: 2, category: "marketing" },
    { term: "team leadership / staff supervision", weight: 3, category: "management" },
    { term: "kpi tracking (sales, conversion, atv)", weight: 3, category: "performance_analysis" },
    { term: "omnichannel retail strategy", weight: 2, category: "business_model" },
    { term: "workforce scheduling / rostering", weight: 2, category: "operations_management" },
    { term: "planogram implementation", weight: 1, category: "merchandising" },
    { term: "cash handling procedures", weight: 2, category: "operations_finance" },
    { term: "customer experience (cx) management", weight: 3, category: "service_strategy" },
    { term: "store layout and design", weight: 1, category: "visual_merchandising" },
    { term: "returns and exchanges processing", weight: 2, category: "customer_service" },
    { term: "upselling and cross-selling", weight: 2, category: "sales_technique" },
    { term: "category management", weight: 2, category: "merchandising" },
    { term: "shrinkage reduction", weight: 2, category: "loss_prevention" },
    { term: "retail operations", weight: 3, category: "core_function" },
    { term: "loyalty programs", weight: 1, category: "customer_retention" },
    { term: "health and safety (retail)", weight: 2, category: "compliance" },
  ],
  media_entertainment: [
    { term: "content creation (writing, video, audio)", weight: 3, category: "production" },
    { term: "production management", weight: 3, category: "operations" },
    { term: "broadcasting operations", weight: 2, category: "distribution" },
    { term: "journalism / reporting", weight: 3, category: "content_gathering" },
    { term: "digital media strategy", weight: 3, category: "online_presence" },
    { term: "social media management (media focus)", weight: 3, category: "audience_engagement" },
    { term: "video editing (premiere pro, final cut pro, avid)", weight: 3, category: "post_production" },
    { term: "audio editing / sound design (pro tools, audition)", weight: 2, category: "post_production" },
    { term: "scriptwriting / screenwriting", weight: 2, category: "content_development" },
    { term: "content distribution", weight: 2, category: "reach_strategy" },
    { term: "licensing and rights management", weight: 1, category: "legal_business" },
    { term: "public relations (pr) for entertainment", weight: 2, category: "promotion" },
    { term: "talent management / artist relations", weight: 1, category: "representation" },
    { term: "market research (media trends)", weight: 2, category: "analytics_strategy" },
    { term: "audience engagement / community management", weight: 3, category: "interaction" },
    { term: "streaming platform operations", weight: 2, category: "digital_distribution" },
    { term: "animation (2d/3d)", weight: 2, category: "visual_production" },
    { term: "graphic design for media", weight: 2, category: "visual_communication" },
    { term: "post-production workflow", weight: 2, category: "operations" },
    { term: "live event production", weight: 2, category: "experiential" },
    { term: "media planning and buying", weight: 2, category: "advertising" },
    { term: "digital asset management (dam)", weight: 1, category: "organization_tool" },
    { term: "film production", weight: 2, category: "production_type" },
    { term: "music production", weight: 2, category: "production_type" },
    { term: "podcast production", weight: 2, category: "production_type" },
    { term: "monetization strategies (media)", weight: 2, category: "business_model" },
    { term: "transmedia storytelling", weight: 1, category: "narrative_strategy" },
    { term: "vfx (visual effects)", weight: 1, category: "post_production" },
    { term: "content curation", weight: 2, category: "editorial" },
    { term: "media ethics", weight: 2, category: "professional_standards" },
  ],
  consulting: [
    { term: "management consulting", weight: 3, category: "service_type" },
    { term: "strategy consulting", weight: 3, category: "service_type" },
    { term: "technology consulting", weight: 3, category: "service_type" },
    { term: "problem-solving frameworks", weight: 3, category: "analytical_skill" },
    { term: "data analysis and interpretation", weight: 3, category: "analytical_skill" },
    { term: "client relationship management", weight: 3, category: "soft_skill" },
    { term: "project management (consulting)", weight: 3, category: "execution" },
    { term: "stakeholder management", weight: 3, category: "soft_skill" },
    { term: "business process improvement (bpi)", weight: 2, category: "service_offering" },
    { term: "change management", weight: 2, category: "service_offering" },
    { term: "workshop facilitation", weight: 2, category: "delivery_skill" },
    { term: "presentation skills / public speaking", weight: 3, category: "communication" },
    { term: "proposal writing / business development", weight: 2, category: "sales_growth" },
    { term: "financial modeling (consulting)", weight: 2, category: "analytical_tool" },
    { term: "market research and analysis", weight: 2, category: "analytical_skill" },
    { term: "due diligence (consulting)", weight: 2, category: "service_offering" },
    { term: "industry expertise (specify industry)", weight: 3, category: "knowledge_base" },
    { term: "report writing and C-level communication", weight: 3, category: "communication" },
    { term: "qualitative and quantitative research", weight: 2, category: "analytical_skill" },
    { term: "lean / agile methodologies (consulting)", weight: 2, category: "framework" },
    { term: "digital transformation", weight: 2, category: "service_offering" },
    { term: "organizational design", weight: 2, category: "service_offering" },
    { term: "performance improvement", weight: 2, category: "service_offering" },
    { term: "risk advisory", weight: 2, category: "service_type" },
    { term: "supply chain consulting", weight: 2, category: "service_type" },
    { term: "human capital consulting", weight: 2, category: "service_type" },
    { term: "benchmarking", weight: 1, category: "analytical_tool" },
    { term: "diagnostic assessments", weight: 2, category: "methodology" },
    { term: "solution design", weight: 3, category: "core_skill" },
    { term: "thought leadership", weight: 1, category: "professional_development" },
  ],
  cross_industry_general: [
    { term: "project management", weight: 3, category: "management_skill" },
    { term: "communication (written & verbal)", weight: 3, category: "soft_skill" },
    { term: "leadership", weight: 3, category: "soft_skill" },
    { term: "teamwork / collaboration", weight: 3, category: "soft_skill" },
    { term: "problem-solving", weight: 3, category: "analytical_skill" },
    { term: "analytical thinking", weight: 3, category: "cognitive_skill" },
    { term: "critical thinking", weight: 3, category: "cognitive_skill" },
    { term: "adaptability / flexibility", weight: 2, category: "soft_skill" },
    { term: "time management", weight: 3, category: "organizational_skill" },
    { term: "organizational skills", weight: 2, category: "personal_effectiveness" },
    { term: "microsoft office suite (word, excel, powerpoint)", weight: 3, category: "software_tool" },
    { term: "google workspace (docs, sheets, slides)", weight: 2, category: "software_tool" },
    { term: "data analysis (general)", weight: 2, category: "analytical_skill" },
    { term: "research skills", weight: 2, category: "information_gathering" },
    { term: "presentation skills", weight: 3, category: "communication_skill" },
    { term: "negotiation", weight: 2, category: "interpersonal_skill" },
    { term: "customer service", weight: 3, category: "interpersonal_skill" },
    { term: "creativity / innovation", weight: 2, category: "cognitive_skill" },
    { term: "attention to detail", weight: 3, category: "work_ethic" },
    { term: "decision making", weight: 2, category: "cognitive_skill" },
    { term: "interpersonal skills", weight: 3, category: "soft_skill" },
    { term: "strategic planning", weight: 2, category: "management_skill" },
    { term: "conflict resolution", weight: 2, category: "interpersonal_skill" },
    { term: "mentorship / coaching", weight: 1, category: "leadership_skill" },
    { term: "public speaking", weight: 2, category: "communication_skill" },
    { term: "reporting / documentation", weight: 2, category: "communication_skill" },
    { term: "budget management (general)", weight: 2, category: "financial_skill" },
    { term: "data visualization (general)", weight: 2, category: "analytical_communication" },
    { term: "business acumen", weight: 2, category: "strategic_understanding" },
    { term: "stakeholder engagement", weight: 2, category: "relationship_management" },
    { term: "process improvement", weight: 2, category: "efficiency_skill" },
    { term: "multitasking", weight: 2, category: "organizational_skill" },
    { term: "initiative", weight: 2, category: "soft_skill" },
    { term: "emotional intelligence", weight: 2, category: "soft_skill" },
    { term: "active listening", weight: 3, category: "communication_skill" },
  ]
};


const ACTION_VERBS = [
  // Original verbs
  "achieved", "improved", "transformed", "delivered", "increased",
  "reduced", "saved", "negotiated", "launched", "developed",
  "created", "designed", "implemented", "led", "managed",
  "coordinated", "supervised", "directed", "streamlined", "optimized",

  // Expansion - Management & Leadership
  "administered", "appointed", "approved", "assigned", "authorized",
  "chaired", "consolidated", "contracted", "controlled", "delegated",
  "enabled", "encouraged", "enforced", "established", "executed",
  "facilitated", "founded", "governed", "guided", "headed",
  "hired", "hosted", "inspired", "instituted", "instructed",
  "mentored", "motivated", "officiated", "operated", "orchestrated",
  "oversaw", "piloted", "planned", "presided", "prioritized",
  "produced", "recruited", "regulated", "reorganized", "reviewed",
  "scheduled", "secured", "selected", "spearheaded", "strengthened",
  "trained",

  // Expansion - Creation & Development
  "architected", "authored", "built", "calculated", "composed",
  "computed", "conceived", "conceptualized", "constructed", "customized",
  "derived", "determined", "devised", "discovered", "drafted",
  "engineered", "established", "fashioned", "formulated", "generated",
  "initiated", "innovated", "integrated", "introduced", "invented",
  "modeled", "modified", "originated", "pioneered", "prototyped",
  "published", "refined", "shaped", "structured", "synthesized",

  // Expansion - Improvement & Optimization
  "accelerated", "advanced", "amplified", "augmented", "boosted",
  "centralized", "clarified", "corrected", "debugged", "decreased",
  "diagnosed", "eliminated", "enhanced", "expanded", "expedited",
  "generated", "influenced", "integrated", "intensified", "lessened",
  "leveraged", "maximized", "merged", "minimized", "modernized",
  "modified", "overhauled", "perfected", "prevented", "progressed",
  "promoted", "raised", "realigned", "rebuilt", "rectified",
  "redesigned", "reengineered", "refined", "reformed", "rehabilitated",
  "remedied", "remodeled", "renovated", "repaired", "replaced",
  "resolved", "restored", "restructured", "revamped", "revitalized",
  "simplified", "standardized", "stimulated", "systematized", "upgraded",

  // Expansion - Achievement & Results
  "accomplished", "acquired", "attained", "awarded", "capitalized",
  "captured", "completed", "demonstrated", "earned", "exceeded",
  "excelled", "finalized", "fulfilled", "gained", "generated (results)",
  "mastered", "obtained", "outperformed", "procured", "realized",
  "recognized", "resolved", "secured", "showcased", "succeeded",
  "surpassed", "sustained", "validated", "won",

  // Expansion - Communication & Collaboration
  "addressed", "advertised", "advised", "advocated", "arbitrated",
  "arranged", "articulated", "briefed", "campaigned", "clarified",
  "collaborated", "communicated", "composed", "conferred", "consulted",
  "conveyed", "corresponded", "counseled", "critiqued", "defined",
  "demonstrated", "discussed", "documented", "edited", "elicited",
  "enlisted", "explained", "expressed", "fielded", "formalized",
  "illustrated", "informed", "interpreted", "interviewed", "liaised",
  "lobbied", "marketed", "mediated", "moderated", "networked",
  "outlined", "participated", "persuaded", "presented", "promoted",
  "proposed", "publicized", "reconciled", "reported", "represented",
  "responded", "solicited", "specified", "spoke", "summarized",
  "synthesized", "translated", "verified", "wrote",

  // Expansion - Analysis & Research
  "analyzed", "appraised", "assessed", "audited", "benchmarked",
  "calculated", "cataloged", "charted", "checked", "classified",
  "collected", "compared", "compiled", "computed", "counseled",
  "critiqued", "detected", "diagnosed", "evaluated", "examined",
  "experimented", "explored", "extracted", "forecasted", "identified",
  "inspected", "interpreted", "interviewed", "investigated", "judged",
  "mapped", "measured", "monitored", "observed", "predicted",
  "probed", "proofread", "quantified", "queried", "ranked",
  "rated", "researched", "retrieved", "screened", "scrutinized",
  "solved", "studied", "surveyed", "systematized", "tested",
  "tracked", "validated",

  // Expansion - Organization & Planning
  "allocated", "anticipated", "arranged", "assembled", "budgeted",
  "cataloged", "categorized", "charted", "chronicled", "classified",
  "collated", "collected", "compiled", "controlled", "correlated",
  "distributed", "documented", "estimated", "filed", "forecasted",
  "formatted", "gathered", "grouped", "indexed", "inventoried",
  "logged", "maintained", "mapped", "marshalled", "mobilized",
  "monitored", "ordered", "organized", "prepared", "processed",
  "programmed", "projected", "recorded", "registered", "reserved",
  "routed", "set up", "systematized", "tabulated", "targeted",
  "updated",

  // Expansion - Execution & Implementation
  "adapted", "adopted", "applied", "assembled", "automated",
  "balanced", "briefed", "built", "carried out", "commissioned",
  "completed", "conducted", "configured", "conserved", "constructed",
  "customized", "demonstrated", "dispatched", "distributed", "employed",
  "enacted", "engineered", "ensured", "erected", "executed",
  "exercised", "fabricated", "familiarized", "fielded", "fitted",
  "functioned", "furnished", "handled", "harnessed", "installed",
  "interfaced", "maintained", "maneuvered", "manufactured", "merged",
  "mobilized", "operated", "organized", "performed", "positioned",
  "prepared", "processed", "programmed", "provided", "purchased",
  "put into practice", "ran", "rendered", "repaired", "responded",
  "restored", "serviced", "set", "set up", "solved",
  "started", "submitted", "supplied", "supported", "surveyed",
  "utilized", "validated", "verified", "worked",

  // Expansion - Financial & Sales
  "accounted", "acquired (companies/clients)", "allocated (funds)", "analyzed (financial data)", "appraised (assets)",
  "audited (accounts)", "balanced (budgets)", "billed", "budgeted", "calculated (costs/profits)",
  "closed (deals)", "collected (revenue/debts)", "compensated", "compiled (financial reports)", "computed (financials)",
  "conserved (resources)", "credited", "disbursed", "earned (revenue)", "economized",
  "estimated (costs)", "financed", "forecasted (sales/revenue)", "funded", "invested",
  "liquidated", "marketed (products/services)", "merchandised", "negotiated (contracts/prices)", "pitched",
  "priced", "procured (goods/services)", "projected (earnings)", "raised (capital)", "reconciled (accounts)",
  "recouped", "retailed", "sold", "solicited (business/donations)", "underwrote",
  "valued", "vended",

  // Expansion - Problem Solving
  "adapted", "adjusted", "alleviated", "amended", "answered",
  "arbitrated", "assessed", "averted", "balanced", "clarified",
  "corrected", "countered", "debugged", "deciphered", "deduced",
  "defined", "determined", "diagnosed", "disentangled", "eased",
  "eliminated", "engineered (solutions)", "explained", "extrapolated", "fixed",
  "formulated (solutions)", "identified (issues)", "intervened", "investigated", "isolated",
  "mediated", "mitigated", "moderated", "neutralized", "overcame",
  "patched", "prevented", "rectified", "redressed", "remedied",
  "repaired", "resolved", "responded to", "restored", "settled",
  "simplified", "solved", "stabilized", "surmounted", "tackled",
  "troubleshot", "uncovered", "unraveled", "updated"
];

const SECTION_PATTERNS = {
  contact: [
    { pattern: /contact\s*(information|details)?/i, weight: 1 },
    { pattern: /\b(email|phone|address|linkedin)\b/i, weight: 0.5 }
  ],
  summary: [
    { pattern: /\b(professional\s+summary|profile|objective)\b/i, weight: 1 },
    { pattern: /\b(career\s+objective|about\s+me)\b/i, weight: 0.8 }
  ],
  skills: [
    { pattern: /\b(skills|technical\s+skills|core\s+competencies|expertise)\b/i, weight: 1 },
    { pattern: /\b(proficiencies|capabilities|competencies)\b/i, weight: 0.8 }
  ],
  experience: [
    { pattern: /\b(experience|work\s+experience|professional\s+experience|employment\s+history)\b/i, weight: 1 },
    { pattern: /\b(work\s+history|career\s+history|professional\s+background)\b/i, weight: 0.8 }
  ],
  education: [
    { pattern: /\b(education|academic\s+background|academic\s+qualifications)\b/i, weight: 1 },
    { pattern: /\b(degrees|qualifications|educational\s+background)\b/i, weight: 0.8 }
  ],
  certifications: [
    { pattern: /\b(certifications|certificates|professional\s+certifications|credentials)\b/i, weight: 1 },
    { pattern: /\b(licenses|accreditations)\b/i, weight: 0.8 }
  ],
  projects: [
    { pattern: /\b(projects|project\s+experience|notable\s+projects|key\s+projects)\b/i, weight: 1 },
    { pattern: /\b(portfolio|case\s+studies|implementations)\b/i, weight: 0.8 }
  ],
  languages: [
    { pattern: /\b(languages|language\s+proficiency|language\s+skills)\b/i, weight: 1 },
    { pattern: /\b(spoken\s+languages|multilingual\s+skills)\b/i, weight: 0.8 }
  ],
  references: [
    { pattern: /\b(references|professional\s+references)\b/i, weight: 1 },
    { pattern: /\b(referees|references\s+available\s+upon\s+request)\b/i, weight: 0.8 }
  ],
  achievements: [
    { pattern: /\b(achievements|accomplishments|awards|honors|recognitions)\b/i, weight: 1 },
    { pattern: /\b(accolades|distinctions|acknowledgments)\b/i, weight: 0.8 }
  ],
  volunteer: [
    { pattern: /\b(volunteer|volunteering|community\s+service|community\s+involvement)\b/i, weight: 1 },
    { pattern: /\b(pro\s+bono|non-profit\s+work|civic\s+engagement)\b/i, weight: 0.8 }
  ]
};

/**
 * Analyzes the content structure of a CV
 * @param text The raw CV text content
 * @param industry Optional industry to focus analysis on
 * @returns Detailed CV analysis result
 */
export function analyzeCVContent(text: string, industry: keyof typeof INDUSTRY_KEYWORDS = "tech"): CVAnalysisResult {
  // Clean text for analysis
  const cleanText = text.replace(/\s+/g, " ").trim();
  
  // Extract sections based on patterns
  const sections = detectSections(cleanText);
  
  // Analyze keyword relevance
  const keywordAnalysis = analyzeKeywords(cleanText, industry);
  
  // Analyze action verbs and accomplishments
  const actionVerbAnalysis = analyzeActionVerbs(cleanText);
  
  // Sectional analysis
  const sectionAnalysis = analyzeSectionQuality(sections, cleanText);
  
  // Analyze CV length and depth
  const lengthAnalysis = analyzeCVLength(cleanText);
  
  // Calculate scores and identify issues
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Score baseline
  let overallScore = 70; // Start with baseline score
  
  // Section presence scoring
  const missingSections = identifyMissingSections(sections);
  if (missingSections.length > 0) {
    overallScore -= Math.min(missingSections.length * 5, 20); // Max deduction of 20 points
    issues.push("Missing important sections: " + missingSections.join(", "));
    recommendations.push("Add the following sections to your CV: " + missingSections.join(", "));
  }
  
  // Keyword matching scoring
  const keywordScore = calculateKeywordScore(keywordAnalysis);
  overallScore += keywordScore.adjustment;
  
  if (keywordScore.adjustment < 0) {
    issues.push("Low industry-relevant keyword density");
    recommendations.push(
      `Enhance your CV with more ${industry} industry keywords, particularly in: ${
        keywordScore.missingCategories.join(", ")
      }`
    );
  }
  
  // Action verb scoring
  if (actionVerbAnalysis.count < 5) {
    overallScore -= Math.min(5, 10); // Max deduction of 10 points
    issues.push("Limited use of action verbs to describe accomplishments");
    recommendations.push(
      "Use more action verbs (e.g., achieved, improved, delivered) to highlight accomplishments"
    );
  }
  
  // Length analysis scoring
  if (lengthAnalysis.issue) {
    overallScore -= lengthAnalysis.penalty;
    issues.push(lengthAnalysis.issue);
    recommendations.push(lengthAnalysis.recommendation);
  }
  
  // Section quality scoring
  sectionAnalysis.forEach(section => {
    if (section.score < 70) {
      overallScore -= Math.min(3, 15); // Max deduction of 15 points
      issues.push(`${section.name} section needs improvement: ${section.issues.join(", ")}`);
      recommendations.push(`Improve ${section.name} section: ${section.recommendations.join(", ")}`);
    }
  });
  
  // Ensure score stays within bounds
  overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));
  
  // Build final result
  return {
    overallScore,
    sections: sections.map(s => s.name),
    issues,
    recommendations,
    details: {
      sectionAnalysis,
      keywordAnalysis: {
        found: keywordAnalysis.found,
        missing: keywordAnalysis.missing,
        coverage: keywordAnalysis.coverage
      },
      actionVerbCount: actionVerbAnalysis.count,
      contentLength: cleanText.length,
      wordCount: cleanText.split(/\s+/).length
    }
  };
}

/**
 * Detects sections in the CV
 */
function detectSections(text: string): { name: string; confidence: number }[] {
  const found: { name: string; confidence: number }[] = [];
  
  // Detect sections based on patterns
  for (const [sectionName, patterns] of Object.entries(SECTION_PATTERNS)) {
    let confidence = 0;
    
    // Check each pattern
    for (const { pattern, weight } of patterns) {
      if (pattern.test(text)) {
        confidence += weight;
      }
    }
    
    if (confidence > 0) {
      found.push({
        name: sectionName,
        confidence: Math.min(confidence, 1) // Normalize to max of 1
      });
    }
  }
  
  return found;
}

/**
 * Analyzes keywords in the CV
 */
function analyzeKeywords(text: string, industry: keyof typeof INDUSTRY_KEYWORDS): KeywordAnalysis {
  const lowerText = text.toLowerCase();
  const industryKeywords = INDUSTRY_KEYWORDS[industry] || INDUSTRY_KEYWORDS.tech;
  
  const found: SkillMatch[] = [];
  const missing: SkillMatch[] = [];

  function escapeRegExp(string: string): string {
    // $& means the whole matched string
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Check for each keyword
  industryKeywords.forEach(keyword => {
    const { term, weight, category } = keyword;
    const matches = (lowerText.match(new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi')) || []).length;
    
    if (matches > 0) {
      found.push({
        term,
        count: matches,
        category,
        weight
      });
    } else {
      missing.push({
        term,
        count: 0,
        category,
        weight
      });
    }
  });
  
  // Calculate coverage by category
  const categories = new Set(industryKeywords.map(k => k.category));
  const coverage: Record<string, number> = {};
  
  categories.forEach(category => {
    const categoryKeywords = industryKeywords.filter(k => k.category === category);
    const foundInCategory = found.filter(f => f.category === category);
    coverage[category] = foundInCategory.length / categoryKeywords.length;
  });
  
  return {
    found,
    missing,
    coverage
  };
}

/**
 * Calculates the keyword score adjustment
 */
function calculateKeywordScore(analysis: KeywordAnalysis): { adjustment: number; missingCategories: string[] } {
  // Calculate weighted score based on found keywords
  const foundWeight = analysis.found.reduce((sum, item) => sum + item.weight, 0);
  const totalWeight = analysis.found.concat(analysis.missing).reduce((sum, item) => sum + item.weight, 0);
  const weightRatio = foundWeight / totalWeight;
  
  // Identify categories with poor coverage
  const missingCategories: string[] = [];
  for (const [category, ratio] of Object.entries(analysis.coverage)) {
    if (ratio < 0.3) { // Less than 30% coverage
      missingCategories.push(category);
    }
  }
  
  // Calculate score adjustment (-10 to +10)
  const adjustment = Math.round((weightRatio - 0.5) * 20);
  
  return {
    adjustment,
    missingCategories
  };
}

/**
 * Analyzes action verbs used in the CV
 */
function analyzeActionVerbs(text: string): { count: number; verbs: string[] } {
  const lowerText = text.toLowerCase();
  const foundVerbs: string[] = [];
  
  ACTION_VERBS.forEach(verb => {
    if (new RegExp(`\\b${verb}\\b`, 'i').test(lowerText)) {
      foundVerbs.push(verb);
    }
  });
  
  return {
    count: foundVerbs.length,
    verbs: foundVerbs
  };
}

/**
 * Identifies missing important sections
 */
function identifyMissingSections(sections: { name: string; confidence: number }[]): string[] {
  const criticalSections = ['summary', 'experience', 'education', 'skills'];
  const foundSections = new Set(sections.map(s => s.name));
  
  return criticalSections.filter(s => !foundSections.has(s));
}

/**
 * Analyzes quality of each detected section
 */
function analyzeSectionQuality(
  sections: { name: string; confidence: number }[],
  text: string
): SectionAnalysis[] {
  const results: SectionAnalysis[] = [];
  
  sections.forEach(section => {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 85; // Start with a good score
    
    // Approximate section extraction (simplified)
    const sectionPattern = SECTION_PATTERNS[section.name as keyof typeof SECTION_PATTERNS];
    if (!sectionPattern) return;
    
    const pattern = sectionPattern[0].pattern;
    const matches = text.match(new RegExp(`${pattern.source}.*?(\n\\s*\\n|$)`, 'is'));
    
    if (!matches || matches.length === 0) return;
    
    const sectionText = matches[0];
    const wordCount = sectionText.split(/\s+/).length;
    
    // Apply section-specific quality rules
    switch (section.name) {
      case 'summary':
        if (wordCount < 30) {
          score -= 20;
          issues.push("Too brief");
          recommendations.push("Expand to 3-5 sentences highlighting key qualifications");
        } else if (wordCount > 150) {
          score -= 15;
          issues.push("Too verbose");
          recommendations.push("Condense to focus on most relevant qualifications");
        }
        break;
        
      case 'experience':
        const bulletPoints = (sectionText.match(/•|\-|\*/g) || []).length;
        if (bulletPoints < 3) {
          score -= 15;
          issues.push("Insufficient detail");
          recommendations.push("Add bullets with specific accomplishments for each role");
        }
        
        const actionVerbMatches = ACTION_VERBS.filter(verb => 
          new RegExp(`\\b${verb}\\b`, 'i').test(sectionText)
        );
        if (actionVerbMatches.length < 3) {
          score -= 15;
          issues.push("Lacks action verbs");
          recommendations.push("Start bullet points with impactful action verbs");
        }
        break;
        
      case 'skills':
        const skillPoints = (sectionText.match(/,|•|\-|\*|\n/g) || []).length;
        if (skillPoints < 5) {
          score -= 20;
          issues.push("Limited skills listed");
          recommendations.push("Expand your skills section with both technical and soft skills");
        }
        break;
        
      case 'education':
        const hasYears = /\b(19|20)\d{2}\b/.test(sectionText);
        if (!hasYears) {
          score -= 10;
          issues.push("Missing graduation years");
          recommendations.push("Include graduation years for each degree");
        }
        break;
    }
    
    // Default checks for all sections
    if (wordCount < 10 && section.name !== 'contact') {
      score -= 25;
      issues.push("Section is too short");
      recommendations.push("Expand this section with more detailed information");
    }
    
    results.push({
      name: section.name,
      score,
      issues,
      recommendations,
      wordCount
    });
  });
  
  return results;
}

/**
 * Analyzes CV length and provides appropriate feedback
 */
function analyzeCVLength(text: string): { issue?: string; recommendation?: string; penalty: number } {
  const wordCount = text.split(/\s+/).length;
  
  if (wordCount < 200) {
    return {
      issue: "CV is too short",
      recommendation: "Expand your CV with more detailed information about your experience and skills",
      penalty: 15
    };
  }
  
  if (wordCount > 1000) {
    return {
      issue: "CV may be too lengthy",
      recommendation: "Consider condensing your CV to focus on the most relevant and recent experience",
      penalty: 5
    };
  }
  
  return { penalty: 0 };
}
