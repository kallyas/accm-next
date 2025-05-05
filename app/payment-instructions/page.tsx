"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SmartphoneIcon,
  LandmarkIcon,
  GlobeIcon,
  DollarSignIcon,
  CopyIcon,
  CheckIcon,
  InfoIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function PaymentInstructionsPage() {
  const [activeCopyStates, setActiveCopyStates] = useState<Record<string, boolean>>({});

  // Function to handle copying to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setActiveCopyStates({ ...activeCopyStates, [id]: true });
    setTimeout(() => {
      setActiveCopyStates({ ...activeCopyStates, [id]: false });
    }, 2000);
  };

  // Animation variants for staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="py-10">
      {/* Hero Section */}
      <section className="relative mb-16 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90 z-10" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-20 py-16 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Instructions</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Choose your preferred payment method to complete your transaction securely.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Payment Methods Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-1.5">
              <TabsTrigger 
                value="mobile" 
                className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-green-600/20 dark:data-[state=active]:from-green-500/30 dark:data-[state=active]:to-green-600/30"
              >
                <div className="flex items-center gap-2 py-2">
                  <SmartphoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span>Mobile Money</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="bank" 
                className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-blue-600/20 dark:data-[state=active]:from-blue-500/30 dark:data-[state=active]:to-blue-600/30"
              >
                <div className="flex items-center gap-2 py-2">
                  <LandmarkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Bank Transfer</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="international" 
                className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-purple-600/20 dark:data-[state=active]:from-purple-500/30 dark:data-[state=active]:to-purple-600/30"
              >
                <div className="flex items-center gap-2 py-2">
                  <DollarSignIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span>International</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            {/* Mobile Money Content */}
            <TabsContent value="mobile">
              <motion.div variants={itemVariants}>
                <Card className="border-green-100 dark:border-green-900/50 overflow-hidden shadow-lg">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 w-full"></div>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                        <SmartphoneIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Mobile Money</CardTitle>
                        <CardDescription>Most Preferred Method in Uganda</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border border-green-200 dark:border-green-800/30">
                      <p className="text-green-700 dark:text-green-300 font-medium mb-2 text-sm uppercase tracking-wide">Send Payment To:</p>
                      
                      <div className="space-y-4">
                        <PaymentDetail 
                          label="Phone Number" 
                          value="+256752206865" 
                          color="green"
                          isCopied={activeCopyStates['mobile-phone']}
                          onCopy={() => handleCopy('+256752206865', 'mobile-phone')}
                        />
                        
                        <PaymentDetail 
                          label="Account Name" 
                          value="Abel Wilson Walekhwa" 
                          color="green"
                          isCopied={activeCopyStates['mobile-name']}
                          onCopy={() => handleCopy('Abel Wilson Walekhwa', 'mobile-name')}
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <div className="flex gap-3">
                        <InfoIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-800 dark:text-amber-300 text-sm">
                            After sending money, please save the transaction reference number. You'll need it to confirm your payment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-green-100 dark:border-green-900/30 px-6 py-4 bg-green-50/50 dark:bg-green-900/10">
                    <div className="text-sm text-green-700 dark:text-green-300 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>Instant confirmation</span>
                    </div>
                    <Button variant="outline" className="border-green-200 hover:bg-green-100 text-green-700 dark:border-green-800 dark:hover:bg-green-900/30 dark:text-green-300" asChild>
                      <Link href="/dashboard/billing">
                        <span>Confirm Payment</span>
                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Bank Transfer Content */}
            <TabsContent value="bank">
              <motion.div variants={itemVariants}>
                <Card className="border-blue-100 dark:border-blue-900/50 overflow-hidden shadow-lg">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <LandmarkIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Bank Transfer</CardTitle>
                        <CardDescription>Local Bank Transfer in Uganda</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800/30">
                      <p className="text-blue-700 dark:text-blue-300 font-medium mb-4 text-sm uppercase tracking-wide">Bank Account Details:</p>
                      
                      <div className="space-y-4">
                        <PaymentDetail 
                          label="Bank Name" 
                          value="Centenary Rural Development Bank" 
                          color="blue"
                          isCopied={activeCopyStates['bank-name']}
                          onCopy={() => handleCopy('Centenary Rural Development Bank', 'bank-name')}
                        />
                        
                        <PaymentDetail 
                          label="Account Name" 
                          value="AFRICAN CENTER FOR CAREER MENTORSHIP" 
                          color="blue"
                          isCopied={activeCopyStates['bank-account-name']}
                          onCopy={() => handleCopy('AFRICAN CENTER FOR CAREER MENTORSHIP', 'bank-account-name')}
                        />
                        
                        <PaymentDetail 
                          label="Account Number" 
                          value="3203652885" 
                          color="blue"
                          isCopied={activeCopyStates['bank-account-number']}
                          onCopy={() => handleCopy('3203652885', 'bank-account-number')}
                        />
                        
                        <PaymentDetail 
                          label="Branch" 
                          value="Mbale" 
                          color="blue"
                          isCopied={activeCopyStates['bank-branch']}
                          onCopy={() => handleCopy('Mbale', 'bank-branch')}
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <div className="flex gap-3">
                        <InfoIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-800 dark:text-amber-300 text-sm">
                            Please note that bank transfers may take 1-2 business days to be processed. Include your name as reference.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-blue-100 dark:border-blue-900/30 px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10">
                    <div className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>1-2 business days</span>
                    </div>
                    <Button variant="outline" className="border-blue-200 hover:bg-blue-100 text-blue-700 dark:border-blue-800 dark:hover:bg-blue-900/30 dark:text-blue-300" asChild>
                      <Link href="/dashboard/billing">
                        <span>Upload Receipt</span>
                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* International Transfer Content */}
            <TabsContent value="international">
              <motion.div variants={itemVariants}>
                <Card className="border-purple-100 dark:border-purple-900/50 overflow-hidden shadow-lg">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 w-full"></div>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <DollarSignIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">International Transfer</CardTitle>
                        <CardDescription>US Dollar Account for International Payments</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800/30">
                      <p className="text-purple-700 dark:text-purple-300 font-medium mb-4 text-sm uppercase tracking-wide">Account Information:</p>
                      
                      <div className="space-y-4">
                        <PaymentDetail 
                          label="Currency" 
                          value="US Dollar" 
                          color="purple"
                          isCopied={activeCopyStates['intl-currency']}
                          onCopy={() => handleCopy('US Dollar', 'intl-currency')}
                        />
                        
                        <PaymentDetail 
                          label="Beneficiary" 
                          value="ABEL WALEKHWA" 
                          color="purple"
                          isCopied={activeCopyStates['intl-beneficiary']}
                          onCopy={() => handleCopy('ABEL WALEKHWA', 'intl-beneficiary')}
                        />
                        
                        <PaymentDetail 
                          label="Account Number" 
                          value="217535467566" 
                          color="purple"
                          isCopied={activeCopyStates['intl-account-number']}
                          onCopy={() => handleCopy('217535467566', 'intl-account-number')}
                        />
                        
                        <PaymentDetail 
                          label="ACH Routing Number" 
                          value="101019644" 
                          color="purple"
                          isCopied={activeCopyStates['intl-ach']}
                          onCopy={() => handleCopy('101019644', 'intl-ach')}
                        />
                        
                        <PaymentDetail 
                          label="Wire Routing Number" 
                          value="101019644" 
                          color="purple"
                          isCopied={activeCopyStates['intl-wire']}
                          onCopy={() => handleCopy('101019644', 'intl-wire')}
                        />
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800/30">
                        <p className="text-purple-700 dark:text-purple-300 font-medium mb-4 text-sm uppercase tracking-wide">Bank Information:</p>
                        
                        <div className="space-y-4">
                          <PaymentDetail 
                            label="Bank Name" 
                            value="Lead Bank" 
                            color="purple"
                            isCopied={activeCopyStates['intl-bank-name']}
                            onCopy={() => handleCopy('Lead Bank', 'intl-bank-name')}
                          />
                          
                          <div className="relative">
                            <div className="flex justify-between">
                              <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Bank Address:</p>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 px-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                                      onClick={() => handleCopy('1801 Main Street\nKansas City, MO, 64108\nUnited States', 'intl-bank-address')}
                                    >
                                      {activeCopyStates['intl-bank-address'] ? (
                                        <CheckIcon className="h-3 w-3" />
                                      ) : (
                                        <CopyIcon className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      {activeCopyStates['intl-bank-address'] ? 'Copied!' : 'Copy address'}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-purple-700 dark:text-purple-300 pl-3 border-l-2 border-purple-200 dark:border-purple-700 mt-2">
                              <p>1801 Main Street</p>
                              <p>Kansas City, MO, 64108</p>
                              <p>United States</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <div className="flex gap-3">
                        <InfoIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-800 dark:text-amber-300 text-sm">
                            International transfers may take 3-5 business days to process. Please include all required information to avoid delays.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-purple-100 dark:border-purple-900/30 px-6 py-4 bg-purple-50/50 dark:bg-purple-900/10">
                    <div className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>3-5 business days</span>
                    </div>
                    <Button variant="outline" className="border-purple-200 hover:bg-purple-100 text-purple-700 dark:border-purple-800 dark:hover:bg-purple-900/30 dark:text-purple-300" asChild>
                      <Link href="/dashboard/billing">
                        <span>Upload Receipt</span>
                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Additional Information */}
          <motion.div 
            variants={itemVariants}
            className="mt-10 shadow-md rounded-lg overflow-hidden border border-blue-100 dark:border-blue-900/30"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mt-1">
                  <InfoIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-300">Payment Confirmation</h3>
                  <p className="text-muted-foreground">
                    After making the payment, please upload the payment receipt against the Subscription you are paying for. You can do this on the{" "}
                    <Link
                      href="/dashboard/billing"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      Subscriptions Page
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper component for payment details with copy functionality
function PaymentDetail({ 
  label, 
  value, 
  color = "blue",
  isCopied = false,
  onCopy
}: {
  label: string;
  value: string;
  color?: "green" | "blue" | "purple";
  isCopied?: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="relative">
      <div className="flex justify-between">
        <p className={cn(
          "text-sm font-medium",
          color === "green" && "text-green-700 dark:text-green-300",
          color === "blue" && "text-blue-700 dark:text-blue-300",
          color === "purple" && "text-purple-700 dark:text-purple-300"
        )}>
          {label}:
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-6 px-2 hover:bg-transparent",
                  color === "green" && "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300",
                  color === "blue" && "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300", 
                  color === "purple" && "text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                )}
                onClick={onCopy}
              >
                {isCopied ? (
                  <CheckIcon className="h-3 w-3" />
                ) : (
                  <CopyIcon className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{isCopied ? 'Copied!' : 'Copy to clipboard'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className={cn(
        "text-base font-medium mt-1",
        color === "green" && "text-green-900 dark:text-green-50",
        color === "blue" && "text-blue-900 dark:text-blue-50",
        color === "purple" && "text-purple-900 dark:text-purple-50"
      )}>
        {value}
      </p>
    </div>
  );
}