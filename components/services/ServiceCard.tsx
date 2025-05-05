"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper Components
export const ChevronDown = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ServiceCard = ({ service, color = "blue" }) => {
  const colorStyles = {
    blue: "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30",
    green: "bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900/30",
    amber: "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30",
    purple: "bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-900/30",
    indigo: "bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-900/30",
    cyan: "bg-cyan-50 border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-900/30",
  };
  
  const iconColorStyles = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40",
    green: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40",
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40",
    cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/40",
  };
  
  const checkColorStyles = {
    blue: "text-blue-500 dark:text-blue-400",
    green: "text-green-500 dark:text-green-400",
    amber: "text-amber-500 dark:text-amber-400",
    purple: "text-purple-500 dark:text-purple-400",
    indigo: "text-indigo-500 dark:text-indigo-400",
    cyan: "text-cyan-500 dark:text-cyan-400",
  };
  
  const [showPackages, setShowPackages] = useState(false);
  
  return (
    <Card className={cn(
      "h-full border-2 hover:shadow-lg transition-all duration-300 relative overflow-hidden",
      colorStyles[color]
    )}>
      {service.badge && (
        <Badge 
          variant="default" 
          className="absolute top-3 right-3 z-10 bg-amber-600 hover:bg-amber-600"
        >
          {service.badge}
        </Badge>
      )}

      {/* Service Image */}
      <div className="w-full h-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
        {service.image && (
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute bottom-4 left-4 z-20">
          <div className={cn(
            "p-2 rounded-full w-10 h-10 flex items-center justify-center",
            iconColorStyles[color]
          )}>
            <service.icon className="h-5 w-5" />
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{service.title}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="space-y-3">
          {service.features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
              <CheckCircle className={cn(
                "h-5 w-5 flex-shrink-0 mt-0.5",
                checkColorStyles[color]
              )} />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Packages Section (if available) */}
        {service.packages && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPackages(!showPackages)}
              className={cn(
                "w-full border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
                showPackages && "bg-blue-50 dark:bg-blue-900/30"
              )}
            >
              {showPackages ? "Hide Packages" : "View Available Packages"}
              {showPackages ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
            
            {showPackages && (
              <div className="mt-4 space-y-4">
                {service.packages.map((pkg, idx) => (
                  <div 
                    key={idx} 
                    className="border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 bg-white/80 dark:bg-gray-900/80"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300">
                        {pkg.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {pkg.duration}
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      {pkg.features.map((feature, fidx) => (
                        <div key={fidx} className="flex gap-2 items-start">
                          <Check className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 pb-4">
        <Button
          variant="outline"
          className={cn(
            "w-full border-2",
            color === "blue" && "border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30",
            color === "green" && "border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30",
            color === "amber" && "border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30",
            color === "purple" && "border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30",
            color === "indigo" && "border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
            color === "cyan" && "border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/30",
          )}
        >
          Learn More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;