// app/scholarship-quest/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { GraduationCap, Award, BookOpen, Sparkles } from "lucide-react";
import { AcademicQuestionnaire } from "@/components/scholarship-quest-game";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scholarship Quest | African Centre For Career Mentorship",
  description: "Discover scholarship opportunities by completing your academic profile assessment",
  keywords: "scholarship assessment, graduate scholarships, academic funding, study abroad, african scholarships",
};

export default async function ScholarshipQuestPage() {
  const session = await getServerSession(authOptions);

  // Fetch user data and scholarship assessment status if logged in
  let user = null;
  let hasStartedAssessment = false;
  
  if (session?.user?.id) {
    user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { scholarshipAssessment: true },
    });
    
    hasStartedAssessment = user?.scholarshipAssessment ? true : false;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg -z-10" />
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                <Sparkles className="w-4 h-4 mr-2" />
                Academic Growth Journey
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Scholarship Quest
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Discover your scholarship opportunities, receive personalized recommendations, and access guidance for successful applications.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  asChild
                >
                  <Link href="#assessment">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Start Assessment
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link href="/scholarship-quest/opportunities">
                    <Award className="w-4 h-4 mr-2" />
                    Browse Scholarships
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl rounded-2xl" />
                <div className="bg-background rounded-xl p-5 relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/40 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-3">
                        <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-blue-700 dark:text-blue-400">Global Scholarships</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Access top funded programs worldwide
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-950/40 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 mb-3">
                        <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-purple-700 dark:text-purple-400">Academic Resources</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Expert guides and application tips
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 dark:bg-indigo-950/40 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-3">
                        <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="font-semibold text-indigo-700 dark:text-indigo-400">Personalized Matching</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Find programs that fit your profile
                      </p>
                    </div>
                    
                    <div className="bg-cyan-50 dark:bg-cyan-950/40 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-900/50 mb-3">
                        <GraduationCap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <h3 className="font-semibold text-cyan-700 dark:text-cyan-400">Application Support</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Guidance through every step
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-900/30 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-blue-200 dark:bg-blue-900/30 blur-xl" />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-12 mb-12 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Scholarship Quest Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple four-step process to help you discover and secure academic funding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 mb-4">
                  <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">1</span>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 dark:bg-blue-800" />
              </div>
              <h3 className="font-semibold mb-2">Complete Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Provide details about your academic background and career goals
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 mb-4">
                  <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">2</span>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-purple-200 dark:bg-purple-800" />
              </div>
              <h3 className="font-semibold mb-2">Get Matched</h3>
              <p className="text-sm text-muted-foreground">
                Receive personalized scholarship recommendations based on your profile
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 mb-4">
                  <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">3</span>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-indigo-200 dark:bg-indigo-800" />
              </div>
              <h3 className="font-semibold mb-2">Access Resources</h3>
              <p className="text-sm text-muted-foreground">
                Utilize guides and templates to prepare strong applications
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/50 mb-4">
                <span className="text-2xl font-bold text-green-700 dark:text-green-400">4</span>
              </div>
              <h3 className="font-semibold mb-2">Apply Successfully</h3>
              <p className="text-sm text-muted-foreground">
                Submit your applications with confidence and track your progress
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Assessment Section */}
      <section id="assessment" className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Academic Assessment</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete your academic profile to receive personalized scholarship recommendations
            </p>
          </div>

          <div className="mb-10">
            <AcademicQuestionnaire />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from scholars who found their opportunities through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  NA
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Ngozi Adichie</h3>
                  <p className="text-sm text-muted-foreground">Fulbright Scholar, Nigeria</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The assessment helped me identify scholarships I wouldn't have found otherwise. The application resources were invaluable for preparing my materials."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  KM
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Kwame Mensah</h3>
                  <p className="text-sm text-muted-foreground">Commonwealth Scholar, Ghana</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "From questionnaire to acceptance, the platform guided me through every step. I'm now pursuing my Master's in London with full funding."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Common questions about the scholarship assessment process
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-2">How long does the assessment take?</h3>
              <p className="text-muted-foreground">
                The assessment takes approximately 15-20 minutes to complete. You can save your progress and return later.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-2">What types of scholarships can I find?</h3>
              <p className="text-muted-foreground">
                Our platform includes a diverse range of scholarships, including merit-based, need-based, field-specific, and country-specific opportunities.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-2">Is my information kept private?</h3>
              <p className="text-muted-foreground">
                Yes, your personal information is secure and only used to match you with relevant scholarship opportunities. We never share your details without permission.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-2">Can I get help with my application?</h3>
              <p className="text-muted-foreground">
                Absolutely! We provide resources, templates, and guides to help you prepare competitive applications. Premium members can also access personalized application reviews.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Begin Your Scholarship Journey Today</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Take the first step toward finding the perfect academic funding opportunity for your future
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-50"
            asChild
          >
            <a href="#assessment">
              <GraduationCap className="w-5 h-5 mr-2" />
              Start Your Assessment
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}