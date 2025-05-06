// app/not-found.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  AlertTriangle, 
  Home, 
  ArrowLeft, 
  Search, 
  Compass,
  BookOpen,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Custom404Page() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [randomMessage, setRandomMessage] = React.useState("");
  
  React.useEffect(() => {
    // Set a random 404 message
    const messages = [
      "Oops! This page seems to have gone on a career break.",
      "Looks like this page is still exploring its career options.",
      "This page has graduated from our site.",
      "Sorry, this path to success doesn't exist.",
      "This knowledge resource has moved on to better opportunities.",
      "This page is taking a gap year. Try another destination.",
    ];
    
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 dark:opacity-3" />
        
        {/* Decorative shapes */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300/20 dark:bg-blue-700/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-300/20 dark:bg-teal-700/10 rounded-full blur-3xl" />
        
        {/* Animated 404 text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-[0.03] pointer-events-none">
          <div className="text-[40rem] font-black text-gray-900 dark:text-gray-100">
            404
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl w-full mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="p-1">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 w-full rounded-t-xl"></div>
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
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -right-2 -bottom-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <Compass className="h-6 w-6 text-blue-500" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Page Not Found
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {randomMessage}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search for resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              Find your way to these popular destinations
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-blue-800/30 flex flex-col items-center text-center">
                  <Home className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Home</span>
                </div>
              </Link>
              
              <Link href="/career-map">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors hover:bg-purple-100 dark:hover:bg-purple-800/30 flex flex-col items-center text-center">
                  <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Career Map</span>
                </div>
              </Link>
              
              <Link href="/scholarship-quest">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors hover:bg-green-100 dark:hover:bg-green-800/30 flex flex-col items-center text-center">
                  <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Scholarships</span>
                </div>
              </Link>
              
              <Link href="/resources">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg transition-colors hover:bg-amber-100 dark:hover:bg-amber-800/30 flex flex-col items-center text-center">
                  <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400 mb-2" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Resources</span>
                </div>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button variant="outline" onClick={() => router.back()} className="group">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Animated elements */}
      <div className="hidden md:block absolute bottom-12 right-12 opacity-70">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <Compass className="h-12 w-12 text-blue-500 dark:text-blue-400" />
        </motion.div>
      </div>
    </div>
  );
}