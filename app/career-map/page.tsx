"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CareerMapGame } from "@/components/career-map-game";
import { 
  Briefcase, 
  GraduationCap, 
  Target, 
  Lightbulb, 
  MoveUp, 
  BarChart,
  Users,
  Clock,
  UserCheck,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function CareerMapPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/10 border-primary/20">
            Free Career Assessment Tool
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-gradient-primary">
            Discover Your Ideal Career Path
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take our comprehensive assessment to find careers that match your unique skills, 
            interests, and aspirations.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center my-8">
            <motion.div 
              className="p-4 glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="mx-auto w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="font-medium">10 Minutes</h3>
              <p className="text-sm text-muted-foreground">Quick assessment</p>
            </motion.div>
            
            <motion.div 
              className="p-4 glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="mx-auto w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-3">
                <Briefcase className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-medium">30+ Careers</h3>
              <p className="text-sm text-muted-foreground">Matched to your profile</p>
            </motion.div>
            
            <motion.div 
              className="p-4 glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="mx-auto w-12 h-12 bg-brand-purple/20 rounded-full flex items-center justify-center mb-3">
                <BarChart className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="font-medium">Personalized</h3>
              <p className="text-sm text-muted-foreground">Detailed insights</p>
            </motion.div>
          </div>
          
          <Button size="lg" className="btn-gradient animate-pulse-slow" onClick={() => {
            const assessmentElement = document.getElementById('assessment');
            if (assessmentElement) {
              assessmentElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            Start Your Assessment
            <MoveUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold gradient-text">Why Use CareerMap?</h2>
            <p className="text-muted-foreground">Our comprehensive assessment goes beyond basic interests</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-t-4 glass-card" style={{ borderTopColor: "hsl(var(--brand-blue))" }}>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-brand-blue/20 rounded-full w-12 h-12 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-lg font-heading font-medium mb-2">Educational Guidance</h3>
                <p className="text-muted-foreground text-sm">
                  Get clear pathways and educational requirements for each career match, helping you make 
                  informed decisions about your learning journey.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 glass-card" style={{ borderTopColor: "hsl(var(--success))" }}>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-success/20 rounded-full w-12 h-12 flex items-center justify-center">
                  <Target className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-lg font-heading font-medium mb-2">Skills Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Identify your core competencies and discover which careers leverage your 
                  existing strengths while highlighting areas for development.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 glass-card" style={{ borderTopColor: "hsl(var(--brand-purple))" }}>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-brand-purple/20 rounded-full w-12 h-12 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="text-lg font-heading font-medium mb-2">Career Insights</h3>
                <p className="text-muted-foreground text-sm">
                  Access up-to-date information on salary ranges, growth outlook, and industry trends 
                  for each career recommendation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold gradient-text-accent">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to discover your ideal career path</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-md">
                1
              </div>
              <CardContent className="p-6 pt-8">
                <div className="mb-4 p-3 bg-accent/30 rounded-full w-12 h-12 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-brand-teal" />
                </div>
                <h3 className="text-lg font-heading font-medium mb-2">Complete the Assessment</h3>
                <p className="text-muted-foreground text-sm">
                  Answer questions about your background, skills, interests, and work style preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-md">
                2
              </div>
              <CardContent className="p-6 pt-8">
                <div className="mb-4 p-3 bg-accent/30 rounded-full w-12 h-12 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="text-lg font-heading font-medium mb-2">AI Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Our algorithm analyzes your responses to identify suitable career matches.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-md">
                3
              </div>
              <CardContent className="p-6 pt-8">
                <div className="mb-4 p-3 bg-accent/30 rounded-full w-12 h-12 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="text-lg font-heading font-medium mb-2">Get Personalized Results</h3>
                <p className="text-muted-foreground text-sm">
                  Receive detailed career matches with compatibility scores and insights.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-md">
                4
              </div>
              <CardContent className="p-6 pt-8">
                <div className="mb-4 p-3 bg-accent/30 rounded-full w-12 h-12 flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-lg font-heading font-medium mb-2">Take Action</h3>
                <p className="text-muted-foreground text-sm">
                  Use the provided resources and guidance to explore your career options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold gradient-text">Success Stories</h2>
            <p className="text-muted-foreground">See how CareerMap has helped others find their path</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-blue/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">Sarah K.</h3>
                      <Badge variant="outline" className="ml-2 bg-success/10 text-success border-success/20">
                        Software Engineer
                      </Badge>
                      </div>
                    <p className="text-muted-foreground text-sm">
                      "The assessment was so detailed! It matched me with roles I had never considered 
                      but that aligned perfectly with my skills. I'm now in a job I love."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-teal/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-brand-teal" />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">Alex M.</h3>
                      <Badge variant="outline" className="ml-2 bg-brand-blue/10 text-brand-blue border-brand-blue/20">
                        UX Researcher
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      "After feeling stuck in my career, CareerMap showed me options that combined my 
                      analytical skills with my passion for human behavior. It was eye-opening!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" className="gradient-border">
              Read More Success Stories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Assessment Section */}
        <div id="assessment" className="scroll-mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold gradient-text">Start Your Career Assessment</h2>
            <p className="text-muted-foreground">
              Take approximately 10 minutes to discover your ideal career path
            </p>
          </div>
          
          <CareerMapGame />
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-center mb-8 gradient-text-accent">Frequently Asked Questions</h2>
          
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="about" className="flex-1">About the Assessment</TabsTrigger>
              <TabsTrigger value="privacy" className="flex-1">Privacy & Data</TabsTrigger>
              <TabsTrigger value="results" className="flex-1">Understanding Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-4">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">How does the assessment work?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our assessment uses a proprietary algorithm that analyzes your responses across multiple 
                    dimensions including skills, interests, values, and work preferences. We then match your 
                    profile with careers from our extensive database.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">How long will it take to complete?</h3>
                  <p className="text-sm text-muted-foreground">
                    Most users complete the assessment in 8-12 minutes. You can save your progress and 
                    return later if needed.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">Are the results accurate?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our assessment has been validated through research with thousands of users. However, 
                    results should be seen as guidance rather than absolute answers. They're designed to 
                    expand your awareness of compatible career options.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">How is my data protected?</h3>
                  <p className="text-sm text-muted-foreground">
                    We take data privacy seriously. Your assessment data is encrypted and stored securely. 
                    We never sell your personal information to third parties. You can request deletion of 
                    your data at any time.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">Do I need to create an account?</h3>
                  <p className="text-sm text-muted-foreground">
                    An account is not required to take the assessment, but creating one allows you to 
                    save your results for future reference and receive personalized career insights.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">How should I interpret my results?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your results show careers that align with your unique profile, ranked by match percentage. 
                    The detailed breakdown explains why each career matches your responses and provides 
                    information about education paths, skills, and career outlook.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">Can I retake the assessment?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can retake the assessment as many times as you want. This can be helpful as 
                    your interests and priorities evolve over time.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="glass-card max-w-3xl mx-auto p-8">
            <CardContent className="space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold gradient-text">Ready to Discover Your Career Path?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Take the first step toward finding a fulfilling career that matches your unique 
                skills, interests, and aspirations.
              </p>
              <Button className="btn-gradient text-lg px-8 py-6" onClick={() => {
                const assessmentElement = document.getElementById('assessment');
                if (assessmentElement) {
                  assessmentElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                Start Your Assessment Now
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Disclaimer */}
        <Card className="mt-16 p-6 text-sm text-muted-foreground glass-card">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-semibold text-base mb-4">Important Information</h2>
            <div className="space-y-3">
              <p>
                CareerMap is designed to provide general guidance and suggestions based on your responses. 
                The career matches and recommendations are generated through an algorithm that analyzes 
                your answers against our career database.
              </p>
              <p>
                Please note that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The results are meant to be exploratory and should not be considered as definitive 
                  career advice. Your career choices should be made after careful consideration of various 
                  factors, including market conditions, personal circumstances, and professional guidance.
                </li>
                <li>
                  Career information, including salary ranges and growth outlooks, is based on general 
                  data and may vary significantly by location, experience level, and market conditions.
                </li>
                <li>
                  This tool is not a substitute for professional career counseling. We encourage you to 
                  consult with career advisors, industry professionals, and conduct thorough research 
                  before making career decisions.
                </li>
                <li>
                  Your responses are used solely for generating career recommendations and, if you choose 
                  to save them, for providing personalized insights in future sessions.
                </li>
              </ul>
              <p className="text-xs mt-4">
                © {new Date().getFullYear()} CareerMap. This tool is provided "as is" without any warranties. 
                While we strive to maintain accurate and up-to-date information, we cannot guarantee the 
                completeness or accuracy of all career data and recommendations.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}