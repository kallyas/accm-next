"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Briefcase, 
  GraduationCap, 
  Target, 
  Heart,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CareerMapLayoutProps {
  children: React.ReactNode;
}

export default function CareerMapLayout({ children }: CareerMapLayoutProps) {
  const [scrollY, setScrollY] = useState(0);
  const [particlesVisible, setParticlesVisible] = useState(true);
  const pathname = usePathname();
  
  // Handle scroll events for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Hide particles when scrolled down to improve performance
      if (window.scrollY > 1000 && particlesVisible) {
        setParticlesVisible(false);
      } else if (window.scrollY <= 1000 && !particlesVisible) {
        setParticlesVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [particlesVisible]);

  return (
    <div className="relative">
      {/* Career Map specific background and decorative elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Gradient background overlay - additional to root layout background */}
        <div 
          className="absolute inset-0 bg-gradient-primary opacity-5"
          style={{ 
            transform: `translateY(${scrollY * 0.05}px)` 
          }}
        />
        
        {/* Animated particles/dots (only shown when near top of page) */}
        {particlesVisible && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="particles-container">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/20 dark:bg-primary/10"
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: Math.random() * 100 + "%",
                    opacity: Math.random() * 0.5 + 0.2
                  }}
                  animate={{
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
                  }}
                  transition={{
                    duration: Math.random() * 50 + 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear"
                  }}
                  style={{
                    width: `${Math.random() * 20 + 5}px`,
                    height: `${Math.random() * 20 + 5}px`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section Title */}
      <div className="mb-12 text-center">
        <div className="inline-block">
          <motion.div 
            className="text-center relative mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient-primary mb-4">Career Mapping</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover your ideal career path with our comprehensive assessment and personalized recommendations
          </p>
        </div>
      </div>

      {/* Floating Icons - Career Map specific decoration */}
      <div className="fixed bottom-10 right-10 hidden lg:block pointer-events-none z-0">
        <div className="relative">
          <motion.div 
            className="absolute -top-16 -left-16 w-12 h-12 rounded-lg bg-brand-blue/20 flex items-center justify-center"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            <Briefcase className="w-6 h-6 text-brand-blue" />
          </motion.div>
          
          <motion.div 
            className="absolute -top-32 left-12 w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity,
              repeatType: "mirror",
              delay: 1
            }}
          >
            <GraduationCap className="w-5 h-5 text-success" />
          </motion.div>
          
          <motion.div 
            className="absolute -top-20 left-36 w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 15, 0],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "mirror",
              delay: 2
            }}
          >
            <Target className="w-4 h-4 text-warning" />
          </motion.div>
          
          <motion.div 
            className="absolute -top-10 left-24 w-9 h-9 rounded-lg bg-brand-purple/20 flex items-center justify-center"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -10, 0],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "mirror",
              delay: 3
            }}
          >
            <Heart className="w-5 h-5 text-brand-purple" />
          </motion.div>
        </div>
      </div>

      {/* Subtle left decoration - Career Map specific */}
      <div className="fixed top-1/4 left-4 hidden xl:block pointer-events-none z-0">
        <motion.div 
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-1 h-24 rounded-full bg-brand-blue/30"></div>
          <div className="w-1 h-16 rounded-full bg-brand-teal/30"></div>
          <div className="w-1 h-36 rounded-full bg-brand-purple/30"></div>
        </motion.div>
      </div>

      {/* Content wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Career Map specific "in page" decoration - bottom glow */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-primary opacity-30 blur-3xl"></div>
      </div>
    </div>
  );
}