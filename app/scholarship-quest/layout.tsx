"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Award, Globe, School, ChevronDown } from "lucide-react";
import Link from "next/link";

interface ScholarshipLayoutProps {
  children: React.ReactNode;
}

export default function ScholarshipLayout({ children }: ScholarshipLayoutProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activePath, setActivePath] = useState("");

  // Handle scroll events for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set active path based on current URL
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background elements specific to scholarship section */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-purple-50/70 dark:from-blue-950/30 dark:via-gray-900 dark:to-purple-950/30"
          style={{ 
            opacity: Math.max(0.7, 1 - (scrollY * 0.001)) 
          }}
        />
        
        {/* Academic-themed decorative elements */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-blue-200/20 dark:bg-blue-800/10 blur-3xl"
          style={{ 
            transform: `translateY(${scrollY * 0.02}px) rotate(${scrollY * 0.02}deg)` 
          }}
        />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-purple-200/20 dark:bg-purple-800/10 blur-3xl"
          style={{ 
            transform: `translateY(${-scrollY * 0.01}px) rotate(${-scrollY * 0.01}deg)` 
          }}
        />
        
        {/* Academic patterns - subtle notebook lines */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                transparent,
                transparent 31px,
                rgba(124, 58, 237, 0.1) 31px,
                rgba(124, 58, 237, 0.1) 32px
              )
            `,
            backgroundSize: '100% 32px',
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        />
      </div>

      {/* Page title section with academic icon */}
      <div className="relative z-10 pt-8 pb-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gradient-primary">Scholarship Quest</h1>
              <p className="text-sm text-muted-foreground">Find your path to academic excellence and funding</p>
            </div>
          </div>
          
          {/* Scholarship section navigation */}
          <nav className="mt-6 flex flex-wrap gap-2">
            <Link 
              href="/scholarship-quest" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/50 flex items-center space-x-2 ${
                activePath === '/scholarship-quest' ? 
                'bg-accent text-accent-foreground' : 
                'text-muted-foreground'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Academic Assessment</span>
            </Link>
            
            <Link 
              disabled
              href="/scholarship-quest/opportunities" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/50 flex items-center space-x-2 disabled ${
                activePath === '/scholarship-quest/opportunities' ? 
                'bg-accent text-accent-foreground' : 
                'text-muted-foreground'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Scholarship Opportunities</span>
            </Link>
            
            <Link 
                disabled
              href="/scholarship-quest/global-programs" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/50 flex items-center space-x-2 ${
                activePath === '/scholarship-quest/global-programs' ? 
                'bg-accent text-accent-foreground' : 
                'text-muted-foreground'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Global Programs</span>
            </Link>
            
            <Link 
                disabled
              href="/scholarship-quest/resources" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/50 flex items-center space-x-2 ${
                activePath === '/scholarship-quest/resources' ? 
                'bg-accent text-accent-foreground' : 
                'text-muted-foreground'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Academic Resources</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Scholarship section inspirational quote */}
      <div className="relative z-10 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <div className="w-1 h-8 bg-blue-500 mr-3 rounded-full"></div>
            <div>
              <p className="text-sm italic text-muted-foreground">
                "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
              </p>
              <p className="text-xs text-muted-foreground mt-1">— Malcolm X</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated education icons - floating graduation hats */}
      <div className="hidden lg:block fixed z-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-8 w-10 h-10 text-blue-500/30 dark:text-blue-400/20"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 5, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <GraduationCap className="w-full h-full" />
        </motion.div>
        
        <motion.div 
          className="absolute top-1/3 right-12 w-8 h-8 text-purple-500/30 dark:text-purple-400/20"
          animate={{ 
            y: [0, -10, 0],
            x: [0, -5, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1
          }}
        >
          <Award className="w-full h-full" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/4 left-16 w-8 h-8 text-indigo-500/30 dark:text-indigo-400/20"
          animate={{ 
            y: [0, -12, 0],
            x: [0, 3, 0],
            rotate: [0, 15, 0],
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "mirror",
            delay: 2
          }}
        >
          <BookOpen className="w-full h-full" />
        </motion.div>
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activePath}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 min-h-screen"
        >
          <div className="container max-w-7xl mx-auto px-4 py-8">
            {children}
          </div>
        </motion.main>
      </AnimatePresence>

      {/* Academic path visual - subtle dashed line */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-px h-1/3 border-l-2 border-dashed border-blue-500/20 dark:border-blue-400/10 z-0 pointer-events-none" />

      {/* "Scroll for more" indicator for longer pages */}
      {scrollY < 100 && (
        <motion.div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground text-sm z-20 pointer-events-none"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            y: [0, 5, 0] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <span className="mb-2">Scroll for more</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      )}
    </div>
  );
}