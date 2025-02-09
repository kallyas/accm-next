import { CareerMapGame } from "@/components/career-map-game";
import React from "react";
import { Card } from "@/components/ui/card";

export default function CareerMapPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to CareerMap
      </h1>
      <p className="text-center mb-8">
        Discover your potential career path with our free CareerMap game!
      </p>
      <CareerMapGame />
      
      <Card className="mt-8 p-6 text-sm text-muted-foreground">
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
  );
}