"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  services: string[];
  features: string[];
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
  const [selectedCycle, setSelectedCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: plans,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
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
    if (e.target.files) {
      setSubscriptionPaymentProof(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center p-8">
        <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">No plans available at the moment.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Check Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-between items-center">
        <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button
            variant={selectedCycle === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCycle("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={selectedCycle === "yearly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCycle("yearly")}
          >
            Yearly (Save 15%)
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Plans
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`border-2 transition-all duration-200 hover:shadow-lg ${
              subscriptionPlan?.id === plan.id
                ? "border-primary"
                : "hover:border-primary/50"
            }`}
          >
            {/* Rest of the card content remains the same */}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {plan.description}
                  </CardDescription>
                </div>
                <BadgeCheck className="w-6 h-6 text-green-500" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  $
                  {selectedCycle === "yearly"
                    ? (plan.price * 12 * 0.85).toFixed(2)
                    : plan.price.toFixed(2)}
                </span>
                <span className="text-gray-500 ml-1">
                  /{selectedCycle === "yearly" ? "yr" : "mo"}
                </span>
                {selectedCycle === "yearly" && (
                  <span className="block text-sm text-green-600 dark:text-green-400 mt-1">
                    Save 15% with yearly billing
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.services.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-primary" />
                      {plan.name} Plan Details
                    </DialogTitle>
                    <DialogDescription>{plan.description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-primary" />
                        Included Services
                      </h4>
                      <ul className="space-y-2">
                        {plan.services.map((service, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        Additional Features
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {session ? (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
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
                      <DialogTitle>Subscribe to {plan.name}</DialogTitle>
                      <DialogDescription>
                        Please upload your payment proof to complete the
                        subscription process.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="payment-proof">Payment Proof</Label>
                        <Input
                          id="payment-proof"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        disabled={isSubscribing}
                        onClick={handleSubscribe}
                        className="w-full sm:w-auto"
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
                  <Button className="w-full">Login to Subscribe</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Need help choosing?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Our team can help you find the perfect plan for your needs. Get in
              touch for a personalized recommendation.
            </p>
            <Button variant="link" className="p-0 h-auto mt-2">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
