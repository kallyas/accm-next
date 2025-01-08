"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Check } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // Added duration field
  services: string[];
  features: string[];
};

async function getPlans(): Promise<Plan[]> {
  const res = await fetch("/api/plans");
  if (!res.ok) {
    throw new Error("Failed to fetch plans");
  }
  return res.json();
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

  const mutation = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: (data) => {
      toast({
        title: "Subscription Submitted",
        description:
          "Your subscription request has been submitted for approval.",
      });

      // Reset form state
      setSelectedPlan(null);
      setPaymentProof(null);

      // Call optional success callback
      onSuccess(false);
      console.log("reached here");
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
    setSelectedPlan(null);
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
  const { data: session } = useSession();
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  const {
    handleSubscribe,
    isLoading: isSubscribing,
    isError,
    error,
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
    return <div>Loading plans...</div>;
  }

  if (!plans || plans.length === 0) {
    return <div>No plans available.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">
                ${plan.price.toFixed(2)}/{plan.duration} month
                {plan.duration > 1 ? "s" : ""}
              </p>
              <ul className="space-y-2">
                {plan.services.map((service, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {service}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{plan.name} Plan Details</DialogTitle>
                    <DialogDescription>{plan.description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-lg font-semibold">
                      Price: ${plan.price.toFixed(2)}/{plan.duration} month
                      {plan.duration > 1 ? "s" : ""}
                    </p>
                    <div>
                      <h4 className="font-semibold mb-2">Included Services:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {plan.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
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
                      onClick={() => {
                        setSubscriptionPlan(plan);
                        setOpen(true);
                      }}
                    >
                      Subscribe
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Subscribe to {plan?.name} Plan</DialogTitle>
                      <DialogDescription>
                        Please upload proof of payment to complete your
                        subscription.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="payment-proof">Payment Proof</Label>
                      <Input
                        id="payment-proof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        disabled={isSubscribing}
                        onClick={handleSubscribe}
                      >
                        {isSubscribing ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Link href="/login">
                  <Button>Login to Subscribe</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
