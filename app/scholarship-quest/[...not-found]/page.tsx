// app/scholarship-quest/[...not-found]/page.tsx

import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  GraduationCap, 
  Award,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ScholarshipNotFound() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
          <GraduationCap className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Scholarship Resource Not Found
        </h1>
        <p className="text-xl mb-6 text-muted-foreground">
          We couldn't find the scholarship resource you're looking for.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-md mb-12">
        <h2 className="text-xl font-semibold mb-4">Popular Scholarship Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/scholarship-quest">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Scholarship Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete your academic profile to find matching scholarships
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/scholarship-quest/opportunities">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Scholarship Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse available scholarships and funding options
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/scholarship-quest/global-programs">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Global Programs</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore international scholarship programs and exchanges
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/scholarship-quest/resources">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Academic Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Get tips and guidance for successful applications
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-6">Need More Help?</h2>
        <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/contact">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}