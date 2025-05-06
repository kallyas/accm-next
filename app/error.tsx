// app/error.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  AlertCircle, 
  Home, 
  ArrowLeft, 
  RefreshCw,
  MessageSquare,
  Shield,
  SendHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState("");
  
  React.useEffect(() => {
    // Set a friendly error message
    const messages = [
      "Our systems are taking a short mentorship break.",
      "We're experiencing a technical hiccup in our career guidance system.",
      "Our digital mentors need a moment to regroup.",
      "We're facing a small roadblock on your path to success.",
      "Our career guidance algorithms are in a brief meeting.",
      "Our systems need a quick professional development moment.",
    ];
    
    setErrorMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 dark:opacity-3" />
        
        {/* Decorative shapes */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-300/20 dark:bg-red-700/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-orange-300/20 dark:bg-orange-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-300/20 dark:bg-amber-700/10 rounded-full blur-3xl" />
        
        {/* Animated 500 text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-[0.03] pointer-events-none">
          <div className="text-[40rem] font-black text-gray-900 dark:text-gray-100">
            500
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl w-full mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="p-1">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 h-2 w-full rounded-t-xl"></div>
        </div>
        
        <div className="p-6 md:p-12 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -right-2 -bottom-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <Shield className="h-6 w-6 text-orange-500" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Server Error
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {errorMessage}
            </p>
            
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We're working to fix this issue. Please try again in a few moments.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <Button onClick={() => reset()} variant="default" className="w-full sm:w-auto group bg-gradient-to-r from-orange-600 to-red-600">
              <RefreshCw className="h-4 w-4 mr-2 group-hover:animate-spin" />
              Try Again
            </Button>
            
            <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto group">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
            
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-4 rounded-lg"
          >
            <h3 className="font-medium text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Need assistance?
            </h3>
            <p className="text-sm text-amber-600 dark:text-amber-300 mb-4">
              Contact our support team and we'll help get you back on track.
            </p>
            <Button asChild variant="outline" size="sm" className="border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/50">
              <Link href="/contact">
                <SendHorizontal className="h-3 w-3 mr-2" />
                Contact Support
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Error details - only shown in development environment */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 p-4 text-xs border-t border-gray-200 dark:border-gray-700">
          <details className="text-gray-600 dark:text-gray-300">
            <summary className="cursor-pointer font-medium">Developer Error Details</summary>
            <pre className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded overflow-x-auto">
              {error.message}
              {error.stack && (
                <div className="mt-2 text-gray-500 dark:text-gray-400">
                  {error.stack}
                </div>
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}