"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  CreditCard,
  Shield,
  Zap,
  RefreshCw,
  Sparkles,
  Calendar,
  UserPlus,
  FileText,
  Upload,
  ChevronRight,
  ThumbsUp,
  Award
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  services: string[];
  features: string[];
  popular?: boolean;
};

async function getPlans(): Promise<Plan[]> {
  const res = await fetch("/api/plans", {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch plans");
  }

  const data = await res.json();

  return data;
}

interface SubscriptionResponse {
  message: string;
}

interface SubscriptionError {
  error: string;
}

const subscribeToPlan = async (
  formData: FormData
): Promise<SubscriptionResponse> => {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData: SubscriptionError = await response.json();
    throw new Error(errorData.error || "Failed to subscribe to plan");
  }

  return response.json();
};

export const useSubscribeMutation = (onSuccess: (open: boolean) => void) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: (data) => {
      toast({
        title: "Subscription Submitted",
        description:
          "Your subscription request has been submitted for approval.",
      });
      setSelectedPlan(null);
      setPaymentProof(null);
      onSuccess(false);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = () => {
    if (!selectedPlan || !paymentProof) {
      toast({
        title: "Error",
        description: "Please select a plan and upload payment proof.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("planId", selectedPlan.id);
    formData.append("paymentProof", paymentProof);
    mutation.mutate(formData);
  };

  return {
    handleSubscribe,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    selectedPlan,
    setSelectedPlan,
    paymentProof,
    setPaymentProof,
  };
};

export function SubscribePlan() {
  const [open, setOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<"monthly" | "yearly">("monthly");
  const { data: session } = useSession();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isHoveredPlan, setIsHoveredPlan] = useState<string | null>(null);

  const {
    data: plans,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
    retry: 3,
    refetchOnWindowFocus: true,
  });

  const {
    handleSubscribe,
    isLoading: isSubscribing,
    selectedPlan: subscriptionPlan,
    setSelectedPlan: setSubscriptionPlan,
    paymentProof: subscriptionPaymentProof,
    setPaymentProof: setSubscriptionPaymentProof,
  } = useSubscribeMutation(setOpen);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubscriptionPaymentProof(e.target.files[0]);
      setUploadSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Calculate yearly discount
  const calculateYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 12 * 0.85).toFixed(2);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading available plans...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load plans. Please try again.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="ml-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!plans || plans.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-lg border-muted-foreground/30">
        <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No Plans Available</h3>
        <p className="text-muted-foreground mb-6">No subscription plans are available at the moment.</p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="mx-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Check Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Billing Cycle Toggle */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div className="relative">
          <div className="flex items-center space-x-2 p-1 border rounded-lg">
            <div 
              className={cn(
                "absolute top-0 bottom-0 w-1/2 rounded-md bg-gradient-to-r from-blue-600/10 to-teal-500/10 dark:from-blue-600/20 dark:to-teal-500/20 transition-transform duration-300",
                selectedCycle === "yearly" && "translate-x-full"
              )}
            ></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCycle("monthly")}
              className={cn(
                "relative z-10 rounded-md px-4",
                selectedCycle === "monthly" && "text-primary font-medium"
              )}
            >
              Monthly
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCycle("yearly")}
              className={cn(
                "relative z-10 rounded-md px-4",
                selectedCycle === "yearly" && "text-primary font-medium"
              )}
            >
              <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
              Yearly (Save 15%)
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-2 ml-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Plans
        </Button>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div 
            key={plan.id} 
            variants={itemVariants}
            onMouseEnter={() => setIsHoveredPlan(plan.id)}
            onMouseLeave={() => setIsHoveredPlan(null)}
          >
            <Card
              className={cn(
                "border-2 transition-all duration-300 h-full relative overflow-hidden",
                subscriptionPlan?.id === plan.id 
                  ? "border-primary shadow-lg shadow-primary/10 dark:shadow-primary/5" 
                  : isHoveredPlan === plan.id
                  ? "border-primary/50 shadow-md"
                  : "hover:border-primary/30 hover:shadow-sm"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold py-1 px-3 transform rotate-45 translate-x-6 translate-y-1">
                    POPULAR
                  </div>
                </div>
              )}
              
              {/* Card header */}
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {plan.description}
                    </CardDescription>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                {/* Price display */}
                <div className="mt-4 flex items-center gap-1">
                  <span className="text-3xl font-bold">
                    ${selectedCycle === "yearly"
                      ? calculateYearlyPrice(plan.price)
                      : plan.price.toFixed(2)}
                  </span>
                  <div className="flex flex-col items-start ml-1">
                    <span className="text-sm text-muted-foreground">
                      /{selectedCycle === "yearly" ? "year" : "month"}
                    </span>
                    {selectedCycle === "yearly" && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Save 15%
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Features list */}
              <CardContent className="pb-4">
                <div className="space-y-3">
                  {plan.services.map((service, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Actions */}
              <CardFooter className="flex flex-col space-y-3 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800/80"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-xl">
                        <Shield className="w-5 h-5 mr-2 text-primary" />
                        {plan.name} Plan Details
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        {plan.description}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* Price section */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <div className="flex items-end">
                              <span className="text-2xl font-bold mr-1">
                                ${selectedCycle === "yearly"
                                  ? calculateYearlyPrice(plan.price)
                                  : plan.price.toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground pb-0.5">
                                /{selectedCycle === "yearly" ? "year" : "month"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Monthly</span>
                            <Switch 
                              checked={selectedCycle === "yearly"}
                              onCheckedChange={(checked) => 
                                setSelectedCycle(checked ? "yearly" : "monthly")
                              }
                            />
                            <span className="text-sm">Yearly</span>
                          </div>
                        </div>
                        
                        {selectedCycle === "yearly" && (
                          <div className="mt-2 text-sm flex items-center text-green-600 dark:text-green-400">
                            <Award className="h-4 w-4 mr-1" />
                            <span>You save ${(plan.price * 12 * 0.15).toFixed(2)} with yearly billing</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Services section */}
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-primary" />
                          Included Services
                        </h4>
                        <ul className="space-y-2">
                          {plan.services.map((service, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Features section */}
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          Additional Features
                        </h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Duration */}
                      <div className="flex items-center text-sm text-muted-foreground border-t pt-4">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          Duration: {plan.duration} {plan.duration === 1 ? "month" : "months"}
                        </span>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {session ? (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                        onClick={() => {
                          setSubscriptionPlan(plan);
                          setOpen(true);
                        }}
                      >
                        Subscribe Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-xl">Subscribe to {plan.name}</DialogTitle>
                        <DialogDescription>
                          Please complete your payment and upload proof to activate your subscription.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        {/* Payment amount */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Payment Amount</p>
                          <p className="text-2xl font-bold">
                            ${selectedCycle === "yearly"
                              ? calculateYearlyPrice(plan.price)
                              : plan.price.toFixed(2)}
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                              /{selectedCycle === "yearly" ? "year" : "month"}
                            </span>
                          </p>
                        </div>
                        
                        {/* Payment steps */}
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center">
                            <CreditCard className="w-4 h-4 mr-2 text-primary" />
                            Payment Steps
                          </h4>
                          
                          <ol className="space-y-4">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 mt-0.5">
                                1
                              </div>
                              <div>
                                <p className="font-medium">Make a payment</p>
                                <p className="text-sm text-muted-foreground">
                                  Pay using your preferred method from our 
                                  <Button 
                                    variant="link" 
                                    className="p-0 h-auto text-primary font-normal"
                                    asChild
                                  >
                                    <Link href="/payment-instructions"> payment instructions page</Link>
                                  </Button>
                                </p>
                              </div>
                            </li>
                            
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 mt-0.5">
                                2
                              </div>
                              <div>
                                <p className="font-medium">Upload payment proof</p>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Upload a screenshot or receipt of your payment
                                </p>
                                
                                <div className="relative">
                                  <Label 
                                    htmlFor="payment-proof" 
                                    className={cn(
                                      "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer",
                                      uploadSuccess 
                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                                        : "border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    )}
                                  >
                                    {uploadSuccess ? (
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ThumbsUp className="h-8 w-8 text-green-500 mb-2" />
                                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                          File uploaded successfully
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          PNG, JPG or PDF (max. 5MB)
                                        </p>
                                      </div>
                                    )}
                                    <Input
                                      id="payment-proof"
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={handleFileChange}
                                      className="hidden"
                                    />
                                  </Label>
                                </div>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={isSubscribing || !subscriptionPaymentProof}
                          onClick={handleSubscribe}
                          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                        >
                          {isSubscribing
                            ? "Processing..."
                            : "Complete Subscription"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600">
                      Login to Subscribe
                      <UserPlus className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Help Section */}
      <motion.div 
        variants={itemVariants}
        className="mt-12 rounded-xl overflow-hidden shadow-sm border border-blue-100 dark:border-blue-900/50"
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                Need help choosing?
              </h4>
              <p className="text-muted-foreground mb-4">
                Our team can help you find the perfect plan for your needs. Get in touch for a personalized recommendation or to discuss custom packages.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  asChild
                  variant="outline" 
                  className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <Link href="/contact">
                    Contact Support
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  <Link href="/consultation">
                    Book a Consultation
                    <Calendar className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}